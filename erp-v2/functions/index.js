const functions = require('firebase-functions');
const { onDocumentWritten, onDocumentCreated } = require('firebase-functions/v2/firestore');
const { initializeApp } = require('firebase-admin/app');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

initializeApp();
const db = getFirestore();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

// ─── API Key Middleware ────────────────────────────────────────────────────────
const authenticateApiKey = async (req, res, next) => {
  const apiKey = req.header('x-api-key');
  if (!apiKey) {
    return res.status(401).json({ success: false, error: 'Missing x-api-key header. Add it like: x-api-key: sk_live_...' });
  }

  try {
    const snapshot = await db.collection('api_keys')
      .where('key', '==', apiKey)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ success: false, error: 'Invalid API key.' });
    }

    const keyDoc = snapshot.docs[0];
    const keyData = keyDoc.data();

    if (keyData.status !== 'active') {
      return res.status(401).json({ success: false, error: 'This API key has been revoked or is inactive.' });
    }

    // Log usage
    await keyDoc.ref.update({
      lastUsed: FieldValue.serverTimestamp(),
      usageCount: FieldValue.increment(1)
    }).catch(() => {});

    req.tenantId = keyData.tenantId;
    req.keyScope = keyData.scope || 'read'; // 'read' | 'read_write'
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(500).json({ success: false, error: 'Internal server error during authentication.' });
  }
};

// ─── Write Permission Guard ───────────────────────────────────────────────────
const requireWriteAccess = (req, res, next) => {
  if (req.keyScope !== 'read_write') {
    return res.status(403).json({
      success: false,
      error: 'This API key only has read access. Generate a read-write key in your ERP settings to create or update records.'
    });
  }
  next();
};

// Apply auth to all /v1 routes
app.use('/v1', authenticateApiKey);

// ─── Helpers ──────────────────────────────────────────────────────────────────
const toISO = (ts) => ts?.toDate ? ts.toDate().toISOString() : (ts || null);

const formatDoc = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: toISO(data.createdAt),
    updatedAt: toISO(data.updatedAt),
  };
};

const fetchCollection = async (tenantId, collectionName, res, query = {}) => {
  try {
    let ref = db.collection(`organizations/${tenantId}/${collectionName}`);
    // Basic filtering support via query params
    const limit = Math.min(parseInt(query.limit) || 100, 500);
    try { ref = ref.orderBy('createdAt', 'desc'); } catch {}
    ref = ref.limit(limit);

    const snapshot = await ref.get();
    const items = snapshot.docs.map(formatDoc);
    res.status(200).json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error(`Error fetching ${collectionName}:`, err);
    res.status(500).json({ success: false, error: `Failed to fetch ${collectionName}.` });
  }
};

const fetchDocument = async (tenantId, collectionName, docId, res) => {
  try {
    const docRef = await db.collection(`organizations/${tenantId}/${collectionName}`).doc(docId).get();
    if (!docRef.exists) return res.status(404).json({ success: false, error: 'Record not found.' });
    res.status(200).json({ success: true, data: formatDoc(docRef) });
  } catch (err) {
    res.status(500).json({ success: false, error: `Failed to fetch record.` });
  }
};

const createDocument = async (tenantId, collectionName, body, requiredFields, res) => {
  // Validate required fields
  const missing = requiredFields.filter(f => !body[f]);
  if (missing.length > 0) {
    return res.status(400).json({ success: false, error: `Missing required fields: ${missing.join(', ')}` });
  }
  try {
    const docRef = await db.collection(`organizations/${tenantId}/${collectionName}`).add({
      ...body,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      source: 'api'
    });
    res.status(201).json({ success: true, id: docRef.id, message: `${collectionName} record created.` });
  } catch (err) {
    res.status(500).json({ success: false, error: `Failed to create record.` });
  }
};

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/v1/health', async (req, res) => {
  try {
    const configDoc = await db.doc(`organizations/${req.tenantId}/config/settings`).get();
    const config = configDoc.data() || {};
    res.status(200).json({
      success: true,
      message: 'API is healthy. Your key is valid.',
      tenant: {
        id: req.tenantId,
        companyName: config.companyName || 'Unknown',
        industry: config.industry || 'retail',
      },
      keyScope: req.keyScope,
      timestamp: new Date().toISOString()
    });
  } catch {
    res.status(200).json({ success: true, message: 'API is healthy.', tenant: { id: req.tenantId } });
  }
});

