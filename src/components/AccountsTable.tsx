import React, { useState } from 'react';
import { CibilAccount, CibilReportData } from '../types/cibil';
import { formatIndianCurrency } from '../utils/exportUtils';
import { Search, ArrowUpDown, Building2, FileSpreadsheet } from 'lucide-react';

interface AccountsTableProps {
  accounts: CibilAccount[];
  report?: CibilReportData;
  onEdit?: (account: CibilAccount, index: number) => void;
}

export const AccountsTable: React.FC<AccountsTableProps> = ({ accounts, report, onEdit }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof CibilAccount>('bankName');
  const [sortAsc, setSortAsc] = useState(true);

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.loanType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortAsc ? aVal - bVal : bVal - aVal;
    }
    return 0;
  });

  const handleSort = (field: keyof CibilAccount) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-300 shadow-xs overflow-hidden">
      {/* Table Toolbar */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Spreadsheet Ledger (Full 13 Columns)
          </span>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search bank, account #, loan type..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>
      </div>

      {/* Spreadsheet Header Block (Heads One by One matching Excel layout) */}
      {report && (
        <div className="p-4 border-b border-slate-300 bg-white font-mono text-xs">
          <div className="space-y-1 border border-slate-300 p-3 rounded-lg bg-slate-50/50">
            <div className="flex items-center">
              <span className="w-64 font-bold text-slate-800 uppercase">CIBIL REPORT HOLDER NAME:</span>
              <span className="font-black text-slate-950 font-sans">{report.reportHolderName || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-64 font-bold text-slate-800 uppercase">SCORE:</span>
              <span className="font-black text-slate-950 font-sans">{report.cibilScore || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-64 font-bold text-slate-800 uppercase">DATE OF OBTAINING CIBIL REPORT:</span>
              <span className="font-bold text-slate-950">{report.dateOfObtainingReport || 'N/A'}</span>
            </div>
            <div className="flex items-center">
              <span className="w-64 font-bold text-slate-800 uppercase">TOTAL ACTIVE ACCOUNTS:</span>
              <span className="font-bold text-slate-950">{report.summary.activeAccounts}</span>
            </div>
            <div className="flex items-center">
              <span className="w-64 font-bold text-slate-800 uppercase">TOTAL CURRENT BALANCE:</span>
              <span className="font-bold text-slate-950">{report.summary.totalCurrentBalance ?? 0}</span>
            </div>
            <div className="flex items-center">
              <span className="w-64 font-bold text-slate-800 uppercase">TOTAL OVERDUE:</span>
              <span className={`font-bold ${(report.summary.totalAmountOverdue || 0) > 0 ? 'text-red-600' : 'text-slate-950'}`}>
                {report.summary.totalAmountOverdue ?? 0}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Horizontal Scroll Table styled like Excel */}
      <div className="overflow-x-auto max-w-full">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 whitespace-nowrap">
              <th className="py-2.5 px-3 border-r border-slate-300 text-center w-12">Sr No</th>
              <th
                onClick={() => handleSort('bankName')}
                className="py-2.5 px-3 border-r border-slate-300 cursor-pointer hover:bg-slate-200/80 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Bank Name</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-2.5 px-3 border-r border-slate-300">Bank Account No</th>
              <th className="py-2.5 px-3 border-r border-slate-300">Type Of Loan</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-right">Highest Credit / Loan Amount</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-right">Current Balance</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-right">Amount Overdue</th>
              <th className="py-2.5 px-3 border-r border-slate-300">Ownership</th>
              <th className="py-2.5 px-3 border-r border-slate-300">Date Opened / Disbursed</th>
              <th className="py-2.5 px-3 border-r border-slate-300">Date Closed</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-right">EMI</th>
              <th className="py-2.5 px-3 border-r border-slate-300 text-center">Status</th>
              <th className="py-2.5 px-3 border-r border-slate-300">DPD</th>
              <th className="py-2.5 px-3 min-w-[220px]">Month, Year and Days</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedAccounts.map((acc, idx) => {
              const isOverdue =
                typeof acc.amountOverdue === 'number'
                  ? acc.amountOverdue > 0
                  : parseFloat(String(acc.amountOverdue).replace(/[^0-9.-]+/g, '')) > 0;

              return (
                <tr
                  key={idx}
                  className={`hover:bg-slate-50/90 transition-colors whitespace-nowrap ${
                    isOverdue ? 'bg-red-50/30' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-center text-slate-500">
                    {idx + 1}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 font-bold text-slate-900">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{acc.bankName}</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-medium text-slate-800">
                    {acc.accountNumber}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 text-slate-800 font-medium">
                    {acc.loanType}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-bold text-slate-900 text-right">
                    {formatIndianCurrency(acc.highestCreditOrLoanAmount)}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-black text-slate-900 text-right">
                    {formatIndianCurrency(acc.currentBalance)}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-black text-right">
                    <span className={isOverdue ? 'text-red-600' : 'text-slate-800'}>
                      {formatIndianCurrency(acc.amountOverdue)}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 text-slate-700">
                    {acc.ownership}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 font-mono font-semibold text-slate-900">
                    {acc.dateOpenedOrDisbursed}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 font-mono text-slate-700">
                    {acc.dateClosed || (acc.isActive ? 'Active' : 'N/A')}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 font-mono text-slate-800 text-right">
                    {acc.emi && acc.emi !== 'N/A' ? formatIndianCurrency(acc.emi) : 'N/A'}
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        acc.isWrittenOff || acc.isSuitFiled
                          ? 'bg-red-100 text-red-800'
                          : acc.isSettled
                          ? 'bg-amber-100 text-amber-800'
                          : acc.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {acc.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 border-r border-slate-200">
                    <span className={`font-semibold ${acc.hasDpd ? 'text-amber-700 font-bold' : 'text-slate-700'}`}>
                      {acc.dpdSummary || acc.maxDpd || '000'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    {acc.paymentHistory && acc.paymentHistory.length > 0 ? (
                      <div className="flex gap-1 overflow-x-auto max-w-[320px] py-1">
                        {acc.paymentHistory.map((p, pIdx) => (
                          <span
                            key={pIdx}
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                              p.dpdDays === '000' || p.dpdDays === '0'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-700 border-red-200 font-bold'
                            }`}
                            title={`${p.monthYear}: ${p.dpdDays} DPD`}
                          >
                            {p.monthYear.slice(0, 3)}:{p.dpdDays}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
