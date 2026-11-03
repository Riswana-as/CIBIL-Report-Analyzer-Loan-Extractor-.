import * as XLSX from 'xlsx';
import { CibilAccount, CibilReportData } from '../types/cibil';

export function formatIndianCurrency(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || amount === '') return '₹0';
  if (typeof amount === 'string' && amount.startsWith('₹')) return amount;

  const num = typeof amount === 'number' ? amount : parseFloat(String(amount).replace(/[^0-9.-]+/g, ''));
  if (isNaN(num)) return String(amount);

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num);
}

// Export Excel workbook with "One by One" sheet, "Comparison Matrix", and "Table Ledger"
export function exportToExcel(report: CibilReportData, accounts: CibilAccount[]) {
  const wb = XLSX.utils.book_new();

  // ==========================================
  // SHEET 1: LOANS ONE BY ONE (Line by Line)
  // ==========================================
  const oneByOneRows: any[][] = [
    ['CIBIL REPORT HOLDER NAME:', report.reportHolderName || 'N/A'],
    ['SCORE:', report.cibilScore || 'N/A'],
    ['DATE OF OBTAINING CIBIL REPORT:', report.dateOfObtainingReport || 'N/A'],
    ['TOTAL ACTIVE ACCOUNTS:', report.summary.activeAccounts ?? accounts.filter((a) => a.isActive).length],
    ['TOTAL CURRENT BALANCE:', report.summary.totalCurrentBalance ?? 0],
    ['TOTAL OVERDUE:', report.summary.totalAmountOverdue ?? 0],
    [],
  ];

  accounts.forEach((acc, index) => {
    const paymentHistoryStr =
      acc.paymentHistory && acc.paymentHistory.length > 0
        ? acc.paymentHistory.map((p) => `${p.monthYear}: ${p.dpdDays}`).join(', ')
        : 'N/A';

    oneByOneRows.push([`--- LOAN #${index + 1}: ${acc.bankName} ---`, '']);
    oneByOneRows.push(['Bank name', acc.bankName || '']);
    oneByOneRows.push(['Bank Account No', acc.accountNumber || '']);
    oneByOneRows.push(['Type Of Loan', acc.loanType || '']);
    oneByOneRows.push(['highest credit/loan amount', acc.highestCreditOrLoanAmount || '']);
    oneByOneRows.push(['Current Balance', acc.currentBalance || '0']);
    oneByOneRows.push(['Amount Overdue', acc.amountOverdue || '0']);
    oneByOneRows.push(['Ownership', acc.ownership || 'Individual']);
    oneByOneRows.push(['Date Opened /Disbursed', acc.dateOpenedOrDisbursed || '']);
    oneByOneRows.push(['Date Closed', acc.dateClosed || (acc.isActive ? 'Active / N/A' : 'N/A')]);
    oneByOneRows.push(['Emi (if available)', acc.emi || 'N/A']);
    oneByOneRows.push(['Status', acc.status || (acc.isActive ? 'Active' : 'Closed')]);
    oneByOneRows.push(['DPD', acc.dpdSummary || acc.maxDpd || '000']);
    oneByOneRows.push(['Month, year and days', paymentHistoryStr]);
    oneByOneRows.push([]); // blank separator line
  });

  const wsOneByOne = XLSX.utils.aoa_to_sheet(oneByOneRows);
  wsOneByOne['!cols'] = [{ wch: 32 }, { wch: 55 }];
  XLSX.utils.book_append_sheet(wb, wsOneByOne, 'Loans One by One');

  // ==========================================
  // SHEET 2: SIDE-BY-SIDE MATRIX (Fields One by One in Rows)
  // ==========================================
  const matrixHeaders = ['Field (One by One)', ...accounts.map((a, i) => `Loan #${i + 1}: ${a.bankName}`)];
  const matrixRows: any[][] = [
    ['CIBIL REPORT HOLDER NAME:', report.reportHolderName || 'N/A'],
    ['SCORE:', report.cibilScore || 'N/A'],
    ['DATE OF OBTAINING CIBIL REPORT:', report.dateOfObtainingReport || 'N/A'],
    ['TOTAL ACTIVE ACCOUNTS:', report.summary.activeAccounts],
    ['TOTAL CURRENT BALANCE:', report.summary.totalCurrentBalance ?? 0],
    ['TOTAL OVERDUE:', report.summary.totalAmountOverdue ?? 0],
    [],
    matrixHeaders,
    ['Bank name', ...accounts.map((a) => a.bankName)],
    ['Bank Account No', ...accounts.map((a) => a.accountNumber)],
    ['Type Of Loan', ...accounts.map((a) => a.loanType)],
    ['highest credit/loan amount', ...accounts.map((a) => a.highestCreditOrLoanAmount)],
    ['Current Balance', ...accounts.map((a) => a.currentBalance)],
    ['Amount Overdue', ...accounts.map((a) => a.amountOverdue)],
    ['Ownership', ...accounts.map((a) => a.ownership)],
    ['Date Opened /Disbursed', ...accounts.map((a) => a.dateOpenedOrDisbursed)],
    ['Date Closed', ...accounts.map((a) => a.dateClosed || (a.isActive ? 'Active / N/A' : 'N/A'))],
    ['Emi (if available)', ...accounts.map((a) => a.emi || 'N/A')],
    ['Status', ...accounts.map((a) => a.status)],
    ['DPD', ...accounts.map((a) => a.dpdSummary || a.maxDpd || '000')],
    [
      'Month, year and days',
      ...accounts.map((a) =>
        a.paymentHistory && a.paymentHistory.length > 0
          ? a.paymentHistory.map((p) => `${p.monthYear}: ${p.dpdDays}`).join(', ')
          : 'N/A'
      ),
    ],
  ];

  const wsMatrix = XLSX.utils.aoa_to_sheet(matrixRows);
  wsMatrix['!cols'] = [{ wch: 30 }, ...accounts.map(() => ({ wch: 28 }))];
  XLSX.utils.book_append_sheet(wb, wsMatrix, 'Side-by-Side Matrix');

  // ==========================================
  // SHEET 3: TABULAR LEDGER (Wide Table)
  // ==========================================
  const tableData: any[][] = [
    ['CIBIL REPORT HOLDER NAME:', report.reportHolderName || 'N/A'],
    ['SCORE:', report.cibilScore || 'N/A'],
    ['DATE OF OBTAINING CIBIL REPORT:', report.dateOfObtainingReport || 'N/A'],
    ['TOTAL ACTIVE ACCOUNTS:', report.summary.activeAccounts],
    ['TOTAL CURRENT BALANCE:', report.summary.totalCurrentBalance ?? 0],
    ['TOTAL OVERDUE:', report.summary.totalAmountOverdue ?? 0],
    [],
    [
      'Sr No',
      'Bank Name',
      'Bank Account No',
      'Type Of Loan',
      'Highest Credit / Loan Amount',
      'Current Balance',
      'Amount Overdue',
      'Ownership',
      'Date Opened / Disbursed',
      'Date Closed',
      'EMI',
      'Status',
      'DPD',
      'Month, Year and Days',
    ],
  ];

  accounts.forEach((acc, index) => {
    const paymentHistoryStr =
      acc.paymentHistory && acc.paymentHistory.length > 0
        ? acc.paymentHistory.map((p) => `${p.monthYear}: ${p.dpdDays}`).join('; ')
        : 'N/A';

    tableData.push([
      index + 1,
      acc.bankName || '',
      acc.accountNumber || '',
      acc.loanType || '',
      acc.highestCreditOrLoanAmount || '',
      acc.currentBalance || '0',
      acc.amountOverdue || '0',
      acc.ownership || 'Individual',
      acc.dateOpenedOrDisbursed || '',
      acc.dateClosed || (acc.isActive ? 'Active' : 'N/A'),
      acc.emi || 'N/A',
      acc.status || (acc.isActive ? 'Active' : 'Closed'),
      acc.dpdSummary || acc.maxDpd || '000',
      paymentHistoryStr,
    ]);
  });

  const wsTable = XLSX.utils.aoa_to_sheet(tableData);
  wsTable['!cols'] = [
    { wch: 8 },
    { wch: 26 },
    { wch: 22 },
    { wch: 20 },
    { wch: 24 },
    { wch: 18 },
    { wch: 18 },
    { wch: 16 },
    { wch: 22 },
    { wch: 18 },
    { wch: 16 },
    { wch: 16 },
    { wch: 20 },
    { wch: 40 },
  ];
  XLSX.utils.book_append_sheet(wb, wsTable, 'Tabular View');

  const cleanName = (report.reportHolderName || 'cibil_report').replace(/\s+/g, '_').toLowerCase();
  XLSX.writeFile(wb, `cibil_report_one_by_one_${cleanName}.xlsx`);
}

