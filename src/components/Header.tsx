import React from 'react';
import { FileText, Printer, Download, Sparkles, Filter, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onPrint: () => void;
  onExportCSV: () => void;
  onExportExcel: () => void;
  hasData: boolean;
  filterOption: string;
  onFilterChange: (opt: any) => void;
  qualifiedCount: number;
  totalCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onPrint,
  onExportCSV,
  onExportExcel,
  hasData,
  filterOption,
  onFilterChange,
  qualifiedCount,
  totalCount,
}) => {
  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 shadow-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Branding & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-amber-500/20">
            <FileText className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white">
                CIBIL Report Analyzer & Loan Extractor
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Credit Appraisal
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Extracts Active Loans & Closed Derogatory Accounts (DPD / Settlement / Written-off / Suit Filed)
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {hasData && (
            <>
              {/* Quick filter selector */}
              <div className="inline-flex items-center rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => onFilterChange('conditioned')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors flex items-center gap-1.5 ${
                    filterOption === 'conditioned'
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="All Active loans + Closed loans with DPD, Suit Filed, Written-off or Settlement"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Conditioned ({qualifiedCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => onFilterChange('all')}
                  className={`px-2.5 py-1.5 rounded-md font-medium transition-colors ${
                    filterOption === 'all'
                      ? 'bg-slate-700 text-white font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Show all extracted accounts including clean closed loans"
                >
                  All ({totalCount})
                </button>
              </div>

              {/* Export Buttons */}
              <button
                type="button"
                onClick={onExportExcel}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-xs"
                title="Download formatted Excel (.xlsx) matching exact spreadsheet layout"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Excel (.xlsx)</span>
              </button>

              <button
                type="button"
                onClick={onExportCSV}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>CSV</span>
              </button>

              <button
                type="button"
                onClick={onPrint}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-sm shadow-amber-500/30"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>

              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-xs transition-colors"
                title="Upload or analyze another report"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">New Upload</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
