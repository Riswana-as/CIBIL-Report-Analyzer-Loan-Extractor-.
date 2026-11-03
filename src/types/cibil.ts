export interface PaymentHistoryEntry {
  monthYear: string;
  dpdDays: string;
  statusText?: string;
}

export interface CibilAccount {
  id?: string;
  bankName: string;
  accountNumber: string;
  loanType: string;
  highestCreditOrLoanAmount: string | number;
  currentBalance: string | number;
  amountOverdue: string | number;
  ownership: string;
  dateOpenedOrDisbursed: string;
  dateClosed: string;
  emi: string;
  status: string;
  isActive: boolean;
  isClosed: boolean;
  hasDpd: boolean;
  maxDpd: string;
  isSuitFiled: boolean;
  isWrittenOff: boolean;
  isSettled: boolean;
  meetsCondition: boolean;
  dpdSummary: string;
  paymentHistory: PaymentHistoryEntry[];
  remarks?: string;
}

export interface CibilSummary {
  totalAccounts: number;
  activeAccounts: number;
  closedAccounts: number;
  totalSanctionedAmount: number;
  totalCurrentBalance: number;
  totalAmountOverdue: number;
  totalMonthlyEmi: number;
  derogatoryAccountsCount: number;
  overallCreditHealthSummary?: string;
}

export interface CibilReportData {
  reportHolderName: string;
  cibilScore: string | number;
  scoreCategory?: string;
  dateOfObtainingReport: string;
  controlNumber?: string;
  panNumber?: string;
  dateOfBirth?: string;
  summary: CibilSummary;
  accounts: CibilAccount[];
}

export type FilterOption = 'conditioned' | 'all' | 'active_only' | 'derogatory_only';
