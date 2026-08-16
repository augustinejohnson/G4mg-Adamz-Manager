import React from 'react';
import { Banknote, CreditCard, Receipt as ReceiptIcon, CheckCircle2 } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import usePosStore from '../../store/usePosStore';

export default function PosPaymentModal({ 
  currentTenant, 
  currentUser, 
  refreshData,
  warehouses 
}) {
  const {
    cart, setCart,
    selectedCustomer, setSelectedCustomer,
    manualCustomerName, setManualCustomerName,
    manualCustomerPhone, setManualCustomerPhone,
    discountPercent, taxPercent,
    showPaymentModal, setShowPaymentModal,
    paymentMethod, setPaymentMethod,
    splitAmounts, setSplitAmounts,
    activeShift, setActiveShift,
    selectedWarehouseId,
    setReceiptData,
    isProcessing, setIsProcessing
  } = usePosStore();

  if (!showPaymentModal) return null;

  const cartTotal = cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
  const total = cartTotal - (cartTotal * (Number(discountPercent) || 0) / 100) + (cartTotal * (Number(taxPercent) || 0) / 100);

  const simulateTerminalSync = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      handleCheckout();
    }, 2000);
  };

  const handleCheckout = async (e) => {
    if (e) e.preventDefault();
    if (cart.length === 0) return alert('Cart is empty.');
    setIsProcessing(true);
    try {
      const salesRef = collection(db, `organizations/${currentTenant}/sales`);
      const taxAmt = cartTotal * (Number(taxPercent)||0) / 100;
      const discAmt = cartTotal * (Number(discountPercent)||0) / 100;
      const saleData = {
        customerName: selectedCustomer ? selectedCustomer.name : (manualCustomerName || 'Walk-in'),
        customerPhone: selectedCustomer ? (selectedCustomer.phone || '') : (manualCustomerPhone || ''),
        items: cart,
        totalAmount: total,
        taxAmount: taxAmt,
        taxPercent: Number(taxPercent)||0,
        discountAmount: discAmt,
        paymentMethod: paymentMethod,
        splitAmounts: paymentMethod === 'Split' ? splitAmounts : null,
        date: new Date().toISOString(),
        timestamp: serverTimestamp(),
        createdBy: currentUser?.name || 'Staff',
        status: 'Paid',
        type: 'Sales Receipt'
      };
      const newSaleRef = doc(salesRef);
      setDoc(newSaleRef, saleData).catch(console.error); // Fire and forget for offline safety
      const newSaleId = newSaleRef.id;

      // Add to Ledger for Accounting Sync
      const ledgerRef = collection(db, `organizations/${currentTenant}/ledger`);
      const newLedgerRef = doc(ledgerRef);
      setDoc(newLedgerRef, {
        date: new Date().toISOString(),
        description: `POS Sale: ${newSaleId}`,
        referenceId: newSaleId,
        type: 'Revenue',
        amount: total,
        taxCollected: taxAmt,
        paymentMethod: paymentMethod,
        createdBy: currentUser?.name || 'Staff',
        timestamp: serverTimestamp(),
        source: 'pos'
      }).catch(console.error);

      if (activeShift) {
        let updatedShift = { ...activeShift };
        if (paymentMethod === 'Cash') {
          updatedShift.cashSales = (updatedShift.cashSales || 0) + total;
        } else if (paymentMethod === 'Card') {
          updatedShift.cardSales = (updatedShift.cardSales || 0) + total;
        } else if (paymentMethod === 'Transfer') {
          updatedShift.transferSales = (updatedShift.transferSales || 0) + total;
        } else if (paymentMethod === 'Split') {
          updatedShift.cashSales = (updatedShift.cashSales || 0) + Number(splitAmounts.cash || 0);
          updatedShift.cardSales = (updatedShift.cardSales || 0) + Number(splitAmounts.card || 0);
          updatedShift.transferSales = (updatedShift.transferSales || 0) + Number(splitAmounts.transfer || 0);
        }
        setActiveShift(updatedShift);
        localStorage.setItem(`activeShift_${currentTenant}_${currentUser?.id || ''}`, JSON.stringify(updatedShift));
      }

      // Deduct stock properly
      const activeWarehouseId = selectedWarehouseId || currentUser?.warehouseId || warehouses?.[0]?.id;

      for (const item of cart) {
        if (item.id) {
          const prodRef = doc(db, `organizations/${currentTenant}/products`, item.id);
          const movementsRef = collection(db, `organizations/${currentTenant}/stockMovements`);
          
          if (activeWarehouseId) {
             updateDoc(prodRef, {
               [`stockByWarehouse.${activeWarehouseId}`]: increment(-item.quantity)
             }).catch(console.error);
             
             setDoc(doc(movementsRef), {
               productId: item.id,
               type: 'out',
               qty: item.quantity,
               warehouseId: activeWarehouseId,
               note: `POS Sale`,
               date: new Date().toISOString()
             }).catch(console.error);
          } else {
             updateDoc(prodRef, { stock: increment(-item.quantity) }).catch(console.error);
          }
        }
      }

      if (refreshData) {
        // Do not block checkout if refreshData fails (e.g. offline)
        refreshData().catch(console.error); 
      }
      
      setReceiptData({ id: newSaleId, ...saleData });
      
      setCart([]);
      setSelectedCustomer(null);
      setManualCustomerName('');
      setManualCustomerPhone('');
      setShowPaymentModal(false);
      setPaymentMethod('Cash');
      setSplitAmounts({ cash: '', card: '', transfer: '' });
      localStorage.removeItem(`pos_pending_task_${currentTenant}_${currentUser?.id || ''}`);
    } catch (err) {
      console.error(err);
      alert('Error processing checkout: ' + err.message);
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
      <div className="bg-white rounded-3xl w-[500px] shadow-2xl overflow-hidden animate-in zoom-in-95">
        <div className="p-6 bg-emerald-600 text-white text-center">
          <h2 className="text-xl font-medium opacity-90 mb-1">Total to Pay</h2>
          <div className="text-5xl font-black tracking-tight">₦{Number(total || 0).toLocaleString(undefined, {minimumFractionDigits:2})}</div>
        </div>
        <div className="p-6">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Select Payment Method</h3>
          <div className="grid grid-cols-4 gap-3 mb-6">
            <button onClick={() => setPaymentMethod('Cash')} className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${paymentMethod === 'Cash' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}>
              <Banknote className="w-8 h-8" />
              <span className="font-bold">Cash</span>
            </button>
            <button onClick={() => setPaymentMethod('POS / Card')} className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${paymentMethod === 'POS / Card' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}>
              <CreditCard className="w-8 h-8" />
              <span className="font-bold">Card</span>
            </button>
            <button onClick={() => setPaymentMethod('Transfer')} className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${paymentMethod === 'Transfer' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}>
              <ReceiptIcon className="w-8 h-8" />
              <span className="font-bold text-[11px]">Transfer</span>
            </button>
            <button onClick={() => setPaymentMethod('Split')} className={`p-4 rounded-xl flex flex-col items-center justify-center gap-2 border-2 transition-all ${paymentMethod === 'Split' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}>
              <div className="flex -space-x-2"><Banknote className="w-5 h-5" /><CreditCard className="w-5 h-5" /></div>
              <span className="font-bold text-[11px]">Split Pay</span>
            </button>
          </div>

          {paymentMethod === 'Split' && (
            <div className="mb-6 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="text-sm font-bold text-slate-600 mb-2">Enter Split Amounts</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cash (₦)</span>
                <input type="number" value={splitAmounts.cash} onChange={e => setSplitAmounts({...splitAmounts, cash: e.target.value})} className="w-32 border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Card (₦)</span>
                <input type="number" value={splitAmounts.card} onChange={e => setSplitAmounts({...splitAmounts, card: e.target.value})} className="w-32 border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Transfer (₦)</span>
                <input type="number" value={splitAmounts.transfer} onChange={e => setSplitAmounts({...splitAmounts, transfer: e.target.value})} className="w-32 border border-slate-300 rounded-lg px-3 py-1.5 outline-none focus:border-emerald-500" />
              </div>
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-200 font-bold text-emerald-700">
                <span>Split Total</span>
                <span>₦{(Number(splitAmounts.cash) + Number(splitAmounts.card) + Number(splitAmounts.transfer)).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>
          )}
          
          <div className="flex flex-col gap-3">
            {paymentMethod === 'POS / Card' && (
              <button onClick={simulateTerminalSync} disabled={isProcessing} className="w-full py-3 font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 hover:bg-emerald-200 disabled:opacity-50 rounded-2xl transition-colors flex items-center justify-center gap-2">
                {isProcessing ? 'Waiting for Terminal Tap...' : <><CreditCard className="w-5 h-5"/> Sync Smart Terminal & Pay</>}
              </button>
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowPaymentModal(false)} disabled={isProcessing} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors">Cancel</button>
              <button onClick={(e) => handleCheckout(e)} disabled={isProcessing} className="flex-[2] py-4 font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-2xl transition-colors flex items-center justify-center gap-2">
                {isProcessing ? 'Processing...' : <><CheckCircle2 className="w-5 h-5"/> Complete Sale (Manual)</>}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
