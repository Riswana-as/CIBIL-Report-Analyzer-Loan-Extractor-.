import React from 'react';
import { CibilReportData, CibilAccount } from '../types/cibil';
import { formatIndianCurrency } from '../utils/exportUtils';
import { Printer, Download, ArrowLeft, ShieldCheck, Building2, CheckCircle, AlertTriangle } from 'lucide-react';

interface PrintableReportProps {
  report: CibilReportData;
  accounts: CibilAccount[];
  onBack: () => void;
  onPrint: () => void;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  report,
  accounts,
  onBack,
  onPrint,
}) => {
  return (
    <div className="space-y-6">
      {/* Non-printing Control Bar */}
      <div className="print:hidden bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between flex-wrap gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Interactive View</span>
          </button>
          <div>
            <h2 className="text-sm font-bold">Print & PDF Export Preview</h2>
            <p className="text-xs text-slate-400">
              Formatted according to standard Indian Banking Credit Appraisal standards
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onPrint}
          className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF (Ctrl+P)</span>
        </button>
      </div>

      {/* The Printable Document */}
      <div
        id="printable-cibil-report"
        className="bg-white p-8 sm:p-12 rounded-2xl border border-slate-300 shadow-sm print:p-0 print:border-none print:shadow-none text-slate-900 font-sans max-w-5xl mx-auto"
      >
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black tracking-widest uppercase text-amber-600">
                  CREDIT APPRAISAL MEMORANDUM (CAM)
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-950 tracking-tight">
                CIBIL CREDIT INFORMATION ANALYSIS REPORT
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Derived and compiled from TransUnion CIBIL Credit Information Report
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                Report Date
              </span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {new Date().toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Core Header Fields requested by User - ONE BY ONE */}
        <div className="border border-slate-900 rounded-xl overflow-hidden mb-6 font-mono text-xs">
          <div className="bg-slate-900 text-white px-4 py-2 font-bold uppercase tracking-wider text-[11px] flex justify-between">
            <span>Report Summary Heads (One by One)</span>
            <span>TransUnion CIBIL CIR</span>
          </div>
          <div className="divide-y divide-slate-200 bg-white">
            <div className="grid grid-cols-12 py-2 px-4 hover:bg-slate-50">
              <span className="col-span-5 font-bold text-slate-700 uppercase">CIBIL REPORT HOLDER NAME:</span>
              <span className="col-span-7 font-black text-slate-950 font-sans text-sm">{report.reportHolderName || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-12 py-2 px-4 hover:bg-slate-50">
              <span className="col-span-5 font-bold text-slate-700 uppercase">SCORE:</span>
              <span className="col-span-7 font-black text-slate-950 text-sm">{report.cibilScore || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-12 py-2 px-4 hover:bg-slate-50">
              <span className="col-span-5 font-bold text-slate-700 uppercase">DATE OF OBTAINING CIBIL REPORT:</span>
              <span className="col-span-7 font-bold text-slate-950 text-xs sm:text-sm">{report.dateOfObtainingReport || 'N/A'}</span>
            </div>
            <div className="grid grid-cols-12 py-2 px-4 hover:bg-slate-50">
              <span className="col-span-5 font-bold text-slate-700 uppercase">TOTAL ACTIVE ACCOUNTS:</span>
              <span className="col-span-7 font-bold text-slate-950">{report.summary.activeAccounts}</span>
            </div>
            <div className="grid grid-cols-12 py-2 px-4 hover:bg-slate-50">
              <span className="col-span-5 font-bold text-slate-700 uppercase">TOTAL CURRENT BALANCE:</span>
              <span className="col-span-7 font-bold text-slate-950">{report.summary.totalCurrentBalance ? formatIndianCurrency(report.summary.totalCurrentBalance) : '₹0'}</span>
            </div>
            <div className="grid grid-cols-12 py-2 px-4 hover:bg-slate-50">
              <span className="col-span-5 font-bold text-slate-700 uppercase">TOTAL OVERDUE:</span>
              <span className={`col-span-7 font-bold ${(report.summary.totalAmountOverdue || 0) > 0 ? 'text-red-600 font-black' : 'text-slate-950'}`}>
                {report.summary.totalAmountOverdue ? formatIndianCurrency(report.summary.totalAmountOverdue) : '₹0'}
              </span>
            </div>
          </div>
        </div>

        {/* Condition Mandate Banner */}
        <div className="mb-6 p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/90 text-xs text-amber-900">
          <span className="font-bold uppercase tracking-wider block text-[10px] text-amber-800 mb-0.5">
            Underwriting Selection Condition Applied:
          </span>
          <p className="leading-relaxed">
            Report includes details of all <strong>Active Loans</strong>. Additionally includes any{' '}
            <strong>Closed Loans</strong> with recorded instances of <strong>DPD (Days Past Due)</strong>,{' '}
            <strong>Suit Filed</strong>, <strong>Written-off status</strong>, and <strong>Settlement</strong>.
          </p>
        </div>

        {/* Financial Summary Ledger */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 p-4 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Sanctioned Limit
            </span>
            <span className="text-sm sm:text-base font-bold font-mono text-slate-900 block mt-0.5">
              {formatIndianCurrency(report.summary.totalSanctionedAmount)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Current Outstanding Balance
            </span>
            <span className="text-sm sm:text-base font-black font-mono text-slate-900 block mt-0.5">
              {formatIndianCurrency(report.summary.totalCurrentBalance)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Total Amount Overdue
            </span>
            <span className={`text-sm sm:text-base font-black font-mono block mt-0.5 ${
              (report.summary.totalAmountOverdue || 0) > 0 ? 'text-red-600' : 'text-slate-900'
            }`}>
              {formatIndianCurrency(report.summary.totalAmountOverdue)}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Monthly EMI Commitment
            </span>
            <span className="text-sm sm:text-base font-bold font-mono text-slate-900 block mt-0.5">
              {report.summary.totalMonthlyEmi ? formatIndianCurrency(report.summary.totalMonthlyEmi) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Active & Qualified Loan Accounts - STRICTLY ONE BY ONE */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4 pb-2 border-b-2 border-slate-900">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Loan Account Details (One by One)
              </h2>
              <p className="text-[10px] text-slate-500">
                Each field rendered line by line sequentially according to underwriting format
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
              {accounts.length} Facilities
            </span>
          </div>

          <div className="space-y-6">
            {accounts.map((acc, index) => {
              const isOverdue =
                typeof acc.amountOverdue === 'number'
                  ? acc.amountOverdue > 0
                  : parseFloat(String(acc.amountOverdue).replace(/[^0-9.-]+/g, '')) > 0;

              const paymentHistoryStr =
                acc.paymentHistory && acc.paymentHistory.length > 0
                  ? acc.paymentHistory.map((p) => `${p.monthYear}: ${p.dpdDays}`).join(', ')
                  : 'N/A';

              return (
                <div
                  key={index}
                  className="border border-slate-900 rounded-xl overflow-hidden break-inside-avoid bg-white shadow-xs font-mono text-xs"
                >
                  <div className="bg-slate-900 text-white px-4 py-2 font-bold flex items-center justify-between">
                    <span>
                      LOAN ACCOUNT #{index + 1}: {acc.bankName}
                    </span>
                    <span className="font-mono text-[11px] text-slate-300">
                      {acc.accountNumber} • {acc.status}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-200">
                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">Bank name:</span>
                      <span className="col-span-7 font-black text-slate-950 font-sans">{acc.bankName}</span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">Bank Account No:</span>
                      <span className="col-span-7 font-bold text-slate-900">{acc.accountNumber}</span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">Type Of Loan:</span>
                      <span className="col-span-7 font-semibold text-slate-900 font-sans">{acc.loanType}</span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">highest credit/loan amount:</span>
                      <span className="col-span-7 font-black text-slate-950">{formatIndianCurrency(acc.highestCreditOrLoanAmount)}</span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">Current Balance:</span>
                      <span className="col-span-7 font-black text-slate-950">{formatIndianCurrency(acc.currentBalance)}</span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">Amount Overdue:</span>
                      <span className={`col-span-7 font-black ${isOverdue ? 'text-red-600' : 'text-slate-950'}`}>
                        {formatIndianCurrency(acc.amountOverdue)}
                      </span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">Ownership:</span>
                      <span className="col-span-7 text-slate-900">{acc.ownership}</span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">Date Opened /Disbursed:</span>
                      <span className="col-span-7 font-bold text-slate-950">{acc.dateOpenedOrDisbursed}</span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">Date Closed:</span>
                      <span className="col-span-7 text-slate-900">{acc.dateClosed || (acc.isActive ? 'Active / N/A' : 'N/A')}</span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">Emi (if available):</span>
                      <span className="col-span-7 text-slate-900">{acc.emi && acc.emi !== 'N/A' ? formatIndianCurrency(acc.emi) : 'N/A'}</span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">Status:</span>
                      <span className="col-span-7 font-bold text-slate-900">{acc.status}</span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">DPD:</span>
                      <span className="col-span-7 font-bold text-amber-800">{acc.dpdSummary || acc.maxDpd || '000'}</span>
                    </div>

                    <div className="grid grid-cols-12 py-1.5 px-4 hover:bg-slate-50">
                      <span className="col-span-5 font-bold text-slate-700 uppercase">Month, year and days:</span>
                      <span className="col-span-7 text-slate-800 font-mono text-[10px]">{paymentHistoryStr}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Underwriter Sign-off Section */}
        <div className="border-t-2 border-slate-900 pt-6 mt-10 break-inside-avoid">
          <div className="grid grid-cols-3 gap-6 text-center text-xs">
            <div>
              <div className="h-14 border-b border-dashed border-slate-400 mb-2"></div>
              <p className="font-bold text-slate-900">Credit Analyst / Officer</p>
              <p className="text-[10px] text-slate-500">Prepared & Verified By</p>
            </div>
            <div>
              <div className="h-14 border-b border-dashed border-slate-400 mb-2"></div>
              <p className="font-bold text-slate-900">Branch Credit Manager</p>
              <p className="text-[10px] text-slate-500">Reviewed By</p>
            </div>
            <div>
              <div className="h-14 border-b border-dashed border-slate-400 mb-2"></div>
              <p className="font-bold text-slate-900">Sanctioning Authority</p>
              <p className="text-[10px] text-slate-500">Approval / Recommendation</p>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-6">
            Confidential Document — For Internal Banking and Lending Evaluation Only
          </p>
        </div>
      </div>
    </div>
  );
};
