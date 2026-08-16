import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FileText } from 'lucide-react';

export default function ProfitAndLoss({ 
  totalGrossRevenue, 
  posSalesTotal, 
  b2bSalesTotal, 
  crmSalesTotal, 
  totalCOGS, 
  posCogsTotal, 
  b2bCogsTotal, 
  grossProfit, 
  totalOperatingExpenses, 
  approvedExpenses, 
  ledgerExpenses, 
  payrollExpenses, 
  netIncome, 
  currentIndustry 
}) {
  return (
    <div className="space-y-6 animate-in fade-in max-w-4xl mx-auto relative z-10">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Profit & Loss</h2>
          <p className="text-slate-500 font-medium text-sm">Income and expenses over the selected period.</p>
        </div>
        <button onClick={() => {
          const doc = new jsPDF();
          doc.setFontSize(20);
          doc.text("Profit & Loss Statement", 14, 22);
          doc.setFontSize(10);
          doc.setTextColor(100);
          doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
          
          autoTable(doc, {
            startY: 40,
            head: [['Description', 'Amount']],
            body: [
              ['Gross Revenue', `NGN ${totalGrossRevenue.toLocaleString()}`],
              ...((currentIndustry !== 'law_firm') ? [
                ['  - POS Retail Sales', `NGN ${posSalesTotal.toLocaleString()}`],
                ['  - B2B Wholesale Orders', `NGN ${b2bSalesTotal.toLocaleString()}`]
              ] : []),
              ['  - CRM Invoices (Paid)', `NGN ${crmSalesTotal.toLocaleString()}`],
              ...((currentIndustry !== 'law_firm') ? [
                ['Cost of Goods Sold (COGS)', `- NGN ${totalCOGS.toLocaleString()}`],
                ['  - POS Inventory Cost', `NGN ${posCogsTotal.toLocaleString()}`],
                ['  - B2B Inventory Cost', `NGN ${b2bCogsTotal.toLocaleString()}`],
                ['Gross Profit', `NGN ${grossProfit.toLocaleString()}`]
              ] : []),
              ['Operating Expenses', `- NGN ${totalOperatingExpenses.toLocaleString()}`],
              ['  - Approved Staff Expenses', `NGN ${approvedExpenses.toLocaleString()}`],
              ['  - Manual Ledger Expenses', `NGN ${ledgerExpenses.toLocaleString()}`],
              ['  - HR Payroll (Paid)', `NGN ${payrollExpenses.toLocaleString()}`],
            ],
            foot: [['Net Income', `NGN ${netIncome.toLocaleString()}`]],
            theme: 'grid',
            headStyles: { fillColor: [44, 62, 80] },
            footStyles: { fillColor: (netIncome >= 0 ? [39, 174, 96] : [192, 57, 43]) }
          });
          doc.save(`PL_Statement_${new Date().toISOString().split('T')[0]}.pdf`);
        }} className="bg-recloud-600 hover:bg-recloud-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-recloud-500/20 flex gap-2 transition-all hover:-translate-y-0.5">
          <FileText className="w-4 h-4"/> Export PDF
        </button>
      </div>

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-xl shadow-indigo-900/5 border border-white/50 overflow-hidden text-sm">
        <div className="p-6 border-b border-white/50 bg-indigo-50/30 flex justify-between items-center">
          <span className="font-bold text-slate-600 uppercase tracking-wider">Gross Revenue</span>
          <span className="text-xl font-black text-slate-800">₦{totalGrossRevenue.toLocaleString()}</span>
        </div>
        {currentIndustry !== 'law_firm' && (
          <>
            <div className="p-4 flex justify-between items-center border-b border-slate-100 pl-10 bg-white">
              <span className="text-slate-600 font-medium">POS Retail Sales</span>
              <span className="font-bold text-slate-800">₦{posSalesTotal.toLocaleString()}</span>
            </div>
            <div className="p-4 flex justify-between items-center border-b border-slate-100 pl-10 bg-white">
              <span className="text-slate-600 font-medium">B2B Wholesale Orders</span>
              <span className="font-bold text-slate-800">₦{b2bSalesTotal.toLocaleString()}</span>
            </div>
          </>
        )}
        <div className="p-4 flex justify-between items-center border-b border-slate-200 pl-10 bg-white">
          <span className="text-slate-600 font-medium">CRM Invoices (Paid)</span>
          <span className="font-bold text-slate-800">₦{crmSalesTotal.toLocaleString()}</span>
        </div>

        {currentIndustry !== 'law_firm' && (
          <>
            <div className="p-6 border-b border-slate-200 bg-red-50/30 flex justify-between items-center">
              <span className="font-bold text-slate-600 uppercase tracking-wider">Cost of Goods Sold (COGS)</span>
              <span className="text-xl font-black text-red-600">-₦{totalCOGS.toLocaleString()}</span>
            </div>
            <div className="p-4 flex justify-between items-center border-b border-slate-100 pl-10 bg-white">
              <span className="text-slate-600 font-medium">POS Inventory Cost</span>
              <span className="font-bold text-slate-800">₦{posCogsTotal.toLocaleString()}</span>
            </div>
            <div className="p-4 flex justify-between items-center border-b border-slate-200 pl-10 bg-white">
              <span className="text-slate-600 font-medium">B2B Inventory Cost</span>
              <span className="font-bold text-slate-800">₦{b2bCogsTotal.toLocaleString()}</span>
            </div>
            <div className="p-6 border-b border-slate-200 bg-emerald-50/50 flex justify-between items-center">
              <span className="font-black text-emerald-800 text-lg uppercase tracking-wider">Gross Profit</span>
              <span className="text-2xl font-black text-emerald-600">₦{grossProfit.toLocaleString()}</span>
            </div>
          </>
        )}

        <div className="p-6 border-b border-slate-200 bg-orange-50/30 flex justify-between items-center">
          <span className="font-bold text-slate-600 uppercase tracking-wider">Operating Expenses</span>
          <span className="text-xl font-black text-orange-600">-₦{totalOperatingExpenses.toLocaleString()}</span>
        </div>
        <div className="p-4 flex justify-between items-center border-b border-slate-100 pl-10 bg-white">
          <span className="text-slate-600 font-medium">Approved Staff Expenses</span>
          <span className="font-bold text-slate-800">₦{approvedExpenses.toLocaleString()}</span>
        </div>
        <div className="p-4 flex justify-between items-center border-b border-slate-100 pl-10 bg-white">
          <span className="text-slate-600 font-medium">Manual Ledger Expenses</span>
          <span className="font-bold text-slate-800">₦{ledgerExpenses.toLocaleString()}</span>
        </div>
        <div className="p-4 flex justify-between items-center border-b border-slate-200 pl-10 bg-white">
          <span className="text-slate-600 font-medium">HR Payroll (Paid)</span>
          <span className="font-bold text-slate-800">₦{payrollExpenses.toLocaleString()}</span>
        </div>

        <div className={`p-8 flex justify-between items-center ${netIncome >= 0 ? 'bg-gradient-to-r from-recloud-800 to-recloud-600 text-white' : 'bg-gradient-to-r from-red-800 to-red-600 text-white'}`}>
          <span className="font-black text-2xl uppercase tracking-wider">Net Income</span>
          <span className="text-4xl font-black drop-shadow-md">₦{netIncome.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
