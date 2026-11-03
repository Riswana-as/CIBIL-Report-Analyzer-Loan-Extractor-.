import React, { useState, useRef } from 'react';
import { Upload, FileUp, ClipboardPaste, BookOpen, Sparkles, CheckCircle2, AlertCircle, FileCheck, ArrowRight } from 'lucide-react';
import { SAMPLE_REPORTS, SampleReportItem } from '../data/sampleReports';

interface UploadSectionProps {
  onAnalyze: (payload: { fileBase64?: string; mimeType?: string; textContent?: string; fileName?: string }) => Promise<void>;
  onLoadPreparsedSample: (sample: SampleReportItem) => void;
  isLoading: boolean;
  loadingStep: string;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onAnalyze,
  onLoadPreparsedSample,
  isLoading,
  loadingStep,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste' | 'samples'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState<string>('');
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (file: File) => {
    setErrorMessage(null);
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'text/plain'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.txt')) {
      setErrorMessage('Please upload a valid CIBIL report PDF, image (PNG/JPG), or text file.');
      return;
    }
    if (file.size > 25 * 1024 * 1024) {
      setErrorMessage('File size exceeds 25MB limit. Please upload a smaller file.');
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async () => {
    setErrorMessage(null);
    if (activeTab === 'upload') {
      if (!selectedFile) {
        setErrorMessage('Please select a CIBIL report file first.');
        return;
      }
      try {
        const reader = new FileReader();
        if (selectedFile.type === 'text/plain' || selectedFile.name.endsWith('.txt')) {
          reader.onload = async () => {
            const text = reader.result as string;
            await onAnalyze({ textContent: text, fileName: selectedFile.name });
          };
          reader.readAsText(selectedFile);
        } else {
          reader.onload = async () => {
            const dataUrl = reader.result as string;
            // Extract base64 without prefix data:...;base64,
            const base64Data = dataUrl.split(',')[1];
            const mimeType = selectedFile.type || (selectedFile.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg');
            await onAnalyze({
              fileBase64: base64Data,
              mimeType,
              fileName: selectedFile.name,
            });
          };
          reader.readAsDataURL(selectedFile);
        }
      } catch (err: any) {
        setErrorMessage(err.message || 'Error reading the file.');
      }
    } else if (activeTab === 'paste') {
      if (!pastedText.trim()) {
        setErrorMessage('Please paste your CIBIL report text content.');
        return;
      }
      await onAnalyze({ textContent: pastedText, fileName: 'pasted_cibil_text.txt' });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Banner / Guide */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 text-white">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Automated Banking Underwriting Extraction</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
            Upload CIBIL Report for Instant Loan Data Extraction
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Extracts report holder name, CIBIL score, report date, and all 13 loan parameters. Applies the required condition:
            <span className="font-semibold text-amber-300 ml-1">
              Provides details of all Active loans, plus any Closed loans with DPD, suit filed, written-off, or settlement.
            </span>
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-2 mt-6 border-b border-slate-700/80 pb-px">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileUp className="w-4 h-4" />
            <span>Upload File (PDF / Image)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all ${
              activeTab === 'paste'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ClipboardPaste className="w-4 h-4" />
            <span>Paste CIR Text</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-semibold rounded-t-xl transition-all ${
              activeTab === 'samples'
                ? 'bg-amber-400 text-slate-950 shadow-xs font-bold'
                : 'text-amber-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1-Click Test Samples</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="p-6">
        {errorMessage && (
          <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: Upload File */}
        {activeTab === 'upload' && (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
                dragOver
                  ? 'border-amber-500 bg-amber-50/50'
                  : selectedFile
                  ? 'border-emerald-400 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp,.txt"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              />

              {selectedFile ? (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">{selectedFile.name}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Click or drag another file to replace
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Drag and drop your CIBIL report here, or <span className="text-amber-600 underline">browse files</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1.5">
                    Supports Official CIBIL PDF, scanned images (PNG, JPG), or text reports (up to 25MB)
                  </p>
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-slate-500 space-y-1">
                <p>🔒 Uploaded files are processed securely to extract your requested credit report data.</p>
                <p className="text-[11px] text-amber-700">
                  💡 <strong>Tip:</strong> If your CIBIL PDF has a password (e.g., DOB DDMMYYYY), please open and save/print as unlocked PDF first, or copy & paste text into the <em>Paste CIR Text</em> tab.
                </p>
              </div>
              <button
                type="button"
                disabled={!selectedFile || isLoading}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{loadingStep || 'Processing CIBIL Report...'}</span>
                  </>
                ) : (
                  <>
                    <span>Extract & Generate Report</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Paste CIR Text */}
        {activeTab === 'paste' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Paste Raw CIBIL Credit Information Report (CIR) Text
            </label>
            <textarea
              rows={8}
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder="Paste the text from your CIBIL report here...&#10;&#10;e.g.:&#10;NAME: RAJESH KUMAR SHARMA&#10;CIBIL SCORE: 742&#10;REPORT DATE: 18/02/2025&#10;MEMBER NAME: HDFC BANK LTD&#10;ACCOUNT TYPE: Housing Loan..."
              className="w-full text-xs font-mono p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-slate-50/50"
            />
            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
              <span className="text-xs text-slate-500">
                {pastedText.length} characters pasted
              </span>
              <button
                type="button"
                disabled={!pastedText.trim() || isLoading}
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{loadingStep || 'Analyzing Text...'}</span>
                  </>
                ) : (
                  <>
                    <span>Analyze & Extract Data</span>
                    <ArrowRight className="w-4 h-4 text-amber-400" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Sample Reports */}
        {activeTab === 'samples' && (
          <div>
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-800">
                Choose a pre-configured CIBIL Report to test the extractor instantly:
              </h3>
              <p className="text-xs text-slate-500">
                Includes realistic loan portfolios with active facilities, DPD delay histories, suit filed / written-off accounts, and settlements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SAMPLE_REPORTS.map((sample) => (
                <div
                  key={sample.id}
                  className="rounded-xl border border-slate-200 p-4 hover:border-amber-400 hover:bg-amber-50/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-900">{sample.holderName}</span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          sample.score >= 750
                            ? 'bg-emerald-100 text-emerald-800'
                            : sample.score >= 700
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        Score: {sample.score}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 line-clamp-3 mb-3">{sample.description}</p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => onLoadPreparsedSample(sample)}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors text-center"
                    >
                      Instant Preview
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPastedText(sample.rawText);
                        setActiveTab('paste');
                      }}
                      className="py-1.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                      title="Load raw text to run through AI model"
                    >
                      Test with AI
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
