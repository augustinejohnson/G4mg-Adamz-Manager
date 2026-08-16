import React from 'react';
import { collection, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import usePosStore from '../../store/usePosStore';

export default function PosShiftManager({ currentTenant, currentUser }) {
  const {
    showStartShift, setShowStartShift,
    showEndShift, setShowEndShift,
    activeShift, setActiveShift,
    actualCash, setActualCash,
    openingFloat, setOpeningFloat
  } = usePosStore();

  return (
    <>
      {showStartShift && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in">
          <div className="bg-white rounded-3xl w-[400px] shadow-2xl p-6">
            <h2 className="text-2xl font-black text-slate-800 mb-2">Start Shift</h2>
            <p className="text-sm text-slate-500 mb-6">Enter your opening cash float to begin.</p>
            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Opening Cash (₦)</label>
              <input type="number" value={openingFloat} onChange={e => setOpeningFloat(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-recloud-500 text-lg font-bold" placeholder="e.g. 5000" autoFocus />
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowStartShift(false)}
                className="w-1/3 py-4 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-lg"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!openingFloat) return alert("Please enter opening float");
                  const shiftData = { startTime: Date.now(), openingFloat: Number(openingFloat), cashSales: 0, cardSales: 0, transferSales: 0 };
                  setActiveShift(shiftData);
                  localStorage.setItem(`activeShift_${currentTenant}_${currentUser?.id || ''}`, JSON.stringify(shiftData));
                  setShowStartShift(false);
                }}
                className="flex-1 py-4 font-bold text-white bg-recloud-600 hover:bg-recloud-700 rounded-xl transition-colors text-lg"
              >
                Open Register
              </button>
            </div>
          </div>
        </div>
      )}

      {showEndShift && activeShift && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in overflow-y-auto py-10">
          <div className="bg-white rounded-3xl w-[450px] shadow-2xl p-6 my-auto">
            <h2 className="text-2xl font-black text-slate-800 mb-2">End of Shift (Z-Report)</h2>
            <p className="text-sm text-slate-500 mb-6">Declare your cash drawer to close out the shift.</p>
            
            <div className="bg-slate-50 rounded-xl p-4 mb-6 space-y-3 border border-slate-200">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Opening Float</span>
                <span className="font-bold">₦{Number(activeShift?.openingFloat || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Cash Sales</span>
                <span className="font-bold text-emerald-600">+ ₦{Number(activeShift?.cashSales || 0).toLocaleString()}</span>
              </div>
              <div className="h-px bg-slate-200 w-full"></div>
              <div className="flex justify-between text-base">
                <span className="font-bold text-slate-700">Expected Cash in Drawer</span>
                <span className="font-black text-slate-800">₦{(Number(activeShift?.openingFloat || 0) + Number(activeShift?.cashSales || 0)).toLocaleString()}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-bold text-slate-700 mb-2">Actual Cash Counted (₦)</label>
              <input type="number" value={actualCash} onChange={e => setActualCash(e.target.value)} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-emerald-500 text-lg font-bold" placeholder="Enter counted cash" autoFocus />
              
              {actualCash !== '' && (
                <div className={`mt-2 text-sm font-bold ${Number(actualCash) === (Number(activeShift?.openingFloat || 0) + Number(activeShift?.cashSales || 0)) ? 'text-emerald-600' : 'text-red-500'}`}>
                  Difference: ₦{(Number(actualCash) - (Number(activeShift?.openingFloat || 0) + Number(activeShift?.cashSales || 0))).toLocaleString()}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowEndShift(false)} className="flex-1 py-4 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button 
                onClick={async () => {
                  if (actualCash === '') return alert("Please enter actual cash");
                  if (!window.confirm("Close out this shift? You will need to start a new shift to use the POS.")) return;
                  
                  try {
                    const diff = Number(actualCash) - (Number(activeShift.openingFloat) + Number(activeShift.cashSales));
                    const shiftReportsRef = collection(db, `organizations/${currentTenant}/shift_reports`);
                    setDoc(doc(shiftReportsRef), {
                      ...activeShift,
                      endTime: Date.now(),
                      actualCash: Number(actualCash),
                      difference: diff,
                      staffId: currentUser?.id?.substring(0, 6).toUpperCase(),
                      staffName: currentUser?.name,
                      timestamp: serverTimestamp()
                    }).catch(err => {
                      console.error("Error saving shift report:", err);
                    });

                    if (diff !== 0) {
                      const ledgerRef = collection(db, `organizations/${currentTenant}/ledger`);
                      setDoc(doc(ledgerRef), {
                        date: new Date().toISOString(),
                        description: `Shift Cash Discrepancy (${currentUser?.name})`,
                        type: diff > 0 ? 'Revenue' : 'Expense',
                        amount: Math.abs(diff),
                        paymentMethod: 'Cash',
                        createdBy: currentUser?.name || 'Staff',
                        timestamp: serverTimestamp(),
                        note: 'Auto-generated from POS shift close'
                      }).catch(console.error);
                    }
                  } catch (err) {
                    console.error("Error processing shift report:", err);
                    alert("Failed to process shift report. Continuing to close shift locally.");
                  }
                  
                  setActiveShift(null);
                  localStorage.removeItem(`activeShift_${currentTenant}_${currentUser?.id || ''}`);
                  setActualCash('');
                  setShowEndShift(false);
                }}
                className="flex-[2] py-4 font-bold text-white bg-slate-800 hover:bg-slate-900 rounded-xl transition-colors text-lg"
              >
                Close Register
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