// ─── Customers / Clients ─────────────────────────────────────────────────────
app.get('/v1/customers', (req, res) => fetchCollection(req.tenantId, 'customers', res, req.query));
app.get('/v1/customers/:id', (req, res) => fetchDocument(req.tenantId, 'customers', req.params.id, res));
app.post('/v1/customers', requireWriteAccess, (req, res) =>
  createDocument(req.tenantId, 'customers', req.body, ['name', 'email'], res));

// ─── Invoices ─────────────────────────────────────────────────────────────────
app.get('/v1/invoices', (req, res) => fetchCollection(req.tenantId, 'invoices', res, req.query));
app.get('/v1/invoices/:id', (req, res) => fetchDocument(req.tenantId, 'invoices', req.params.id, res));
app.post('/v1/invoices', requireWriteAccess, (req, res) =>
  createDocument(req.tenantId, 'invoices', req.body, ['customerName', 'totalAmount', 'status'], res));

// ─── Projects / Cases ─────────────────────────────────────────────────────────
app.get('/v1/projects', (req, res) => fetchCollection(req.tenantId, 'projects', res, req.query));
app.get('/v1/projects/:id', (req, res) => fetchDocument(req.tenantId, 'projects', req.params.id, res));
app.post('/v1/projects', requireWriteAccess, (req, res) =>
  createDocument(req.tenantId, 'projects', req.body, ['name', 'status'], res));

// ─── Employees / Staff ───────────────────────────────────────────────────────
app.get('/v1/employees', (req, res) => fetchCollection(req.tenantId, 'employees', res, req.query));
app.get('/v1/employees/:id', (req, res) => fetchDocument(req.tenantId, 'employees', req.params.id, res));

// ─── Expenses ────────────────────────────────────────────────────────────────
app.get('/v1/expenses', (req, res) => fetchCollection(req.tenantId, 'expenses', res, req.query));
app.get('/v1/expenses/:id', (req, res) => fetchDocument(req.tenantId, 'expenses', req.params.id, res));
app.post('/v1/expenses', requireWriteAccess, (req, res) =>
  createDocument(req.tenantId, 'expenses', req.body, ['description', 'amount', 'category'], res));

// ─── Inventory / Products ─────────────────────────────────────────────────────
app.get('/v1/inventory', (req, res) => fetchCollection(req.tenantId, 'inventory', res, req.query));
app.get('/v1/inventory/:id', (req, res) => fetchDocument(req.tenantId, 'inventory', req.params.id, res));
app.post('/v1/inventory', requireWriteAccess, (req, res) =>
  createDocument(req.tenantId, 'inventory', req.body, ['name', 'price'], res));

// ─── Sales (POS) ─────────────────────────────────────────────────────────────
app.get('/v1/sales', (req, res) => fetchCollection(req.tenantId, 'sales', res, req.query));
app.get('/v1/sales/:id', (req, res) => fetchDocument(req.tenantId, 'sales', req.params.id, res));

// ─── B2B Orders ──────────────────────────────────────────────────────────────
app.get('/v1/b2b-orders', (req, res) => fetchCollection(req.tenantId, 'b2bOrders', res, req.query));
app.get('/v1/b2b-orders/:id', (req, res) => fetchDocument(req.tenantId, 'b2bOrders', req.params.id, res));

// ─── Contracts ───────────────────────────────────────────────────────────────
app.get('/v1/contracts', (req, res) => fetchCollection(req.tenantId, 'contracts', res, req.query));
app.get('/v1/contracts/:id', (req, res) => fetchDocument(req.tenantId, 'contracts', req.params.id, res));
app.post('/v1/contracts', requireWriteAccess, (req, res) =>
  createDocument(req.tenantId, 'contracts', req.body, ['customerName', 'serviceName', 'amount', 'status'], res));

// ─── Documents metadata ───────────────────────────────────────────────────────
app.get('/v1/documents', (req, res) => fetchCollection(req.tenantId, 'documents', res, req.query));

