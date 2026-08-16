import React from 'react';
import { ShoppingCart, User, Plus, Minus, PauseCircle, CreditCard, ArrowLeft } from 'lucide-react';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import usePosStore from '../../store/usePosStore';

export default function PosCartSidebar({ currentTenant, customers }) {
  const {
    cart, setCart, updateQuantity, holdCart,
    selectedCustomer, setSelectedCustomer,
    manualCustomerName, setManualCustomerName,
    manualCustomerPhone, setManualCustomerPhone,
    discountPercent, setDiscountPercent,
    taxPercent, setTaxPercent,
    setShowPaymentModal, setIsProcessing,
    mobileView, setMobileView
  } = usePosStore();

  const cartTotal = cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
  const total = cartTotal - (cartTotal * (Number(discountPercent) || 0) / 100) + (cartTotal * (Number(taxPercent) || 0) / 100);

  return (
    <div className={`w-full md:w-[450px] shrink-0 bg-white border-r border-slate-200 flex-col shadow-2xl z-10 h-full ${mobileView === 'cart' ? 'flex' : 'hidden md:flex'}`}>
      {/* Cart Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setMobileView('products')} 
            className="md:hidden p-1.5 mr-1 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-bold text-slate-800 flex items-center gap-2"><ShoppingCart className="w-5 h-5 text-recloud-500" /> Current Order</h2>
        </div>
        <div className="flex gap-2">
          {cart.length > 0 && (
            <button onClick={holdCart} className="text-xs font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors">
              <PauseCircle className="w-4 h-4" /> Hold
            </button>
          )}
          <button onClick={() => setCart([])} className="text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors">Clear</button>
        </div>
      </div>

      {/* Customer Selection */}
      <div className="p-4 border-b border-slate-100 bg-white">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
          <User className="w-4 h-4" /> Customer
        </div>
        <select 
          value={selectedCustomer ? selectedCustomer.id : ''} 
          onChange={e => {
            const c = customers.find(x => x.id === e.target.value);
            setSelectedCustomer(c || null);
          }} 
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-recloud-500 mb-2"
        >
          <option value="">Walk-in / Manual Entry</option>
          {customers.map(c => (
            <option key={c.id} value={c.id}>{c.name} {c.phone ? `(${c.phone})` : ''}</option>
          ))}
        </select>
        {!selectedCustomer && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <input type="text" placeholder="Name (Optional)" value={manualCustomerName} onChange={e => setManualCustomerName(e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-recloud-500" />
              <input type="text" placeholder="Phone (Optional)" value={manualCustomerPhone} onChange={e => setManualCustomerPhone(e.target.value)} className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-recloud-500" />
            </div>
            {manualCustomerName && (
              <button 
                onClick={async () => {
                  if (!manualCustomerName) return;
                  try {
                    setIsProcessing(true);
                    const newCustRef = doc(collection(db, `organizations/${currentTenant}/customers`));
                    setDoc(newCustRef, {
                      name: manualCustomerName,
                      phone: manualCustomerPhone,
                      status: 'Active',
                      createdAt: serverTimestamp()
                    }).catch(console.error);
                    setSelectedCustomer({ id: newCustRef.id, name: manualCustomerName, phone: manualCustomerPhone });
                    setManualCustomerName('');
                    setManualCustomerPhone('');
                  } catch (err) {
                    alert("Failed to save customer");
                  } finally {
                    setIsProcessing(false);
                  }
                }}
                className="w-full text-xs font-bold bg-recloud-50 text-recloud-600 hover:bg-recloud-100 py-2 rounded-lg transition-colors border border-recloud-200"
              >
                + Save as New Customer
              </button>
            )}
          </div>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1 min-h-0">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-slate-400">
            <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
            <p className="text-sm font-medium">Cart is empty</p>
            <p className="text-xs mt-1 text-slate-300">Select products from the right to add</p>
          </div>
        ) : (
          cart.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:border-slate-200 transition-colors shadow-sm">
              <div className="flex-1 min-w-0 w-full">
                <h4 className="font-bold text-slate-800 text-sm break-words">{item.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-recloud-600 font-bold">₦{Number(item.price || 0).toLocaleString()}</span>
                </div>
              </div>
              <div className="flex items-center justify-between w-full md:w-auto">
                <div className="flex items-center gap-1 bg-slate-50 rounded-lg p-1 border border-slate-100 shrink-0">
                  <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-slate-400 hover:text-red-500 hover:bg-white rounded transition-colors"><Minus className="w-4 h-4" /></button>
                  <input type="number" min="1" value={item.quantity} onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: '' } : i));
                    } else {
                      const newQty = parseInt(val);
                      if (!isNaN(newQty)) {
                        setCart(cart.map(i => i.id === item.id ? { ...i, quantity: newQty } : i));
                      }
                    }
                  }} onBlur={(e) => {
                    if (!parseInt(e.target.value) || parseInt(e.target.value) < 1) {
                      setCart(cart.map(i => i.id === item.id ? { ...i, quantity: 1 } : i));
                    }
                  }} className="w-10 text-center text-sm font-bold text-slate-700 bg-transparent outline-none border border-slate-200 rounded hide-spin-button px-0.5" />
                  <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-slate-400 hover:text-emerald-500 hover:bg-white rounded transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                <div className="w-auto md:w-20 text-right font-bold text-slate-800 pl-2">
                  ₦{(Number(item.quantity || 0) * Number(item.price || 0)).toLocaleString()}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Totals & Checkout */}
      <div className="bg-slate-50 border-t border-slate-200 p-4">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Subtotal</span>
            <span className="text-slate-800 font-bold">₦{Number(cartTotal || 0).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Discount (%)</span>
            <input type="number" min="0" max="100" value={discountPercent} onChange={e => setDiscountPercent(e.target.value)} className="w-16 text-right border border-slate-200 rounded px-2 py-0.5 outline-none focus:border-recloud-500" />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500 font-medium">Tax/VAT (%)</span>
            <input type="number" min="0" max="100" value={taxPercent} onChange={e => setTaxPercent(e.target.value)} className="w-16 text-right border border-slate-200 rounded px-2 py-0.5 outline-none focus:border-recloud-500" />
          </div>
          <div className="h-px bg-slate-200 w-full my-2"></div>
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-slate-800">Total</span>
            <span className="text-2xl font-black text-emerald-600">₦{Number(total || 0).toLocaleString(undefined, {minimumFractionDigits:2})}</span>
          </div>
        </div>
        
        <button onClick={() => setShowPaymentModal(true)} disabled={cart.length === 0} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 rounded-2xl shadow-lg transition-colors flex items-center justify-center gap-2 text-lg">
          <CreditCard className="w-6 h-6" /> Charge ₦{Number(total || 0).toLocaleString(undefined, {minimumFractionDigits:2})}
        </button>
      </div>
    </div>
  );
}
