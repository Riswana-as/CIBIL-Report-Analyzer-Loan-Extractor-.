import React, { useState } from 'react';
import { CibilAccount } from '../types/cibil';
import { formatIndianCurrency } from '../utils/exportUtils';
import {
  Building2,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  Edit2,
  ChevronDown,
  ChevronUp,
  Clock,
  ShieldAlert,
  CreditCard,
} from 'lucide-react';

interface AccountCardProps {
  account: CibilAccount;
  index: number;
  onEdit?: (account: CibilAccount, index: number) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account, index, onEdit }) => {
  const [copied, setCopied] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  const isOverdue =
    typeof account.amountOverdue === 'number'
      ? account.amountOverdue > 0
      : parseFloat(String(account.amountOverdue).replace(/[^0-9.-]+/g, '')) > 0;

  const handleCopySingle = () => {
    const text = `Bank name: ${account.bankName}
Bank Account No: ${account.accountNumber}
Type Of Loan: ${account.loanType}
highest credit/loan amount: ${account.highestCreditOrLoanAmount}
Current Balance: ${account.currentBalance}
Amount Overdue: ${account.amountOverdue}
Ownership: ${account.ownership}
Date Opened /Disbursed: ${account.dateOpenedOrDisbursed}
Date Closed: ${account.dateClosed || 'Active / N/A'}
Emi (if available): ${account.emi || 'N/A'}
Status: ${account.status}
DPD: ${account.dpdSummary || account.maxDpd}
Month, year and days: ${
      account.paymentHistory?.length
        ? account.paymentHistory.map((p) => `${p.monthYear}: ${p.dpdDays}`).join(', ')
        : 'N/A'
    }`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for DPD chip color
  const getDpdBadgeClass = (dpd: string) => {
    const clean = dpd.trim().toUpperCase();
    if (clean === '000' || clean === '0' || clean === 'STD') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
    const num = parseInt(clean, 10);
    if (!isNaN(num)) {
      if (num === 0) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      if (num <= 30) return 'bg-amber-100 text-amber-800 border-amber-300 font-bold';
      if (num <= 60) return 'bg-orange-100 text-orange-800 border-orange-300 font-bold';
      return 'bg-red-100 text-red-800 border-red-300 font-bold';
    }
    if (['LSS', 'DBT', 'SUB', 'WO', 'WRITTEN-OFF'].some((w) => clean.includes(w))) {
      return 'bg-purple-100 text-purple-900 border-purple-300 font-bold';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  const visibleHistory = showAllHistory
    ? account.paymentHistory || []
    : (account.paymentHistory || []).slice(0, 10);

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 shadow-xs hover:shadow-md overflow-hidden ${
      isOverdue || account.isSuitFiled || account.isWrittenOff
        ? 'border-red-200 ring-1 ring-red-100'
        : account.hasDpd || account.isSettled
        ? 'border-amber-200'
        : 'border-slate-200/90'
    }`}>
      {/* Card Header */}
      <div className="bg-slate-50/80 px-5 py-3.5 border-b border-slate-200/70 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {index + 1}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-amber-600" />
                {account.bankName}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-200/80 text-slate-700 font-medium font-mono">
                {account.accountNumber}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{account.loanType}</p>
          </div>
        </div>

        {/* Status & Condition Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Condition Qualification Badge */}
          {account.isActive ? (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Active Facility
            </span>
          ) : account.meetsCondition ? (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              Closed with DPD / Derogatory
            </span>
          ) : (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              Closed (Clean)
            </span>
          )}

          {/* Core Status Badge */}
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
            account.isWrittenOff || account.isSuitFiled
              ? 'bg-red-100 text-red-800 border-red-300'
              : account.isSettled
              ? 'bg-amber-100 text-amber-800 border-amber-300'
              : account.isActive
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'
          }`}>
            {account.status}
          </span>

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleCopySingle}
              title="Copy details of this loan"
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(account, index)}
                title="Edit account details"
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-200/70 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid of the 13 Requested Fields */}
      <div className="p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* 1. Bank Name */}
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              1. Bank Name
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block truncate">
              {account.bankName}
            </span>
          </div>

          {/* 2. Bank Account No */}
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              2. Bank Account No
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 font-mono mt-0.5 block truncate">
              {account.accountNumber}
            </span>
          </div>

          {/* 3. Type of Loan */}
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              3. Type Of Loan
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5 block">
              {account.loanType}
            </span>
          </div>

          {/* 4. Highest credit / loan amount */}
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              4. Highest Credit / Loan Amount
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-900 font-mono mt-0.5 block">
              {formatIndianCurrency(account.highestCreditOrLoanAmount)}
            </span>
          </div>

          {/* 5. Current Balance */}
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              5. Current Balance
            </span>
            <span className="text-xs sm:text-sm font-black text-slate-900 font-mono mt-0.5 block">
              {formatIndianCurrency(account.currentBalance)}
            </span>
          </div>

          {/* 6. Amount Overdue */}
          <div className={`p-2.5 rounded-xl border ${
            isOverdue ? 'bg-red-50 border-red-200' : 'bg-slate-50/60 border-slate-100'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
              6. Amount Overdue
            </span>
            <span className={`text-xs sm:text-sm font-black font-mono mt-0.5 block ${
              isOverdue ? 'text-red-600' : 'text-slate-800'
            }`}>
              {formatIndianCurrency(account.amountOverdue)}
            </span>
          </div>

          {/* 7. Ownership */}
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              7. Ownership
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5 block">
              {account.ownership}
            </span>
          </div>

          {/* 8. Date Opened / Disbursed */}
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              8. Date Opened / Disbursed
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5 block flex items-center gap-1">
              <Calendar className="w-3 h-3 text-slate-400" />
              {account.dateOpenedOrDisbursed}
            </span>
          </div>

          {/* 9. Date Closed */}
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              9. Date Closed
            </span>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 mt-0.5 block">
              {account.dateClosed || (account.isActive ? 'Active / N/A' : 'N/A')}
            </span>
          </div>

          {/* 10. EMI (if available) */}
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              10. EMI (if available)
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 font-mono mt-0.5 block">
              {account.emi && account.emi !== 'N/A' ? formatIndianCurrency(account.emi) : 'N/A'}
            </span>
          </div>

          {/* 11. Status */}
          <div className="bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              11. Status
            </span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 mt-0.5 block">
              {account.status}
            </span>
          </div>

          {/* 12. DPD */}
          <div className={`p-2.5 rounded-xl border ${
            account.hasDpd ? 'bg-amber-50 border-amber-200' : 'bg-slate-50/60 border-slate-100'
          }`}>
            <span className="text-[10px] font-bold uppercase tracking-wider block text-slate-400">
              12. DPD (Days Past Due)
            </span>
            <span className={`text-xs sm:text-sm font-bold mt-0.5 block ${
              account.hasDpd ? 'text-amber-800' : 'text-slate-800'
            }`}>
              {account.dpdSummary || account.maxDpd || '000 (Clean)'}
            </span>
          </div>
        </div>

        {/* 13. Month, year and days (Payment History Section) */}
        <div className="mt-4 pt-3.5 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                13. Month, Year and Days (Payment History Track)
              </span>
            </div>
            {account.paymentHistory && account.paymentHistory.length > 10 && (
              <button
                type="button"
                onClick={() => setShowAllHistory(!showAllHistory)}
                className="text-xs font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-0.5"
              >
                <span>{showAllHistory ? 'Show Recent 10' : `View All (${account.paymentHistory.length})`}</span>
                {showAllHistory ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          {account.paymentHistory && account.paymentHistory.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {visibleHistory.map((entry, pIndex) => (
                <div
                  key={pIndex}
                  className={`inline-flex flex-col items-center px-2 py-1 rounded-lg border text-center ${getDpdBadgeClass(
                    entry.dpdDays
                  )}`}
                  title={`${entry.monthYear}: ${entry.dpdDays} DPD (${entry.statusText || 'Reported'})`}
                >
                  <span className="text-[9px] font-medium opacity-80 uppercase leading-none mb-0.5">
                    {entry.monthYear}
                  </span>
                  <span className="text-xs font-mono font-black leading-none">
                    {entry.dpdDays}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">
              No historical monthly payment track reported for this facility.
            </p>
          )}

          {account.remarks && (
            <div className="mt-3 text-xs bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-slate-600">
              <span className="font-semibold text-slate-800">Account Remarks: </span>
              {account.remarks}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
