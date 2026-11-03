import React, { useState } from 'react';
import { CibilAccount } from '../types/cibil';
import { X, Save, AlertCircle } from 'lucide-react';

interface EditAccountModalProps {
  account: CibilAccount;
  index: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAccount: CibilAccount, index: number) => void;
}

export const EditAccountModal: React.FC<EditAccountModalProps> = ({
  account,
  index,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<CibilAccount>({ ...account });

  if (!isOpen) return null;

  const handleChange = (field: keyof CibilAccount, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, index);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Edit Account #{index + 1}: {account.bankName}
            </h3>
            <p className="text-xs text-slate-500">
              Modify extracted fields or append underwriting observations
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">1. Bank Name</label>
              <input
                type="text"
                value={formData.bankName}
                onChange={(e) => handleChange('bankName', e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">2. Bank Account No</label>
              <input
                type="text"
                value={formData.accountNumber}
                onChange={(e) => handleChange('accountNumber', e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-mono"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">3. Type Of Loan</label>
              <input
                type="text"
                value={formData.loanType}
                onChange={(e) => handleChange('loanType', e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                4. Highest Credit / Loan Amount
              </label>
              <input
                type="text"
                value={formData.highestCreditOrLoanAmount}
                onChange={(e) => handleChange('highestCreditOrLoanAmount', e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">5. Current Balance</label>
              <input
                type="text"
                value={formData.currentBalance}
                onChange={(e) => handleChange('currentBalance', e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">6. Amount Overdue</label>
              <input
                type="text"
                value={formData.amountOverdue}
                onChange={(e) => handleChange('amountOverdue', e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">7. Ownership</label>
              <input
                type="text"
                value={formData.ownership}
                onChange={(e) => handleChange('ownership', e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">8. Date Opened / Disbursed</label>
              <input
                type="text"
                value={formData.dateOpenedOrDisbursed}
                onChange={(e) => handleChange('dateOpenedOrDisbursed', e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">9. Date Closed</label>
              <input
                type="text"
                value={formData.dateClosed}
                onChange={(e) => handleChange('dateClosed', e.target.value)}
                placeholder="Active / N/A or DD/MM/YYYY"
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">10. EMI</label>
              <input
                type="text"
                value={formData.emi}
                onChange={(e) => handleChange('emi', e.target.value)}
                placeholder="₹ Amount or N/A"
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">11. Status</label>
              <input
                type="text"
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">12. DPD Summary</label>
              <input
                type="text"
                value={formData.dpdSummary || formData.maxDpd}
                onChange={(e) => {
                  handleChange('dpdSummary', e.target.value);
                  handleChange('maxDpd', e.target.value);
                }}
                className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Underwriting Remarks / Notes
            </label>
            <textarea
              rows={2}
              value={formData.remarks || ''}
              onChange={(e) => handleChange('remarks', e.target.value)}
              placeholder="Add verification notes, settlement waivers, or bank clarifications..."
              className="w-full p-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 font-semibold text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