// ─── Deals (CRM) ─────────────────────────────────────────────────────────────
app.get('/v1/deals', (req, res) => fetchCollection(req.tenantId, 'deals', res, req.query));
app.get('/v1/deals/:id', (req, res) => fetchDocument(req.tenantId, 'deals', req.params.id, res));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Endpoint not found: ${req.method} ${req.path}` });
});

exports.api = functions.https.onRequest(app);

// ─── Webhook Dispatcher ──────────────────────────────────────────────────────
const SUPPORTED_COLLECTIONS = ['customers', 'invoices', 'projects', 'employees'];

exports.webhookDispatcher = onDocumentWritten('organizations/{tenantId}/{collectionId}/{docId}', async (event) => {
  const { tenantId, collectionId, docId } = event.params;
  
  // Only process supported collections to save invocations
  if (!SUPPORTED_COLLECTIONS.includes(collectionId)) return;

  const beforeData = event.data.before.exists ? event.data.before.data() : null;
  const afterData = event.data.after.exists ? event.data.after.data() : null;

  let eventType = '';
  if (!beforeData && afterData) eventType = `${collectionId}.created`;
  else if (beforeData && !afterData) eventType = `${collectionId}.deleted`;
  else if (beforeData && afterData) eventType = `${collectionId}.updated`;

  if (!eventType) return;

  // Fetch all active webhooks for this tenant and this event
  const webhooksSnapshot = await db.collection('webhooks')
    .where('tenantId', '==', tenantId)
    .where('event', '==', eventType)
    .where('isActive', '==', true)
    .get();

  if (webhooksSnapshot.empty) return; // No webhooks listening to this

  const payload = {
    event: eventType,
    tenantId,
    timestamp: new Date().toISOString(),
    data: {
      id: docId,
      ...afterData || beforeData
    }
  };

  const promises = [];
  webhooksSnapshot.forEach((docSnap) => {
    const webhook = docSnap.data();
    const url = webhook.targetUrl;
    
    // Dispatch via fetch
    const p = fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'User-Agent': 'Recloud-ERP-Webhook/1.0' },
      body: JSON.stringify(payload)
    }).then(async (res) => {
      // Update lastTriggered timestamp
      await docSnap.ref.update({ lastTriggered: FieldValue.serverTimestamp() });
      console.log(`Webhook fired successfully: ${url} for ${eventType}`);
    }).catch(err => {
      console.error(`Webhook failed: ${url}`, err);
    });
    
    promises.push(p);
  });

  await Promise.all(promises);
});

// ─── Sale Email Notification ─────────────────────────────────────────────────
exports.onSaleCreated = onDocumentCreated('organizations/{tenantId}/sales/{saleId}', async (event) => {
  const { tenantId, saleId } = event.params;
  const sale = event.data.data();

  if (!sale) return;

  try {
    // Read tenant config for notification email
    const tenantSettingsDoc = await db.doc(`organizations/${tenantId}/config/settings`).get();
    const tenantConfig = tenantSettingsDoc.exists ? tenantSettingsDoc.data() : {};
    const notificationEmail = tenantConfig.notificationEmail;
    const companyName = tenantConfig.companyName || 'Recloud ERP';

    if (!notificationEmail) {
      console.log(`[Sale Notification] No notification email set for tenant ${tenantId}. Skipping.`);
      return;
    }

    // Read platform SMTP config
    const platformDoc = await db.doc('platform/settings').get();
    const platformConfig = platformDoc.exists ? platformDoc.data() : {};
    const smtpEmail = platformConfig.smtpEmail;
    const smtpPassword = platformConfig.smtpPassword;

    if (!smtpEmail || !smtpPassword) {
      console.log('[Sale Notification] SMTP credentials not configured in platform settings. Skipping.');
      return;
    }

    // Build items table
    const items = sale.items || [];
    const itemRows = items.map(item => `
      <tr>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;">${item.name || 'Unknown'}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-align:center;">${item.quantity || 1}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-align:right;">₦${Number(item.price || 0).toLocaleString()}</td>
        <td style="padding:10px 14px;border-bottom:1px solid #f1f5f9;font-size:14px;color:#334155;text-align:right;font-weight:600;">₦${(Number(item.price || 0) * Number(item.quantity || 1)).toLocaleString()}</td>
      </tr>
    `).join('');

    const saleDate = sale.date ? new Date(sale.date).toLocaleString('en-NG', { dateStyle: 'full', timeStyle: 'short' }) : new Date().toLocaleString('en-NG');
    const totalAmount = Number(sale.totalAmount || 0).toLocaleString();
    const taxAmount = Number(sale.taxAmount || 0).toLocaleString();
    const discountAmount = Number(sale.discountAmount || 0).toLocaleString();

    const htmlEmail = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <div style="max-width:600px;margin:30px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:28px 30px;">
          <h1 style="margin:0;color:#fff;font-size:20px;font-weight:700;">💰 New Sale Completed</h1>
          <p style="margin:6px 0 0;color:#c7d2fe;font-size:13px;">${companyName} • ${saleDate}</p>
        </div>

        <!-- Sale Info -->
        <div style="padding:24px 30px 16px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Customer</td>
              <td style="padding:8px 0;font-size:14px;color:#1e293b;font-weight:600;text-align:right;">${sale.customerName || 'Walk-in'}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Payment</td>
              <td style="padding:8px 0;font-size:14px;color:#1e293b;font-weight:600;text-align:right;">${sale.paymentMethod || 'Cash'}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Cashier</td>
              <td style="padding:8px 0;font-size:14px;color:#1e293b;font-weight:600;text-align:right;">${sale.createdBy || 'Staff'}</td>
            </tr>
            <tr>
              <td style="padding:8px 0;font-size:13px;color:#94a3b8;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Receipt #</td>
              <td style="padding:8px 0;font-size:14px;color:#1e293b;font-weight:600;text-align:right;">${saleId.substring(0, 8).toUpperCase()}</td>
            </tr>
          </table>
        </div>

        <!-- Items Table -->
        <div style="padding:0 30px 16px;">
          <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;overflow:hidden;">
            <thead>
              <tr style="background:#e2e8f0;">
                <th style="padding:12px 14px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;text-align:left;font-weight:700;">Item</th>
                <th style="padding:12px 14px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;text-align:center;font-weight:700;">Qty</th>
                <th style="padding:12px 14px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;text-align:right;font-weight:700;">Price</th>
                <th style="padding:12px 14px;font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;text-align:right;font-weight:700;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemRows}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div style="padding:0 30px 24px;">
          <table style="width:100%;border-collapse:collapse;">
            ${Number(sale.taxAmount || 0) > 0 ? `
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;">Tax (${sale.taxPercent || 0}%)</td>
              <td style="padding:6px 0;font-size:14px;color:#334155;text-align:right;">+ ₦${taxAmount}</td>
            </tr>` : ''}
            ${Number(sale.discountAmount || 0) > 0 ? `
            <tr>
              <td style="padding:6px 0;font-size:13px;color:#64748b;">Discount</td>
              <td style="padding:6px 0;font-size:14px;color:#ef4444;text-align:right;">- ₦${discountAmount}</td>
            </tr>` : ''}
            <tr>
              <td colspan="2" style="padding:12px 0 0;border-top:2px solid #e2e8f0;"></td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:18px;color:#1e293b;font-weight:800;">TOTAL</td>
              <td style="padding:4px 0;font-size:22px;color:#16a34a;font-weight:900;text-align:right;">₦${totalAmount}</td>
            </tr>
          </table>
        </div>

        <!-- Footer -->
        <div style="background:#f1f5f9;padding:16px 30px;text-align:center;">
          <p style="margin:0;font-size:11px;color:#94a3b8;">This is an automated notification from ${companyName} via Recloud ERP</p>
        </div>
      </div>
    </body>
    </html>`;

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpEmail,
        pass: smtpPassword,
      },
    });

    // Send email
    await transporter.sendMail({
      from: `"${companyName}" <${smtpEmail}>`,
      to: notificationEmail,
      subject: `💰 New Sale: ₦${totalAmount} — ${sale.customerName || 'Walk-in'} (${sale.paymentMethod || 'Cash'})`,
      html: htmlEmail,
    });

    console.log(`[Sale Notification] Email sent to ${notificationEmail} for sale ${saleId}`);
  } catch (err) {
    console.error('[Sale Notification] Error sending email:', err);
  }
});

