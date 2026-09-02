import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText } from 'lucide-react';

export default function Ledger({ journalEntries, COA }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-900/5 border border-white/50 overflow-hidden animate-in fade-in relative z-10">
      <div className="p-8 border-b border-white/50 bg-indigo-50/20 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Double-Entry Journal</h3>
          <p className="text-sm text-slate-500">All automated and manual double-entry records.</p>
        </div>
        <button onClick={() => {
          const doc = new jsPDF();
          doc.setFontSize(20);
          doc.text("Journal Entries", 14, 22);
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
          
          const tableColumn = ["Date", "Account", "Description", "Debit", "Credit"];
          const tableRows = [];
          journalEntries.forEach(entry => {
            let dateStr = 'N/A';
            if (entry.date) {
              const d = new Date(entry.date?.seconds ? entry.date.seconds * 1000 : entry.date);
              if (!isNaN(d.getTime())) dateStr = d.toLocaleString();
            }
            tableRows.push([
              dateStr,
              `${COA[entry.account]?.name || 'Unknown'} (${entry.account})`,
              entry.desc,
              entry.type === 'Debit' ? entry.amount.toLocaleString() : '-',
              entry.type === 'Credit' ? entry.amount.toLocaleString() : '-'
            ]);
          });
          
          autoTable(doc, {
            startY: 40,
            head: [tableColumn],
            body: tableRows,
            theme: 'grid',
            headStyles: { fillColor: [44, 62, 80] }
          });
          doc.save(`Journal_Entries_${new Date().toISOString().split('T')[0]}.pdf`);
        }} className="bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-2 px-4 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm justify-center">
          <FileText className="w-4 h-4" /> Export PDF
        </button>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="w-full text-left text-sm relative">
          <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0 shadow-sm z-20">
            <tr>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Account</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-right">Debit</th>
              <th className="px-6 py-4 text-right">Credit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {journalEntries.map(entry => {
              let dateStr = 'N/A';
              if (entry.date) {
                const d = new Date(entry.date?.seconds ? entry.date.seconds * 1000 : entry.date);
                if (!isNaN(d.getTime())) dateStr = d.toLocaleString();
              }
              return (
              <tr key={entry.id} className="hover:bg-slate-50">
                <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                  {dateStr}
                </td>
                <td className="px-6 py-3 font-medium text-slate-800 whitespace-nowrap">
                  {COA[entry.account]?.name || 'Unknown'} <span className="text-xs text-slate-400 font-mono">({entry.account})</span>
                </td>
                <td className="px-6 py-3 text-slate-600">{entry.desc}</td>
                <td className="px-6 py-3 text-right font-mono text-blue-600 font-bold">
                  {entry.type === 'Debit' ? `₦${entry.amount.toLocaleString()}` : ''}
                </td>
                <td className="px-6 py-3 text-right font-mono text-emerald-600 font-bold">
                  {entry.type === 'Credit' ? `₦${entry.amount.toLocaleString()}` : ''}
                </td>
              </tr>
              );
            })}
            {journalEntries.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-slate-500">No journal entries found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
