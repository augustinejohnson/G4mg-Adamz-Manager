import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, doc, getDoc, getDocs, limit, orderBy, startAfter, deleteDoc } from 'firebase/firestore';
import { db, moveToHistory } from './firebase';
import { X, Printer, Share2, AlertCircle, Trash2, Receipt as ReceiptIcon } from 'lucide-react';
import usePosStore from './store/usePosStore';

import PosProductGrid from './components/pos/PosProductGrid';
import PosCartSidebar from './components/pos/PosCartSidebar';
import PosPaymentModal from './components/pos/PosPaymentModal';
import PosShiftManager from './components/pos/PosShiftManager';

export default function PosModule({ currentTenant, currentUser, refreshData, warehouses, sales, viewingSaleId, setViewingSaleId }) {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  
  const {
    cart, setCart,
    selectedCustomer, setSelectedCustomer,
    manualCustomerName, setManualCustomerName,
    manualCustomerPhone, setManualCustomerPhone,
    discountPercent, setDiscountPercent,
    taxPercent, setTaxPercent,
    activeShift, setActiveShift,
    selectedWarehouseId, setSelectedWarehouseId,
    receiptData, setReceiptData,
    showResumePrompt, setShowResumePrompt,
    pendingTaskData, setPendingTaskData,
    isInitialized, setIsInitialized,
    showRecentSales, setShowRecentSales,
    recentSalesData, setRecentSalesData,
    lastSaleDoc, setLastSaleDoc,
    hasMoreSales, setHasMoreSales,
    isLoadingSales, setIsLoadingSales,
    printFormat, setPrintFormat,
    addToCart
  } = usePosStore();

  useEffect(() => {
    if (!currentUser?.warehouseId && warehouses?.length > 0 && !selectedWarehouseId) {
      setSelectedWarehouseId(warehouses[0].id);
    }
  }, [warehouses, currentUser, selectedWarehouseId]);

  useEffect(() => {
    if (viewingSaleId) {
      let saleToView = recentSalesData.find(s => s.id === viewingSaleId);
      if (!saleToView && sales?.length > 0) {
        saleToView = sales.find(s => s.id === viewingSaleId);
      }
      
      if (saleToView) {
        setReceiptData(saleToView);
        if (setViewingSaleId) setViewingSaleId(null);
      } else {
        const fetchSingleSale = async () => {
          try {
            const docSnap = await getDoc(doc(db, `organizations/${currentTenant}/sales`, viewingSaleId));
            if (docSnap.exists()) {
              setReceiptData({ id: docSnap.id, ...docSnap.data() });
              if (setViewingSaleId) setViewingSaleId(null);
            }
          } catch (err) { console.error("Failed to fetch sale", err); }
        };
        fetchSingleSale();
      }
    }
  }, [viewingSaleId, sales, recentSalesData, setViewingSaleId]);

  useEffect(() => {
    const savedShift = localStorage.getItem(`activeShift_${currentTenant}_${currentUser?.id || ''}`);
    if (savedShift) {
      setActiveShift(JSON.parse(savedShift));
    }

    const pendingTask = localStorage.getItem(`pos_pending_task_${currentTenant}_${currentUser?.id || ''}`);
    if (pendingTask) {
      try {
        const parsed = JSON.parse(pendingTask);
        if (parsed && parsed.cart && parsed.cart.length > 0) {
          setPendingTaskData(parsed);
          setShowResumePrompt(true);
        }
      } catch (err) {}
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (!isInitialized) return;
    
    if (cart.length > 0) {
      const taskData = {
        cart, selectedCustomer, manualCustomerName, manualCustomerPhone, discountPercent, taxPercent
      };
      localStorage.setItem(`pos_pending_task_${currentTenant}_${currentUser?.id || ''}`, JSON.stringify(taskData));
    } else {
      localStorage.removeItem(`pos_pending_task_${currentTenant}_${currentUser?.id || ''}`);
    }
  }, [cart, selectedCustomer, manualCustomerName, manualCustomerPhone, discountPercent, taxPercent, isInitialized]);

  const handleBarcodeScanned = (barcode) => {
    const product = products.find(p => p.sku === barcode || p.barcode === barcode);
    if (product) {
      addToCart({
        ...product, 
        price: Number(product.price || product.priceWholesale || product.priceRetail || 0),
        availableStock: getFilteredStock(product)
      });
    } else {
      alert(`Product with barcode ${barcode} not found.`);
    }
  };

  const getFilteredStock = (product) => {
    const activeWarehouse = selectedWarehouseId || currentUser?.warehouseId || (warehouses?.[0]?.id);
    const branchStock = product.stockByWarehouse || {};
    if (activeWarehouse) {
       return Number(branchStock[activeWarehouse] || 0);
    }
    return Object.values(branchStock).reduce((sum, val) => sum + (Number(val) || 0), 0) || Number(product.stock || 0);
  };

  useEffect(() => {
    let barcodeBuffer = '';
    let timeoutId = null;
    
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'Enter') {
        if (barcodeBuffer.length > 2) handleBarcodeScanned(barcodeBuffer);
        barcodeBuffer = '';
        if (timeoutId) clearTimeout(timeoutId);
      } else if (e.key.length === 1) {
        barcodeBuffer += e.key;
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => { barcodeBuffer = ''; }, 100);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [products, selectedWarehouseId]);

  useEffect(() => {
    if (!currentTenant) return;
    const unsubProducts = onSnapshot(collection(db, `organizations/${currentTenant}/products`), snap => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsubCustomers = onSnapshot(collection(db, `organizations/${currentTenant}/customers`), snap => {
      setCustomers(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => { unsubProducts(); unsubCustomers(); };
  }, [currentTenant]);

  const handleResumeTask = () => {
    if (pendingTaskData) {
      setCart(pendingTaskData.cart || []);
      setSelectedCustomer(pendingTaskData.selectedCustomer || null);
      setManualCustomerName(pendingTaskData.manualCustomerName || '');
      setManualCustomerPhone(pendingTaskData.manualCustomerPhone || '');
      setDiscountPercent(pendingTaskData.discountPercent || 0);
      setTaxPercent(pendingTaskData.taxPercent || 0);
    }
    setShowResumePrompt(false);
  };

  const handleDiscardTask = () => {
    localStorage.removeItem(`pos_pending_task_${currentTenant}_${currentUser?.id || ''}`);
    setPendingTaskData(null);
    setShowResumePrompt(false);
  };

  const loadRecentSales = async (loadMore = false) => {
    if (!currentTenant) return;
    if (loadMore && !hasMoreSales) return;
    setIsLoadingSales(true);
    
    try {
      let q = query(
        collection(db, `organizations/${currentTenant}/sales`),
        orderBy('date', 'desc'),
        limit(20)
      );

      if (loadMore && lastSaleDoc) {
        q = query(
          collection(db, `organizations/${currentTenant}/sales`),
          orderBy('date', 'desc'),
          startAfter(lastSaleDoc),
          limit(20)
        );
      }
      
      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (docs.length < 20) setHasMoreSales(false);
      else setHasMoreSales(true);

      if (snapshot.docs.length > 0) setLastSaleDoc(snapshot.docs[snapshot.docs.length - 1]);

      if (loadMore) setRecentSalesData(prev => [...prev, ...docs]);
      else setRecentSalesData(docs);
    } catch (err) {
      console.error("Error fetching recent sales:", err);
    } finally {
      setIsLoadingSales(false);
    }
  };

  useEffect(() => {
    if (showRecentSales && recentSalesData.length === 0) loadRecentSales();
  }, [showRecentSales]);

  const handleVoidSale = async (saleId) => {
    if (currentUser?.role !== 'admin') {
      alert("Only Admins can void or delete sales.");
      return;
    }
    if (!window.confirm("Are you sure you want to void this sale? This action is permanent and will delete the associated ledger entry.")) return;
    
    try {
      await moveToHistory('sales', saleId, 'POS Sale', 'Voided POS Sale', currentTenant);
      
      const ledgerQuery = query(collection(db, `organizations/${currentTenant}/ledger`));
      const ledgerSnapshot = await getDocs(ledgerQuery);
      ledgerSnapshot.forEach(async (docSnap) => {
        if (docSnap.data().referenceId === saleId) {
          await deleteDoc(doc(db, `organizations/${currentTenant}/ledger`, docSnap.id));
        }
      });
      
      alert("Sale and associated ledger entries successfully voided.");
      if (refreshData) await refreshData();
    } catch (err) {
      console.error(err);
      alert("Error voiding sale: " + err.message);
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row h-full bg-slate-50 relative overflow-hidden">
      
      {/* Mobile Toggle Tabs are now inside PosProductGrid/PosCartSidebar */}

      {/* LEFT PANEL: CART & CHECKOUT */}
      <PosCartSidebar 
        currentTenant={currentTenant}
        customers={customers}
      />

      {/* RIGHT PANEL: PRODUCTS LIST */}
      <PosProductGrid 
        products={products}
        warehouses={warehouses}
        currentUser={currentUser}
        activeShift={activeShift}
        handleBarcodeScanned={handleBarcodeScanned}
      />

      {/* Payment Modal */}
      <PosPaymentModal 
        currentTenant={currentTenant}
        currentUser={currentUser}
        refreshData={refreshData}
        warehouses={warehouses}
      />

      {/* Shift Management Modals */}
      <PosShiftManager 
        currentTenant={currentTenant}
        currentUser={currentUser}
      />

      {/* Modals directly managed by PosModule */}
      {receiptData && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col max-h-[90vh]">
             <div className="p-4 bg-slate-800 text-white flex justify-between items-center">
               <h3 className="font-bold">Transaction Complete</h3>
               <button onClick={() => setReceiptData(null)} className="text-slate-300 hover:text-white"><X className="w-5 h-5"/></button>
             </div>
             
             <div id="receipt-print-area" className="p-6 bg-white text-black flex-1 overflow-y-auto font-sans">
                <div className="text-center mb-6">
                   <h2 className="text-xl font-black">{receiptData.createdBy}</h2>
                   <p className="text-sm text-gray-500">Sales Receipt</p>
                   <p className="text-xs text-gray-400 mt-1">{new Date(receiptData.date).toLocaleString()}</p>
                   <p className="text-xs text-gray-400">Ref: {receiptData.id.substring(0,5).toUpperCase()}</p>
                </div>
                
                <div className="mb-4">
                   <p className="text-sm"><strong>Customer:</strong> {receiptData.customerName}</p>
                   {receiptData.customerPhone && <p className="text-sm"><strong>Phone:</strong> {receiptData.customerPhone}</p>}
                </div>
                
                <div className="border-t border-b border-gray-200 py-3 mb-4 space-y-2">
                   {receiptData.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                         <div>
                            <p className="font-bold">{item.name}</p>
                            <p className="text-xs text-gray-500">{item.quantity} x ₦{Number(item.price).toLocaleString()}</p>
                         </div>
                         <div className="font-bold">₦{(item.quantity * item.price).toLocaleString()}</div>
                      </div>
                   ))}
                </div>
                
                <div className="space-y-1 text-sm">
                   <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₦{(receiptData.totalAmount - receiptData.taxAmount + receiptData.discountAmount).toLocaleString()}</span></div>
                   {receiptData.discountAmount > 0 && <div className="flex justify-between"><span className="text-gray-500">Discount</span><span>- ₦{receiptData.discountAmount.toLocaleString()}</span></div>}
                   {receiptData.taxAmount > 0 && <div className="flex justify-between"><span className="text-gray-500">Tax</span><span>+ ₦{receiptData.taxAmount.toLocaleString()}</span></div>}
                   <div className="flex justify-between text-lg font-black mt-2 pt-2 border-t border-gray-200">
                      <span>Total</span><span>₦{receiptData.totalAmount.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between mt-1"><span className="text-gray-500">Payment</span><span className="font-bold">{receiptData.paymentMethod}</span></div>
                </div>
                
                <div className="text-center mt-8 text-xs text-gray-500">
                   Thank you for your business!
                </div>
             </div>
             
             <div className="p-4 bg-gray-50 border-t flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500">Print Format:</span>
                  <select value={printFormat} onChange={e => setPrintFormat(e.target.value)} className="flex-1 bg-white border border-gray-200 rounded-md text-sm p-1">
                    <option value="thermal">80mm Thermal (Small)</option>
                    <option value="a4">A4 Standard</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => {
                      const content = document.getElementById('receipt-print-area').innerHTML;
                      const printWin = window.open('', '_blank');
                      const pageStyle = printFormat === 'thermal' 
                        ? '@page { size: 80mm auto; margin: 0; } body { padding: 5mm; }'
                        : '@page { size: A4; margin: 20mm; }';
                      const wrapperClass = printFormat === 'thermal' ? 'w-full max-w-[80mm] mx-auto' : 'w-full max-w-2xl mx-auto';
                      
                      printWin.document.write(`<html><head><title>Print Receipt</title><script src="https://cdn.tailwindcss.com"></script><style>${pageStyle}</style></head><body onload="setTimeout(() => { window.print(); window.close(); }, 500);"><div class="${wrapperClass}">${content}</div></body></html>`);
                      printWin.document.close();
                    }}
                    className="flex-1 bg-slate-800 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Printer className="w-5 h-5"/> Print
                  </button>
                  <a 
                    href={`https://wa.me/${receiptData.customerPhone?.replace(/\D/g,'')}?text=Thank you for your purchase! Total: %23${receiptData.totalAmount.toLocaleString()} Ref: ${receiptData.id.substring(0,5).toUpperCase()}`}
                    target="_blank" rel="noreferrer"
                    className="flex-1 bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-5 h-5"/> WhatsApp
                  </a>
                </div>
             </div>
          </div>
        </div>
      )}

      {showResumePrompt && pendingTaskData && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden flex flex-col p-6 text-center animate-in slide-in-from-bottom-4 zoom-in-95 duration-200">
             <AlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
             <h2 className="text-xl font-black text-slate-800 mb-2">Pending Task Detected</h2>
             <p className="text-slate-500 text-sm mb-6">A POS transaction was interrupted. Would you like to resume it?</p>
             <div className="flex gap-4">
               <button onClick={handleDiscardTask} className="flex-1 bg-slate-100 text-slate-700 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors">Discard</button>
               <button onClick={handleResumeTask} className="flex-1 bg-amber-500 text-white py-3 rounded-xl font-bold hover:bg-amber-600 transition-colors">Resume Task</button>
             </div>
          </div>
        </div>
      )}

      {showRecentSales && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex justify-end z-[200]">
          <div className="bg-slate-50 w-full max-w-2xl h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-6 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Recent Sales History</h2>
                <p className="text-sm text-slate-500 font-medium mt-1">View and manage POS transactions</p>
              </div>
              <button onClick={() => setShowRecentSales(false)} className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {recentSalesData.filter(s => s.type === 'Sales Receipt' || s.description?.startsWith('POS Sale')).map(sale => (
                <div key={sale.id} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-slate-800 text-lg">₦{Number(sale.totalAmount || 0).toLocaleString()}</div>
                      <div className="text-sm text-slate-500 font-medium">{sale.customerName || 'Walk-in'} • {new Date(sale.date || sale.createdAt).toLocaleString()}</div>
                      <div className="text-xs text-slate-400 mt-1">Ref: {sale.id.substring(0,8).toUpperCase()} • Cashier: {sale.createdBy}</div>
                    </div>
                    {currentUser?.role === 'admin' && (
                      <button onClick={() => {
                        handleVoidSale(sale.id);
                        setRecentSalesData(prev => prev.filter(s => s.id !== sale.id));
                      }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-bold border border-transparent hover:border-red-100">
                        <Trash2 className="w-4 h-4" /> Void
                      </button>
                    )}
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3">
                    <div className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Items</div>
                    {(sale.items || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm py-1 border-b border-slate-100 last:border-0">
                        <span className="text-slate-700">{item.quantity}x {item.name}</span>
                        <span className="text-slate-600 font-medium">₦{(item.quantity * item.price).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {!isLoadingSales && recentSalesData.length === 0 && (
                <div className="text-center py-12 text-slate-400 font-medium">
                  <ReceiptIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  No recent sales found.
                </div>
              )}

              {hasMoreSales && recentSalesData.length > 0 && (
                <div className="flex justify-center pt-4">
                  <button 
                    onClick={() => loadRecentSales(true)} 
                    disabled={isLoadingSales}
                    className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors disabled:opacity-50"
                  >
                    {isLoadingSales ? 'Loading...' : 'Load Older Sales'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