// Export formatted CSV where loan details are formatted one by one
export function exportToCSV(report: CibilReportData, accounts: CibilAccount[]) {
  let lines: string[] = [
    `"CIBIL REPORT HOLDER NAME:","${(report.reportHolderName || '').replace(/"/g, '""')}"`,
    `"SCORE:","${report.cibilScore || 'N/A'}"`,
    `"DATE OF OBTAINING CIBIL REPORT:","${report.dateOfObtainingReport || 'N/A'}"`,
    `"TOTAL ACTIVE ACCOUNTS:","${report.summary.activeAccounts}"`,
    `"TOTAL CURRENT BALANCE:","${report.summary.totalCurrentBalance}"`,
    `"TOTAL OVERDUE:","${report.summary.totalAmountOverdue}"`,
    `""`,
  ];

  accounts.forEach((acc, index) => {
    const paymentHistoryStr =
      acc.paymentHistory && acc.paymentHistory.length > 0
        ? acc.paymentHistory.map((p) => `${p.monthYear}: ${p.dpdDays}`).join(', ')
        : 'N/A';

    lines.push(`"--- LOAN #${index + 1}: ${(acc.bankName || '').replace(/"/g, '""')} ---",""`);
    lines.push(`"Bank name:","${(acc.bankName || '').replace(/"/g, '""')}"`);
    lines.push(`"Bank Account No:","${(acc.accountNumber || '').replace(/"/g, '""')}"`);
    lines.push(`"Type Of Loan:","${(acc.loanType || '').replace(/"/g, '""')}"`);
    lines.push(`"highest credit/loan amount:","${acc.highestCreditOrLoanAmount || ''}"`);
    lines.push(`"Current Balance:","${acc.currentBalance || '0'}"`);
    lines.push(`"Amount Overdue:","${acc.amountOverdue || '0'}"`);
    lines.push(`"Ownership:","${acc.ownership || 'Individual'}"`);
    lines.push(`"Date Opened /Disbursed:","${acc.dateOpenedOrDisbursed || ''}"`);
    lines.push(`"Date Closed:","${acc.dateClosed || (acc.isActive ? 'Active / N/A' : 'N/A')}"`);
    lines.push(`"Emi (if available):","${acc.emi || 'N/A'}"`);
    lines.push(`"Status:","${acc.status || ''}"`);
    lines.push(`"DPD:","${(acc.dpdSummary || acc.maxDpd || '000').replace(/"/g, '""')}"`);
    lines.push(`"Month, year and days:","${paymentHistoryStr.replace(/"/g, '""')}"`);
    lines.push(`""`);
  });

  const csvContent = '\uFEFF' + lines.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  const cleanName = (report.reportHolderName || 'cibil_report').replace(/\s+/g, '_').toLowerCase();
  link.setAttribute('download', `cibil_report_one_by_one_${cleanName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function generateAppraisalMemoText(report: CibilReportData, accounts: CibilAccount[]): string {
  let text = `CIBIL REPORT HOLDER NAME: ${report.reportHolderName || 'N/A'}\n`;
  text += `SCORE: ${report.cibilScore || 'N/A'}\n`;
  text += `DATE OF OBTAINING CIBIL REPORT: ${report.dateOfObtainingReport || 'N/A'}\n`;
  text += `TOTAL ACTIVE ACCOUNTS: ${report.summary.activeAccounts}\n`;
  text += `TOTAL CURRENT BALANCE: ${formatIndianCurrency(report.summary.totalCurrentBalance)}\n`;
  text += `TOTAL OVERDUE: ${formatIndianCurrency(report.summary.totalAmountOverdue)}\n\n`;

  accounts.forEach((acc, i) => {
    const history =
      acc.paymentHistory && acc.paymentHistory.length > 0
        ? acc.paymentHistory.map((p) => `${p.monthYear}: ${p.dpdDays}`).join(', ')
        : 'N/A';

    text += `Loan #${i + 1}:\n`;
    text += `Bank name: ${acc.bankName}\n`;
    text += `Bank Account No: ${acc.accountNumber}\n`;
    text += `Type Of Loan: ${acc.loanType}\n`;
    text += `highest credit/loan amount: ${formatIndianCurrency(acc.highestCreditOrLoanAmount)}\n`;
    text += `Current Balance: ${formatIndianCurrency(acc.currentBalance)}\n`;
    text += `Amount Overdue: ${formatIndianCurrency(acc.amountOverdue)}\n`;
    text += `Ownership: ${acc.ownership}\n`;
    text += `Date Opened /Disbursed: ${acc.dateOpenedOrDisbursed}\n`;
    text += `Date Closed: ${acc.dateClosed || (acc.isActive ? 'Active / N/A' : 'N/A')}\n`;
    text += `Emi (if available): ${acc.emi && acc.emi !== 'N/A' ? formatIndianCurrency(acc.emi) : 'N/A'}\n`;
    text += `Status: ${acc.status}\n`;
    text += `DPD: ${acc.dpdSummary || acc.maxDpd || '000'}\n`;
    text += `Month, year and days: ${history}\n\n`;
  });

  return text;
}
