import React, { useState } from 'react';
import { CibilAccount, CibilReportData } from '../types/cibil';
import { formatIndianCurrency } from '../utils/exportUtils';
import { Copy, Check, FileSpreadsheet, Building2, Columns, ListFilter } from 'lucide-react';

interface OneByOneViewProps {
  accounts: CibilAccount[];
  report: CibilReportData;
  onEdit?: (account: CibilAccount, index: number) => void;
}

export const OneByOneView: React.FC<OneByOneViewProps> = ({ accounts, report, onEdit }) => {
  const [layoutMode, setLayoutMode] = useState<'stacked' | 'transposed'>('stacked');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const formatOneByOneTextForAccount = (acc: CibilAccount, index: number) => {
    const history =
      acc.paymentHistory && acc.paymentHistory.length > 0
        ? acc.paymentHistory.map((p) => `${p.monthYear}: ${p.dpdDays}`).join(', ')
        : 'N/A';

    return `Loan #${index + 1}:
Bank name: ${acc.bankName}
Bank Account No: ${acc.accountNumber}
Type Of Loan: ${acc.loanType}
highest credit/loan amount: ${formatIndianCurrency(acc.highestCreditOrLoanAmount)}
Current Balance: ${formatIndianCurrency(acc.currentBalance)}
Amount Overdue: ${formatIndianCurrency(acc.amountOverdue)}
Ownership: ${acc.ownership}
Date Opened /Disbursed: ${acc.dateOpenedOrDisbursed}
Date Closed: ${acc.dateClosed || (acc.isActive ? 'Active / N/A' : 'N/A')}
Emi (if available): ${acc.emi && acc.emi !== 'N/A' ? formatIndianCurrency(acc.emi) : 'N/A'}
Status: ${acc.status}
DPD: ${acc.dpdSummary || acc.maxDpd || '000'}
Month, year and days: ${history}`;
  };

  const handleCopySingle = (acc: CibilAccount, index: number) => {
    const text = formatOneByOneTextForAccount(acc, index);
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAllOneByOne = () => {
    let allText = `CIBIL REPORT HOLDER NAME: ${report.reportHolderName || 'N/A'}\n`;
    allText += `SCORE: ${report.cibilScore || 'N/A'}\n`;
    allText += `DATE OF OBTAINING CIBIL REPORT: ${report.dateOfObtainingReport || 'N/A'}\n`;
    allText += `TOTAL ACTIVE ACCOUNTS: ${report.summary.activeAccounts}\n`;
    allText += `TOTAL CURRENT BALANCE: ${formatIndianCurrency(report.summary.totalCurrentBalance)}\n`;
    allText += `TOTAL OVERDUE: ${formatIndianCurrency(report.summary.totalAmountOverdue)}\n\n`;

    accounts.forEach((acc, i) => {
      allText += formatOneByOneTextForAccount(acc, i) + '\n\n';
    });

    navigator.clipboard.writeText(allText);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header Controls */}
      <div className="bg-white rounded-2xl border border-slate-300 p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-800">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Loans Data — Formatted One by One
            </h3>
            <p className="text-xs text-slate-500">
              Each field displayed line by line vertically instead of in one horizontal line
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Layout Mode Switcher */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLayoutMode('stacked')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                layoutMode === 'stacked'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Stacked One by One</span>
            </button>
            <button
              type="button"
              onClick={() => setLayoutMode('transposed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                layoutMode === 'transposed'
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Side-by-Side Comparison</span>
            </button>
          </div>

          {/* Copy All Button */}
          <button
            type="button"
            onClick={handleCopyAllOneByOne}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copiedAll ? 'Copied All!' : 'Copy All One by One'}</span>
          </button>
        </div>
      </div>

      {/* Mode 1: Stacked One by One (Each Loan's 13 Fields line-by-line) */}
      {layoutMode === 'stacked' ? (
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
                className="bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden"
              >
                {/* Account Title Bar */}
                <div className="bg-slate-100/80 px-5 py-3 border-b border-slate-300 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      {acc.bankName}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-200 text-slate-700 font-mono">
                      {acc.accountNumber}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      {acc.status}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopySingle(acc, index)}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 font-medium px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy This Loan</span>
                      </>
                    )}
                  </button>
                </div>

                {/* The 13 Fields strictly One by One */}
                <div className="divide-y divide-slate-200 font-mono text-xs">
                  {/* Field 1 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      Bank name:
                    </span>
                    <span className="col-span-12 sm:col-span-8 font-black text-slate-900 font-sans text-sm">
                      {acc.bankName}
                    </span>
                  </div>

                  {/* Field 2 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      Bank Account No:
                    </span>
                    <span className="col-span-12 sm:col-span-8 font-bold text-slate-900">
                      {acc.accountNumber}
                    </span>
                  </div>

                  {/* Field 3 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      Type Of Loan:
                    </span>
                    <span className="col-span-12 sm:col-span-8 font-semibold text-slate-900 font-sans">
                      {acc.loanType}
                    </span>
                  </div>

                  {/* Field 4 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      highest credit/loan amount:
                    </span>
                    <span className="col-span-12 sm:col-span-8 font-black text-slate-900 text-sm">
                      {formatIndianCurrency(acc.highestCreditOrLoanAmount)}
                    </span>
                  </div>

                  {/* Field 5 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      Current Balance:
                    </span>
                    <span className="col-span-12 sm:col-span-8 font-black text-slate-900 text-sm">
                      {formatIndianCurrency(acc.currentBalance)}
                    </span>
                  </div>

                  {/* Field 6 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      Amount Overdue:
                    </span>
                    <span
                      className={`col-span-12 sm:col-span-8 font-black text-sm ${
                        isOverdue ? 'text-red-600' : 'text-slate-900'
                      }`}
                    >
                      {formatIndianCurrency(acc.amountOverdue)}
                    </span>
                  </div>

                  {/* Field 7 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      Ownership:
                    </span>
                    <span className="col-span-12 sm:col-span-8 font-medium text-slate-900">
                      {acc.ownership}
                    </span>
                  </div>

                  {/* Field 8 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      Date Opened /Disbursed:
                    </span>
                    <span className="col-span-12 sm:col-span-8 font-bold text-slate-900 bg-amber-50/80 px-2 py-0.5 rounded w-fit border border-amber-200">
                      {acc.dateOpenedOrDisbursed}
                    </span>
                  </div>

                  {/* Field 9 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      Date Closed:
                    </span>
                    <span className="col-span-12 sm:col-span-8 font-medium text-slate-900">
                      {acc.dateClosed || (acc.isActive ? 'Active / N/A' : 'N/A')}
                    </span>
                  </div>

                  {/* Field 10 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      Emi (if available):
                    </span>
                    <span className="col-span-12 sm:col-span-8 font-medium text-slate-900">
                      {acc.emi && acc.emi !== 'N/A' ? formatIndianCurrency(acc.emi) : 'N/A'}
                    </span>
                  </div>

                  {/* Field 11 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      Status:
                    </span>
                    <span className="col-span-12 sm:col-span-8 font-bold text-slate-900">
                      {acc.status}
                    </span>
                  </div>

                  {/* Field 12 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      DPD:
                    </span>
                    <span className="col-span-12 sm:col-span-8 font-bold text-amber-800">
                      {acc.dpdSummary || acc.maxDpd || '000'}
                    </span>
                  </div>

                  {/* Field 13 */}
                  <div className="grid grid-cols-12 py-2.5 px-5 hover:bg-slate-50 transition-colors">
                    <span className="col-span-12 sm:col-span-4 font-bold text-slate-700 uppercase">
                      Month, year and days:
                    </span>
                    <div className="col-span-12 sm:col-span-8">
                      {acc.paymentHistory && acc.paymentHistory.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {acc.paymentHistory.map((p, pIdx) => (
                            <span
                              key={pIdx}
                              className={`text-[10px] px-2 py-0.5 rounded border ${
                                p.dpdDays === '000' || p.dpdDays === '0'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-red-50 text-red-800 border-red-200 font-bold'
                              }`}
                            >
                              {p.monthYear}: <strong>{p.dpdDays}</strong>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Mode 2: Transposed Comparison Table (Rows = 13 Fields one by one, Columns = Loans) */
        <div className="bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden">
          <div className="p-3.5 bg-slate-100 border-b border-slate-300 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Loan Comparison Matrix (Rows = Fields One by One)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-300">
                  <th className="py-2.5 px-4 font-bold text-slate-700 w-64 border-r border-slate-300 text-left uppercase">
                    Field (One by One)
                  </th>
                  {accounts.map((acc, i) => (
                    <th key={i} className="py-2.5 px-4 font-bold text-slate-900 border-r border-slate-300 text-left min-w-[220px]">
                      Loan #{i + 1}: {acc.bankName}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    Bank name
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 font-black text-slate-950 font-sans border-r border-slate-300">
                      {acc.bankName}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    Bank Account No
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 font-bold text-slate-900 border-r border-slate-300">
                      {acc.accountNumber}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    Type Of Loan
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 font-semibold text-slate-900 font-sans border-r border-slate-300">
                      {acc.loanType}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    highest credit/loan amount
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 font-black text-slate-950 border-r border-slate-300">
                      {formatIndianCurrency(acc.highestCreditOrLoanAmount)}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    Current Balance
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 font-black text-slate-950 border-r border-slate-300">
                      {formatIndianCurrency(acc.currentBalance)}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    Amount Overdue
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 font-black text-slate-900 border-r border-slate-300">
                      {formatIndianCurrency(acc.amountOverdue)}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    Ownership
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 text-slate-800 border-r border-slate-300">
                      {acc.ownership}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    Date Opened /Disbursed
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 font-bold text-slate-900 border-r border-slate-300">
                      {acc.dateOpenedOrDisbursed}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    Date Closed
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 text-slate-800 border-r border-slate-300">
                      {acc.dateClosed || (acc.isActive ? 'Active / N/A' : 'N/A')}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    Emi (if available)
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 text-slate-900 border-r border-slate-300">
                      {acc.emi && acc.emi !== 'N/A' ? formatIndianCurrency(acc.emi) : 'N/A'}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    Status
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 font-bold text-slate-900 border-r border-slate-300">
                      {acc.status}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    DPD
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 font-bold text-amber-800 border-r border-slate-300">
                      {acc.dpdSummary || acc.maxDpd || '000'}
                    </td>
                  ))}
                </tr>

                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-bold text-slate-700 border-r border-slate-300 bg-slate-50/50 uppercase">
                    Month, year and days
                  </td>
                  {accounts.map((acc, i) => (
                    <td key={i} className="py-2.5 px-4 text-slate-700 text-[10px] border-r border-slate-300">
                      {acc.paymentHistory && acc.paymentHistory.length > 0
                        ? acc.paymentHistory.map((p) => `${p.monthYear}: ${p.dpdDays}`).join(', ')
                        : 'N/A'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
