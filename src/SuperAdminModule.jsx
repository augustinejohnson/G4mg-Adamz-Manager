import React, { useState, useEffect } from 'react';
import { ShieldCheck, Building2, Search, CheckCircle2, XCircle, CreditCard, Clock, LogOut } from 'lucide-react';
import { collection, getDocs, doc, updateDoc, serverTimestamp, deleteDoc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from './firebase';
import { signOut } from 'firebase/auth';

export default function SuperAdminModule({ currentUser, setCurrentUser }) {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [paystackKey, setPaystackKey] = useState('');
  const [smtpEmail, setSmtpEmail] = useState('');
  const [smtpPassword, setSmtpPassword] = useState('');
  const [openAiKey, setOpenAiKey] = useState('');
  const [aiProvider, setAiProvider] = useState('openai'); // openai, anthropic, gemini, groq, custom
  const [aiBaseUrl, setAiBaseUrl] = useState('');

  const fetchPlatformSettings = async () => {
    try {
      const snap = await getDoc(doc(db, 'platform', 'settings'));
      if (snap.exists()) {
        setPaystackKey(snap.data().paystackLiveKey || '');
        setSmtpEmail(snap.data().smtpEmail || '');
        setSmtpPassword(snap.data().smtpPassword || '');
        setOpenAiKey(snap.data().openAiKey || '');
        setAiProvider(snap.data().aiProvider || 'openai');
        setAiBaseUrl(snap.data().aiBaseUrl || '');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSavePlatformSettings = async () => {
    try {
      await setDoc(doc(db, 'platform', 'settings'), { 
        paystackLiveKey: paystackKey,
        smtpEmail: smtpEmail,
        smtpPassword: smtpPassword,
        openAiKey: openAiKey,
        aiProvider: aiProvider,
        aiBaseUrl: aiBaseUrl
      }, { merge: true });
      alert('Global Platform Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings.');
    }
  };


  const fetchTenants = async () => {
    try {
      const colRef = collection(db, 'organizations');
      const snap = await getDocs(colRef);
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setTenants(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
    fetchPlatformSettings();
  }, []);

  const handleUpdateSubscription = async (tenantId, status, plan) => {
    if (status === 'delete') {
      const confirmText = prompt(`Type DELETE to permanently remove workspace ${tenantId}`);
      if (confirmText === 'DELETE') {
        try {
          await deleteDoc(doc(db, 'organizations', tenantId));
          alert('Workspace deleted successfully.');
          fetchTenants();
        } catch (err) {
          console.error(err);
          alert('Failed to delete workspace.');
        }
      }
      return;
    }

    if (!window.confirm(`Are you sure you want to change ${tenantId} to ${status.toUpperCase()} (${plan})?`)) return;
    
    try {
      const ref = doc(db, 'organizations', tenantId);
      await updateDoc(ref, {
        subscriptionStatus: status,
        subscriptionPlan: plan,
        updatedAt: serverTimestamp()
      });
      alert('Subscription updated successfully!');
      fetchTenants();
    } catch (err) {
      console.error(err);
      alert('Failed to update subscription');
    }
  };

  const filtered = tenants.filter(t => t.name?.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="p-8 text-center text-slate-500">Loading workspaces...</div>;

  return (
    <div className="p-6 md:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-recloud-600" />
              Super Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-2">Manage all registered workspaces, trials, and subscriptions.</p>
          </div>
          <div className="flex gap-4 items-center relative">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search workspaces..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 w-full md:w-80 outline-none focus:border-recloud-500 shadow-sm"
              />
            </div>
            <button onClick={() => { signOut(auth); setCurrentUser(null); }} className="flex items-center gap-2 bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2.5 rounded-xl font-bold transition-colors">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="p-4">Workspace</th>
                  <th className="p-4">Industry</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Trial Ends</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filtered.map(t => {
                  const isActive = t.subscriptionStatus === 'active';
                  const isTrial = t.subscriptionStatus === 'trial';
                  let isTrialExpired = false;
                  if (isTrial && t.trialEndsAt) {
                     isTrialExpired = new Date(t.trialEndsAt) < new Date();
                  }

                  return (
                    <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            {t.logo ? <img src={t.logo} alt="" className="w-full h-full object-contain rounded-lg" /> : <Building2 className="w-5 h-5 text-slate-400" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{t.name || t.id}</p>
                            <p className="text-xs text-slate-500 font-mono">{t.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 capitalize text-slate-600">{t.industry?.replace('_', ' ')}</td>
                      <td className="p-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold"><CheckCircle2 className="w-3.5 h-3.5"/> Active</span>
                        ) : isTrial ? (
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${isTrialExpired ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            <Clock className="w-3.5 h-3.5"/> {isTrialExpired ? 'Trial Expired' : 'On Trial'}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold"><XCircle className="w-3.5 h-3.5"/> Inactive</span>
                        )}
                      </td>
                      <td className="p-4 capitalize font-medium text-slate-700">{t.subscriptionPlan || 'None'}</td>
                      <td className="p-4 text-slate-500">
                        {t.trialEndsAt ? new Date(t.trialEndsAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <select 
                            onChange={(e) => {
                              if (e.target.value) {
                                const [status, plan] = e.target.value.split(':');
                                handleUpdateSubscription(t.id, status, plan);
                                e.target.value = '';
                              }
                            }}
                            className="bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 rounded-lg px-3 py-1.5 outline-none hover:bg-slate-200 cursor-pointer"
                          >
                            <option value="">Manage Access...</option>
                            <option value="active:lifetime">Grant Active (Lifetime)</option>
                            <option value="active:premium">Grant Active (Premium)</option>
                            <option value="active:basic">Grant Active (Basic)</option>
                            <option value="inactive:free">Revoke / Lock (Inactive)</option>
                            <option value="delete:workspace">Delete Workspace</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500">No workspaces found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PLATFORM SETTINGS */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden p-6">
          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-recloud-600" /> Platform Settings (Global)
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            <label className="block text-sm font-bold text-slate-700 mb-2">Recloud Global Paystack Live Key</label>
            <div className="flex flex-col md:flex-row gap-4">
              <input 
                type="text" 
                value={paystackKey}
                onChange={e => setPaystackKey(e.target.value)}
                className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-recloud-500/20 focus:border-recloud-500 outline-none transition-all font-mono" 
                placeholder="pk_live_..." 
              />
              <button 
                onClick={handleSavePlatformSettings}
                className="bg-recloud-600 hover:bg-recloud-700 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-all whitespace-nowrap"
              >
                Save Global Key
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">This is the master Paystack key used to bill ALL tenants for their ERP subscriptions. DO NOT put tenant keys here.</p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-6">
            <label className="block text-sm font-bold text-slate-700 mb-1">📧 Email Notification SMTP (Gmail)</label>
            <p className="text-xs text-slate-500 mb-4">This Gmail account will be used to send sale notifications to all tenants. You need a Gmail App Password (not your regular password). <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-recloud-600 underline font-semibold">Generate App Password →</a></p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Gmail Address</label>
                <input 
                  type="email" 
                  value={smtpEmail}
                  onChange={e => setSmtpEmail(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-recloud-500/20 focus:border-recloud-500 outline-none transition-all" 
                  placeholder="yourcompany@gmail.com" 
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Gmail App Password</label>
                <input 
                  type="password" 
                  value={smtpPassword}
                  onChange={e => setSmtpPassword(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-recloud-500/20 focus:border-recloud-500 outline-none transition-all font-mono" 
                  placeholder="xxxx xxxx xxxx xxxx" 
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mt-6">
            <h3 className="text-lg font-black text-slate-800 mb-4">🧠 AI Assistant Settings</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">AI Provider</label>
                <select 
                  value={aiProvider} 
                  onChange={e => setAiProvider(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-recloud-500/20 focus:border-recloud-500 outline-none transition-all bg-white"
                >
                  <option value="openai">OpenAI (Default)</option>
                  <option value="anthropic">Anthropic Claude</option>
                  <option value="gemini">Google Gemini</option>
                  <option value="groq">Groq</option>
                  <option value="custom">Custom Endpoint (e.g. Local LLM, OpenRouter)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">API Key</label>
                <p className="text-xs text-slate-500 mb-2">Leave blank to use the Offline Heuristic Engine.</p>
                <input 
                  type="password" 
                  value={openAiKey}
                  onChange={e => setOpenAiKey(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-recloud-500/20 focus:border-recloud-500 outline-none transition-all font-mono" 
                  placeholder={aiProvider === 'openai' ? 'sk-...' : 'Enter API Key'} 
                />
              </div>

              {aiProvider === 'custom' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Custom Base URL</label>
                  <input 
                    type="text" 
                    value={aiBaseUrl}
                    onChange={e => setAiBaseUrl(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-recloud-500/20 focus:border-recloud-500 outline-none transition-all font-mono" 
                    placeholder="https://your-local-llm/v1" 
                  />
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={handleSavePlatformSettings}
            className="mt-6 bg-recloud-600 hover:bg-recloud-700 text-white font-bold px-8 py-3 rounded-xl shadow-md transition-all"
          >
            Save All Platform Settings
          </button>
        </div>

      </div>
    </div>
  );
}
