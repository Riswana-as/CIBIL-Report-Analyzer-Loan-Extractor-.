/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { UploadSection } from './components/UploadSection';
import { SummaryCards } from './components/SummaryCards';
import { AccountCard } from './components/AccountCard';
import { AccountsTable } from './components/AccountsTable';
import { OneByOneView } from './components/OneByOneView';
import { PrintableReport } from './components/PrintableReport';
import { EditAccountModal } from './components/EditAccountModal';
import { CibilAccount, CibilReportData, FilterOption } from './types/cibil';
import { SAMPLE_REPORTS, SampleReportItem } from './data/sampleReports';
import { exportToCSV, exportToExcel, generateAppraisalMemoText } from './utils/exportUtils';
import {
  FileText,
  Filter,
  LayoutGrid,
  Table as TableIcon,
  Printer,
  Copy,
  Check,
  AlertTriangle,
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldAlert,
  FileSpreadsheet,
  RefreshCw,
} from 'lucide-react';

export default function App() {
  const [reportData, setReportData] = useState<CibilReportData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterOption, setFilterOption] = useState<FilterOption>('conditioned');
  const [viewMode, setViewMode] = useState<'one_by_one' | 'table' | 'cards' | 'print'>('one_by_one');
  const [memoCopied, setMemoCopied] = useState<boolean>(false);

  // Edit Account state
  const [editingAccount, setEditingAccount] = useState<{ account: CibilAccount; index: number } | null>(null);
  const [lastPayload, setLastPayload] = useState<{
    fileBase64?: string;
    mimeType?: string;
    textContent?: string;
    fileName?: string;
  } | null>(null);

  // Analyze report by calling server-side API endpoint
  const handleAnalyze = async (payload: {
    fileBase64?: string;
    mimeType?: string;
    textContent?: string;
    fileName?: string;
  }) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLastPayload(payload);
    setLoadingStep('Uploading & Initializing Gemini analysis with auto-retry...');

    try {
      const response = await fetch('/api/extract-cibil', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      setLoadingStep('Extracting loan parameters & applying condition filter...');

      const contentType = response.headers.get('content-type') || '';

      if (!response.ok) {
        let errMessage = `Server responded with status ${response.status}`;
        if (contentType.includes('application/json')) {
          try {
            const errorJson = await response.json();
            if (errorJson.error) {
              errMessage = errorJson.error;
            }
          } catch (_) {}
        } else {
          const rawText = await response.text();
          if (response.status === 504 || response.status === 502) {
            errMessage = 'The request timed out while analyzing the CIBIL report. Please try again.';
          } else {
            errMessage = `Server returned status ${response.status}. Please try again.`;
          }
        }
        throw new Error(errMessage);
      }

      if (!contentType.includes('application/json')) {
        const rawText = await response.text();
        throw new Error('Server returned an unexpected non-JSON response. Please try again.');
      }

      const resData = await response.json();
      if (!resData.data) {
        throw new Error('No structured report data returned from server.');
      }

      setReportData(resData.data);
      setFilterOption('conditioned');
      setViewMode('one_by_one');
    } catch (err: any) {
      console.error('Extraction error:', err);
      let cleanError = String(err.message || 'Failed to extract CIBIL report.');

      try {
        const jsonMatch = cleanError.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed?.error?.message) {
            cleanError = parsed.error.message;
          } else if (parsed?.message) {
            cleanError = parsed.message;
          }
        }
      } catch (_) {}

      if (
        cleanError.includes('503') ||
        cleanError.includes('504') ||
        cleanError.includes('DEADLINE_EXCEEDED') ||
        cleanError.includes('high demand') ||
        cleanError.includes('UNAVAILABLE') ||
        cleanError.includes('overloaded')
      ) {
        cleanError =
          'The AI model is currently experiencing a temporary surge in traffic. Spikes in demand are usually brief. Please click "Try Again" below to re-submit.';
      }

      setErrorMessage(cleanError);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  // 1-Click Load Preparsed Sample
  const handleLoadSample = (sample: SampleReportItem) => {
    setReportData(sample.parsedData);
    setErrorMessage(null);
    setFilterOption('conditioned');
    setViewMode('one_by_one');
  };

  const handleReset = () => {
    setReportData(null);
    setErrorMessage(null);
    setViewMode('one_by_one');
  };

  // Filter accounts based on user selection and the core underwriting condition
  const getFilteredAccounts = (): CibilAccount[] => {
    if (!reportData) return [];

    switch (filterOption) {
      case 'conditioned':
        // Core Condition: All active loans + closed loans with DPD, suit filed, written-off, or settlement
        return reportData.accounts.filter(
          (acc) =>
            acc.isActive ||
            (acc.isClosed &&
              (acc.hasDpd ||
                acc.isSuitFiled ||
                acc.isWrittenOff ||
                acc.isSettled ||
                acc.meetsCondition))
        );
      case 'active_only':
        return reportData.accounts.filter((acc) => acc.isActive);
      case 'derogatory_only':
        return reportData.accounts.filter(
          (acc) => acc.hasDpd || acc.isSuitFiled || acc.isWrittenOff || acc.isSettled
        );
      case 'all':
      default:
        return reportData.accounts;
    }
  };

  const filteredAccounts = getFilteredAccounts();
  const totalExtractedAccounts = reportData?.accounts.length || 0;
  const qualifiedAccountsCount =
    reportData?.accounts.filter(
      (acc) =>
        acc.isActive ||
        (acc.isClosed &&
          (acc.hasDpd || acc.isSuitFiled || acc.isWrittenOff || acc.isSettled || acc.meetsCondition))
    ).length || 0;

  const handleCopyMemo = () => {
    if (!reportData) return;
    const text = generateAppraisalMemoText(reportData, filteredAccounts);
    navigator.clipboard.writeText(text);
    setMemoCopied(true);
    setTimeout(() => setMemoCopied(false), 2500);
  };

  const handleExportCSV = () => {
    if (!reportData) return;
    exportToCSV(reportData, filteredAccounts);
  };

  const handleExportExcel = () => {
    if (!reportData) return;
    exportToExcel(reportData, filteredAccounts);
  };

  const handlePrint = () => {
    setViewMode('print');
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleSaveEditedAccount = (updatedAccount: CibilAccount, index: number) => {
    if (!reportData) return;
    const newAccounts = [...reportData.accounts];
    newAccounts[index] = updatedAccount;
    setReportData({
      ...reportData,
      accounts: newAccounts,
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <Header
        onReset={handleReset}
        onPrint={handlePrint}
        onExportCSV={handleExportCSV}
        onExportExcel={handleExportExcel}
        hasData={!!reportData}
        filterOption={filterOption}
        onFilterChange={setFilterOption}
        qualifiedCount={qualifiedAccountsCount}
        totalCount={totalExtractedAccounts}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-3 shadow-xs">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-red-900">Service Notice</p>
              <p className="mt-0.5 text-red-700 leading-relaxed">{errorMessage}</p>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                {lastPayload && (
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => handleAnalyze(lastPayload)}
                    className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>{isLoading ? 'Retrying...' : 'Try Again'}</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleLoadSample(SAMPLE_REPORTS[0])}
                  className="px-3 py-1.5 rounded-lg bg-red-100 hover:bg-red-200 text-red-900 font-bold text-xs"
                >
                  Load Sample CIBIL Report Instead
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Mode: Printable Full Screen Preview */}
        {reportData && viewMode === 'print' ? (
          <PrintableReport
            report={reportData}
            accounts={filteredAccounts}
            onBack={() => setViewMode('cards')}
            onPrint={() => window.print()}
          />
        ) : reportData ? (
          /* Report Loaded & Generated View */
          <div className="space-y-6">
            {/* Summary Cards and Borrower Header */}
            <SummaryCards report={reportData} />

            {/* Condition Banner & View Control Toolbar */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Condition Rule Notice */}
              <div className="flex items-start gap-2.5">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-700 shrink-0 mt-0.5">
                  <Filter className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">
                      Report Filter Condition
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      Rule Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Showing details of{' '}
                    <strong className="text-slate-800">all active loans</strong>, plus closed loans with{' '}
                    <strong className="text-slate-800">DPD, suit filed, written-off, or settlement</strong>.
                    {totalExtractedAccounts > qualifiedAccountsCount && filterOption === 'conditioned' && (
                      <span className="text-amber-700 font-medium ml-1">
                        ({totalExtractedAccounts - qualifiedAccountsCount} clean closed loan(s) omitted)
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* View Switches & Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap justify-end">
                {/* Filter Selector */}
                <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-medium border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setFilterOption('conditioned')}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                      filterOption === 'conditioned'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Conditioned ({qualifiedAccountsCount})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterOption('all')}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                      filterOption === 'all'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Accounts ({totalExtractedAccounts})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterOption('active_only')}
                    className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                      filterOption === 'active_only'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Active Only ({reportData.summary.activeAccounts})
                  </button>
                </div>

                {/* View Switch: One by One vs Horizontal Table vs Cards */}
                <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setViewMode('one_by_one')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      viewMode === 'one_by_one'
                        ? 'bg-amber-500 text-slate-950 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Active loans details one by one (line by line)"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5" />
                    <span>One by One</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('table')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      viewMode === 'table'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Horizontal Spreadsheet Table View"
                  >
                    <TableIcon className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Horizontal Table</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('cards')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors ${
                      viewMode === 'cards'
                        ? 'bg-white text-slate-900 shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Visual Card View"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-slate-500" />
                    <span>Cards</span>
                  </button>
                </div>

                {/* Excel Export Button */}
                <button
                  type="button"
                  onClick={handleExportExcel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-colors"
                  title="Download Excel spreadsheet matching the exact heads one by one layout"
                >
                  <span>Download Excel (.xlsx)</span>
                </button>

                {/* Copy Memo Button */}
                <button
                  type="button"
                  onClick={handleCopyMemo}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors"
                  title="Copy ready-to-use Credit Appraisal Note to clipboard"
                >
                  {memoCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{memoCopied ? 'Memo Copied!' : 'Copy CAM Note'}</span>
                </button>
              </div>
            </div>

            {/* List of Accounts */}
            {filteredAccounts.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center border border-slate-200">
                <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800">No accounts match this filter</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try changing the filter to "All Accounts" to view other loan accounts.
                </p>
                <button
                  type="button"
                  onClick={() => setFilterOption('all')}
                  className="mt-3 px-4 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                >
                  Show All Accounts
                </button>
              </div>
            ) : viewMode === 'one_by_one' ? (
              <OneByOneView
                accounts={filteredAccounts}
                report={reportData}
                onEdit={(acc, idx) => setEditingAccount({ account: acc, index: idx })}
              />
            ) : viewMode === 'table' ? (
              <AccountsTable
                accounts={filteredAccounts}
                report={reportData}
                onEdit={(acc, idx) => setEditingAccount({ account: acc, index: idx })}
              />
            ) : (
              <div className="space-y-4">
                {filteredAccounts.map((account, index) => (
                  <AccountCard
                    key={index}
                    account={account}
                    index={index}
                    onEdit={(acc, idx) => setEditingAccount({ account: acc, index: idx })}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Empty / Upload State */
          <div className="space-y-6">
            <UploadSection
              onAnalyze={handleAnalyze}
              onLoadPreparsedSample={handleLoadSample}
              isLoading={isLoading}
              loadingStep={loadingStep}
            />

            {/* How It Works & Requirements Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3">
                  1
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Header Data Extracted
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Fetches CIBIL report holder name, CIBIL TransUnion Score, and Date of Obtaining CIBIL report with PAN and order numbers.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3">
                  2
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  All 13 Loan Parameters
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bank Name, Account No, Loan Type, Highest Credit, Balance, Overdue, Ownership, Date Opened, Date Closed, EMI, Status, DPD, Month/Year/Days track.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold mb-3">
                  3
                </div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">
                  Precise Condition Filter
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Strictly compiles all Active loans, plus any Closed loans with DPD delays, suit filed, written-off status, and settlements into a new appraisal report.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Edit Account Modal */}
      {editingAccount && (
        <EditAccountModal
          account={editingAccount.account}
          index={editingAccount.index}
          isOpen={!!editingAccount}
          onClose={() => setEditingAccount(null)}
          onSave={handleSaveEditedAccount}
        />
      )}

      {/* Footer */}
      <footer className="no-print bg-white border-t border-slate-200/80 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>CIBIL Credit Information Report Analysis & Underwriting Tool</span>
          <span>TransUnion CIBIL CIR Format Compliance</span>
        </div>
      </footer>
    </div>
  );
}
