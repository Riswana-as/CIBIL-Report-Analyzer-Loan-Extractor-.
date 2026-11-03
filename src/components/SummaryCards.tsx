import React from 'react';
import { CibilReportData } from '../types/cibil';
import { ScoreGauge } from './ScoreGauge';
import { formatIndianCurrency } from '../utils/exportUtils';
import {
  Wallet,
  CreditCard,
  AlertCircle,
  Calendar,
  UserCheck,
  ShieldAlert,
  BadgeCheck,
  FileSpreadsheet,
  Copy,
  Check,
} from 'lucide-react';

interface SummaryCardsProps {
  report: CibilReportData;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ report }) => {
  const { summary } = report;
  const [copied, setCopied] = React.useState(false);

  const hasOverdue = (summary.totalAmountOverdue || 0) > 0;
  const hasDerogatory = (summary.derogatoryAccountsCount || 0) > 0;

  const handleCopyHeaders = () => {
    const text = `CIBIL REPORT HOLDER NAME:\t${report.reportHolderName || 'N/A'}
SCORE:\t${report.cibilScore || 'N/A'}
DATE OF OBTAINING CIBIL REPORT:\t${report.dateOfObtainingReport || 'N/A'}
TOTAL ACTIVE ACCOUNTS:\t${summary.activeAccounts}
TOTAL CURRENT BALANCE:\t${summary.totalCurrentBalance}
TOTAL OVERDUE:\t${summary.totalAmountOverdue}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Heads One by One (Spreadsheet Header Format) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Exact Heads One By One Stack */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold tracking-wider uppercase">
                CIBIL Report Heads (One by One)
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyHeaders}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors flex items-center gap-1.5 font-medium border border-slate-700"
              title="Copy header lines to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
              <span>{copied ? 'Copied' : 'Copy Heads'}</span>
            </button>
          </div>

          <div className="p-4 sm:p-5 font-mono text-xs sm:text-sm">
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-slate-50/40">
              {/* Head 1 */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2.5 px-4 hover:bg-white transition-colors">
                <span className="w-64 font-bold text-slate-600 shrink-0 uppercase tracking-wide text-xs">
                  CIBIL REPORT HOLDER NAME:
                </span>
                <span className="font-black text-slate-900 text-sm tracking-tight mt-0.5 sm:mt-0 font-sans">
                  {report.reportHolderName || 'N/A'}
                </span>
              </div>

              {/* Head 2 */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2.5 px-4 hover:bg-white transition-colors">
                <span className="w-64 font-bold text-slate-600 shrink-0 uppercase tracking-wide text-xs">
                  SCORE:
                </span>
                <span className="font-black text-slate-900 text-base text-amber-600">
                  {report.cibilScore || 'N/A'}
                </span>
              </div>

              {/* Head 3 */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2.5 px-4 hover:bg-white transition-colors">
                <span className="w-64 font-bold text-slate-600 shrink-0 uppercase tracking-wide text-xs">
                  DATE OF OBTAINING CIBIL REPORT:
                </span>
                <span className="font-bold text-slate-900 font-mono text-xs sm:text-sm bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-amber-900 w-fit">
                  {report.dateOfObtainingReport || 'N/A'}
                </span>
              </div>

              {/* Head 4 */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2.5 px-4 hover:bg-white transition-colors">
                <span className="w-64 font-bold text-slate-600 shrink-0 uppercase tracking-wide text-xs">
                  TOTAL ACTIVE ACCOUNTS:
                </span>
                <span className="font-bold text-slate-900">
                  {summary.activeAccounts}
                </span>
              </div>

              {/* Head 5 */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2.5 px-4 hover:bg-white transition-colors">
                <span className="w-64 font-bold text-slate-600 shrink-0 uppercase tracking-wide text-xs">
                  TOTAL CURRENT BALANCE:
                </span>
                <span className="font-bold text-slate-900">
                  {summary.totalCurrentBalance ? formatIndianCurrency(summary.totalCurrentBalance) : '₹0'}
                </span>
              </div>

              {/* Head 6 */}
              <div className="flex flex-col sm:flex-row sm:items-center py-2.5 px-4 hover:bg-white transition-colors">
                <span className="w-64 font-bold text-slate-600 shrink-0 uppercase tracking-wide text-xs">
                  TOTAL OVERDUE:
                </span>
                <span className={`font-bold ${hasOverdue ? 'text-red-600 font-black' : 'text-slate-900'}`}>
                  {summary.totalAmountOverdue ? formatIndianCurrency(summary.totalAmountOverdue) : '₹0'}
                </span>
              </div>
            </div>

            {/* Optional PAN / Control Ref if found */}
            {(report.panNumber || report.controlNumber) && (
              <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 font-sans px-1">
                {report.panNumber && <span>PAN: <strong className="text-slate-700 font-mono">{report.panNumber}</strong></span>}
                {report.controlNumber && <span>CIR Ref: <strong className="text-slate-700 font-mono">{report.controlNumber}</strong></span>}
              </div>
            )}
          </div>
        </div>

        {/* CIBIL Score Gauge Card */}
        <ScoreGauge score={report.cibilScore} category={report.scoreCategory} />
      </div>

      {/* Financial Exposure KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Current Balance */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Current Balance</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
            {formatIndianCurrency(summary.totalCurrentBalance)}
          </p>
          <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
            <span>Across {summary.activeAccounts} active loan(s)</span>
          </div>
        </div>

        {/* Total Overdue */}
        <div className={`rounded-2xl p-4 border shadow-xs transition-colors ${
          hasOverdue ? 'bg-red-50/50 border-red-200' : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Amount Overdue</span>
            <div className={`p-1.5 rounded-lg ${hasOverdue ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'}`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
            hasOverdue ? 'text-red-600 font-bold' : 'text-slate-900'
          }`}>
            {formatIndianCurrency(summary.totalAmountOverdue)}
          </p>
          <div className="mt-1 text-xs">
            {hasOverdue ? (
              <span className="text-red-700 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                Immediate risk of default
              </span>
            ) : (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <BadgeCheck className="w-3 h-3" />
                Zero Overdue (Nil)
              </span>
            )}
          </div>
        </div>

        {/* Monthly EMI Commitment */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Monthly EMI (Obligation)</span>
            <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
            {summary.totalMonthlyEmi ? formatIndianCurrency(summary.totalMonthlyEmi) : 'N/A'}
          </p>
          <div className="mt-1 text-xs text-slate-500">
            <span>FOIR / Debt Servicing</span>
          </div>
        </div>

        {/* Derogatory / Adverse Flags */}
        <div className={`rounded-2xl p-4 border shadow-xs ${
          hasDerogatory ? 'bg-amber-50/40 border-amber-200' : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Derogatory Accounts</span>
            <div className={`p-1.5 rounded-lg ${hasDerogatory ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-600'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-xl sm:text-2xl font-black font-mono tracking-tight ${
            hasDerogatory ? 'text-amber-700' : 'text-slate-900'
          }`}>
            {summary.derogatoryAccountsCount} <span className="text-sm font-medium text-slate-500">account(s)</span>
          </p>
          <div className="mt-1 text-xs">
            {hasDerogatory ? (
              <span className="text-amber-800 font-medium">DPD delay / settlement detected</span>
            ) : (
              <span className="text-emerald-600 font-medium">No adverse entries found</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
