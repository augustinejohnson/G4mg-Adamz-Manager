import React from 'react';

export default function TrialBalance({ COA, getAccountBalance }) {
  let totalDebit = 0;
  let totalCredit = 0;
  
  const accountBalances = Object.keys(COA).map(id => {
    const bal = getAccountBalance(id);
    if (bal === 0) return null;
    
    const isDebit = COA[id].normalBalance === 'Debit';
    let debit = 0, credit = 0;
    
    if (bal > 0) {
      if (isDebit) debit = bal; else credit = bal;
    } else {
      if (isDebit) credit = Math.abs(bal); else debit = Math.abs(bal);
    }
    
    totalDebit += debit;
    totalCredit += credit;
    
    return { id, name: COA[id].name, debit, credit };
  }).filter(Boolean);

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden relative z-10 max-w-4xl mx-auto">
      <div className="p-8 border-b border-white/50 bg-indigo-50/20">
        <h3 className="text-lg font-bold text-slate-800">Trial Balance</h3>
        <p className="text-sm text-slate-500">Ensuring total Debits = total Credits.</p>
      </div>
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
          <tr>
            <th className="px-6 py-4">Account ID</th>
            <th className="px-6 py-4">Account Name</th>
            <th className="px-6 py-4 text-right">Debit (₦)</th>
            <th className="px-6 py-4 text-right">Credit (₦)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {accountBalances.map(acc => (
            <tr key={acc.id} className="hover:bg-slate-50">
              <td className="px-6 py-3 font-mono text-slate-500">{acc.id}</td>
              <td className="px-6 py-3 font-medium text-slate-800">{acc.name}</td>
              <td className="px-6 py-3 text-right">{acc.debit > 0 ? acc.debit.toLocaleString() : '-'}</td>
              <td className="px-6 py-3 text-right">{acc.credit > 0 ? acc.credit.toLocaleString() : '-'}</td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-slate-100 font-black text-slate-800 border-t-2 border-slate-300">
          <tr>
            <td colSpan="2" className="px-6 py-4 text-right uppercase tracking-wider text-xs">Totals</td>
            <td className="px-6 py-4 text-right text-blue-600">₦{totalDebit.toLocaleString()}</td>
            <td className="px-6 py-4 text-right text-emerald-600">₦{totalCredit.toLocaleString()}</td>
          </tr>
        </tfoot>
      </table>
      {totalDebit !== totalCredit && (
        <div className="p-4 bg-red-100 text-red-800 font-bold text-center border-t border-red-200">
          Warning: Trial Balance is out of balance by ₦{Math.abs(totalDebit - totalCredit).toLocaleString()}
        </div>
      )}
    </div>
  );
}
