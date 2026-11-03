import { CibilReportData } from '../types/cibil';

export interface SampleReportItem {
  id: string;
  title: string;
  holderName: string;
  score: number;
  description: string;
  rawText: string;
  parsedData: CibilReportData;
}

export const SAMPLE_REPORTS: SampleReportItem[] = [
  {
    id: 'sample-user-cibil',
    title: 'Screenshot Sample: Chekkintakath Aboobakkar (Score 748)',
    holderName: 'CHEKKINTAKATH ABOOBAKKAR',
    score: 748,
    description: 'Exact data from your spreadsheet: 2 Active Consumer Loans (Karur Vysya & Axio), 0 Current Balance, 0 Overdue, Score 748, Report Date: 16-09-2025.',
    rawText: `TRANSUNION CIBIL CREDIT INFORMATION REPORT (CIR)
REPORT ORDER NO: TU-CIR-2025-7729103
DATE OF REPORT: 16-09-2025
REPORT DATE: 16-09-2025
NAME: CHEKKINTAKATH ABOOBAKKAR
DATE OF BIRTH: 05/04/1988   GENDER: MALE
CIBIL TRANSUNION SCORE: 748

ACCOUNT INFORMATION DETAILS:

1. MEMBER NAME: KARUR VYSYA
   ACCOUNT NUMBER: KAN22E003368450
   ACCOUNT TYPE: Consumer Loan
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 18-03-2022
   DATE CLOSED: N/A
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 8,000
   CURRENT BALANCE: Rs. 0
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: N/A
   STATUS: Active / Open
   PAYMENT HISTORY (DPD):
   Aug 2025: 000 | Jul 2025: 000 | Jun 2025: 000 | May 2025: 000
   REMARKS: Standard Consumer Loan, timely repayments

2. MEMBER NAME: AXIO
   ACCOUNT NUMBER: KAN22E003368450
   ACCOUNT TYPE: Consumer Loan
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 22-07-2022
   DATE CLOSED: N/A
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 2,00,0
   CURRENT BALANCE: Rs. 0
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: N/A
   STATUS: Active / Open
   PAYMENT HISTORY (DPD):
   Aug 2025: 000 | Jul 2025: 000 | Jun 2025: 000 | May 2025: 000
   REMARKS: Active Consumer credit facility`,
    parsedData: {
      reportHolderName: 'CHEKKINTAKATH ABOOBAKKAR',
      cibilScore: '748',
      scoreCategory: 'Good',
      dateOfObtainingReport: '16-09-2025',
      controlNumber: 'TU-CIR-2025-7729103',
      dateOfBirth: '05/04/1988',
      summary: {
        totalAccounts: 2,
        activeAccounts: 2,
        closedAccounts: 0,
        totalSanctionedAmount: 10000,
        totalCurrentBalance: 0,
        totalAmountOverdue: 0,
        totalMonthlyEmi: 0,
        derogatoryAccountsCount: 0,
        overallCreditHealthSummary:
          'Applicant maintains a Good credit score of 748 with 2 active consumer loan facilities (Karur Vysya & Axio). Zero overdue balance and clean track record.',
      },
      accounts: [
        {
          bankName: 'KARUR VYSYA',
          accountNumber: 'KAN22E003368450',
          loanType: 'Consumer Loan',
          highestCreditOrLoanAmount: '₹8,000',
          currentBalance: '₹0',
          amountOverdue: '₹0',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '18-03-2022',
          dateClosed: 'Active / N/A',
          emi: 'N/A',
          status: 'Active',
          isActive: true,
          isClosed: false,
          hasDpd: false,
          maxDpd: '000 (Clean)',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: true,
          dpdSummary: 'Zero DPD, clean payment history',
          paymentHistory: [
            { monthYear: 'Aug 2025', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Jul 2025', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Jun 2025', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'May 2025', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: 'Standard Consumer Loan, timely repayments',
        },
        {
          bankName: 'AXIO',
          accountNumber: 'KAN22E003368450',
          loanType: 'Consumer Loan',
          highestCreditOrLoanAmount: '₹2,000',
          currentBalance: '₹0',
          amountOverdue: '₹0',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '22-07-2022',
          dateClosed: 'Active / N/A',
          emi: 'N/A',
          status: 'Active',
          isActive: true,
          isClosed: false,
          hasDpd: false,
          maxDpd: '000 (Clean)',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: true,
          dpdSummary: 'Zero DPD, clean payment history',
          paymentHistory: [
            { monthYear: 'Aug 2025', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Jul 2025', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Jun 2025', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'May 2025', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: 'Active Consumer credit facility',
        },
      ],
    },
  },
  {
    id: 'sample-1',
    title: 'Sample 1: Rajesh Kumar Sharma (Score 742 - Good)',
    holderName: 'RAJESH KUMAR SHARMA',
    score: 742,
    description: 'Active Home & Personal loan, Credit Card; Closed Axis Auto Loan settled with 60 DPD; Closed clean Bajaj Consumer loan.',
    rawText: `TRANSUNION CIBIL CREDIT INFORMATION REPORT (CIR)
REPORT ORDER NO: TU-CIR-2025-8839210
REPORT DATE: 18/02/2025
NAME: RAJESH KUMAR SHARMA
DATE OF BIRTH: 14/06/1985   GENDER: MALE   PAN: AFZPS4928K
CIBIL TRANSUNION SCORE: 742

ACCOUNT INFORMATION DETAILS:

1. MEMBER NAME: HDFC BANK LTD
   ACCOUNT NUMBER: 50100492819284
   ACCOUNT TYPE: Housing Loan
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 15/04/2021
   DATE CLOSED: N/A
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 45,00,000
   CURRENT BALANCE: Rs. 38,20,450
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: Rs. 41,200
   STATUS: Active / Open
   PAYMENT HISTORY (DPD):
   Jan 2025: 000 | Dec 2024: 000 | Nov 2024: 000 | Oct 2024: 000 | Sep 2024: 000 | Aug 2024: 000 | Jul 2024: 000 | Jun 2024: 000
   REMARKS: Standard Asset, regular repayments

2. MEMBER NAME: ICICI BANK LTD
   ACCOUNT NUMBER: 002938491823
   ACCOUNT TYPE: Personal Loan
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 10/11/2022
   DATE CLOSED: N/A
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 5,00,000
   CURRENT BALANCE: Rs. 1,85,600
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: Rs. 14,500
   STATUS: Active / Open
   PAYMENT HISTORY (DPD):
   Jan 2025: 000 | Dec 2024: 000 | Nov 2024: 000 | Oct 2024: 000 | Sep 2024: 000 | Aug 2024: 000 | Jul 2024: 000 | Jun 2024: 000 | May 2024: 030 | Apr 2024: 000
   REMARKS: 30 days past due recorded in May 2024, now regularized

3. MEMBER NAME: STATE BANK OF INDIA
   ACCOUNT NUMBER: 438291049281XXXX
   ACCOUNT TYPE: Credit Card
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 05/01/2020
   DATE CLOSED: N/A
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 2,00,000
   CURRENT BALANCE: Rs. 45,210
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: N/A
   STATUS: Active / Open
   PAYMENT HISTORY (DPD):
   Jan 2025: 000 | Dec 2024: 000 | Nov 2024: 000 | Oct 2024: 000 | Sep 2024: 000 | Aug 2024: 000
   REMARKS: Clean revolving card, payments made on time

4. MEMBER NAME: AXIS BANK LTD
   ACCOUNT NUMBER: 914020048291029
   ACCOUNT TYPE: Auto Loan
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 12/03/2019
   DATE CLOSED: 15/12/2023
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 8,50,000
   CURRENT BALANCE: Rs. 0
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: Rs. 17,800
   STATUS: Closed / Settled
   PAYMENT HISTORY (DPD):
   Nov 2023: 000 | Oct 2023: 000 | Sep 2023: 060 | Aug 2023: 030 | Jul 2023: 000 | Jun 2023: 000
   REMARKS: Account closed under One-Time Settlement with concession. Recorded 60 DPD in Sep 2023.

5. MEMBER NAME: BAJAJ FINANCE LTD
   ACCOUNT NUMBER: L2B49102849
   ACCOUNT TYPE: Consumer Loan
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 18/08/2022
   DATE CLOSED: 10/01/2023
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 65,000
   CURRENT BALANCE: Rs. 0
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: Rs. 6,500
   STATUS: Closed
   PAYMENT HISTORY (DPD):
   Jan 2023: 000 | Dec 2022: 000 | Nov 2022: 000 | Oct 2022: 000 | Sep 2022: 000
   REMARKS: Closed on maturity with clean record (No DPD, No settlement).`,
    parsedData: {
      reportHolderName: 'RAJESH KUMAR SHARMA',
      cibilScore: '742',
      scoreCategory: 'Good',
      dateOfObtainingReport: '18/02/2025',
      controlNumber: 'TU-CIR-2025-8839210',
      panNumber: 'AFZPS4928K',
      dateOfBirth: '14/06/1985',
      summary: {
        totalAccounts: 5,
        activeAccounts: 3,
        closedAccounts: 2,
        totalSanctionedAmount: 5200000,
        totalCurrentBalance: 4051260,
        totalAmountOverdue: 0,
        totalMonthlyEmi: 55700,
        derogatoryAccountsCount: 2,
        overallCreditHealthSummary:
          'Applicant maintains a Good credit score of 742 with 3 active loans. Active accounts are serviced on time. Noticeable 60 DPD and settlement record found on closed Axis Bank auto loan.',
      },
      accounts: [
        {
          bankName: 'HDFC BANK LTD',
          accountNumber: '50100492819284',
          loanType: 'Housing Loan',
          highestCreditOrLoanAmount: '₹45,00,000',
          currentBalance: '₹38,20,450',
          amountOverdue: '₹0',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '15/04/2021',
          dateClosed: 'Active / N/A',
          emi: '₹41,200',
          status: 'Active',
          isActive: true,
          isClosed: false,
          hasDpd: false,
          maxDpd: '000 (Clean)',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: true,
          dpdSummary: 'Clean repayment history without any delayed installments',
          paymentHistory: [
            { monthYear: 'Jan 2025', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Dec 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Nov 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Oct 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Sep 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Aug 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Jul 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Jun 2024', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: 'Standard Asset, regular repayments',
        },
        {
          bankName: 'ICICI BANK LTD',
          accountNumber: '002938491823',
          loanType: 'Personal Loan',
          highestCreditOrLoanAmount: '₹5,00,000',
          currentBalance: '₹1,85,600',
          amountOverdue: '₹0',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '10/11/2022',
          dateClosed: 'Active / N/A',
          emi: '₹14,500',
          status: 'Active',
          isActive: true,
          isClosed: false,
          hasDpd: true,
          maxDpd: '30 Days',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: true,
          dpdSummary: '1 instance of 30 DPD observed in May 2024, regularized currently',
          paymentHistory: [
            { monthYear: 'Jan 2025', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Dec 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Nov 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Oct 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Sep 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Aug 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Jul 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Jun 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'May 2024', dpdDays: '030', statusText: '30 Days Late' },
            { monthYear: 'Apr 2024', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: '30 DPD recorded in May 2024, currently up to date',
        },
        {
          bankName: 'STATE BANK OF INDIA',
          accountNumber: '438291049281XXXX',
          loanType: 'Credit Card',
          highestCreditOrLoanAmount: '₹2,00,000',
          currentBalance: '₹45,210',
          amountOverdue: '₹0',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '05/01/2020',
          dateClosed: 'Active / N/A',
          emi: 'N/A',
          status: 'Active',
          isActive: true,
          isClosed: false,
          hasDpd: false,
          maxDpd: '000 (Clean)',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: true,
          dpdSummary: 'Clean credit card revolving balance within 23% utilization',
          paymentHistory: [
            { monthYear: 'Jan 2025', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Dec 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Nov 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Oct 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Sep 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Aug 2024', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: 'Clean revolving card, regular payments',
        },
        {
          bankName: 'AXIS BANK LTD',
          accountNumber: '914020048291029',
          loanType: 'Auto Loan',
          highestCreditOrLoanAmount: '₹8,50,000',
          currentBalance: '₹0',
          amountOverdue: '₹0',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '12/03/2019',
          dateClosed: '15/12/2023',
          emi: '₹17,800',
          status: 'Closed / Settled',
          isActive: false,
          isClosed: true,
          hasDpd: true,
          maxDpd: '60 Days',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: true,
          meetsCondition: true,
          dpdSummary: '60 DPD delay in Sep 2023, settled account with lender waiver',
          paymentHistory: [
            { monthYear: 'Nov 2023', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Oct 2023', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Sep 2023', dpdDays: '060', statusText: '60 Days Late' },
            { monthYear: 'Aug 2023', dpdDays: '030', statusText: '30 Days Late' },
            { monthYear: 'Jul 2023', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Jun 2023', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: 'Account closed under One-Time Settlement. Recorded 60 DPD in Sep 2023.',
        },
        {
          bankName: 'BAJAJ FINANCE LTD',
          accountNumber: 'L2B49102849',
          loanType: 'Consumer Loan',
          highestCreditOrLoanAmount: '₹65,000',
          currentBalance: '₹0',
          amountOverdue: '₹0',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '18/08/2022',
          dateClosed: '10/01/2023',
          emi: '₹6,500',
          status: 'Closed',
          isActive: false,
          isClosed: true,
          hasDpd: false,
          maxDpd: '000 (Clean)',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: false,
          dpdSummary: 'Zero DPD, closed cleanly on maturity (omitted under conditioned filter)',
          paymentHistory: [
            { monthYear: 'Jan 2023', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Dec 2022', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Nov 2022', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Oct 2022', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Sep 2022', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: 'Closed on maturity with clean record (No DPD, No settlement).',
        },
      ],
    },
  },
  {
    id: 'sample-2',
    title: 'Sample 2: Vikramaditya Rao (Score 585 - High Risk / Defaults)',
    holderName: 'VIKRAMADITYA RAO',
    score: 585,
    description: 'Active Overdraft with 90+ DPD overdue; Active Two-Wheeler loan; Written-Off & Suit-Filed Kotak Card; Settled Tata Capital Loan.',
    rawText: `TRANSUNION CIBIL CREDIT INFORMATION REPORT (CIR)
REPORT ORDER NO: TU-CIR-2025-1049283
REPORT DATE: 22/01/2025
NAME: VIKRAMADITYA RAO
DATE OF BIRTH: 03/11/1979   GENDER: MALE   PAN: BVYPR7319M
CIBIL TRANSUNION SCORE: 585

ACCOUNT INFORMATION DETAILS:

1. MEMBER NAME: CANARA BANK
   ACCOUNT NUMBER: 104928100293
   ACCOUNT TYPE: Overdraft / Cash Credit
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 14/02/2021
   DATE CLOSED: N/A
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 25,00,000
   CURRENT BALANCE: Rs. 26,85,000
   AMOUNT OVERDUE: Rs. 2,80,000
   EMI AMOUNT: Rs. 28,000
   STATUS: Active / NPA
   PAYMENT HISTORY (DPD):
   Dec 2024: 090 | Nov 2024: 090 | Oct 2024: 060 | Sep 2024: 030 | Aug 2024: 000
   REMARKS: Serious non-payment default, 90+ DPD overdue balance

2. MEMBER NAME: HDFC BANK LTD
   ACCOUNT NUMBER: 502938491028
   ACCOUNT TYPE: Two-Wheeler Loan
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 18/05/2023
   DATE CLOSED: N/A
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 85,000
   CURRENT BALANCE: Rs. 32,400
   AMOUNT OVERDUE: Rs. 4,200
   EMI AMOUNT: Rs. 4,200
   STATUS: Active
   PAYMENT HISTORY (DPD):
   Dec 2024: 030 | Nov 2024: 030 | Oct 2024: 000 | Sep 2024: 000
   REMARKS: 30 DPD with 1 EMI overdue

3. MEMBER NAME: KOTAK MAHINDRA BANK
   ACCOUNT NUMBER: 412938491029XXXX
   ACCOUNT TYPE: Credit Card
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 11/09/2018
   DATE CLOSED: 20/04/2024
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 1,50,000
   CURRENT BALANCE: Rs. 1,82,000
   AMOUNT OVERDUE: Rs. 1,82,000
   EMI AMOUNT: N/A
   STATUS: Written Off / Suit Filed
   PAYMENT HISTORY (DPD):
   Mar 2024: 180 | Feb 2024: 150 | Jan 2024: 120 | Dec 2023: 090
   REMARKS: Suit Filed, Total amount written off Rs. 1,82,000. Severe Derogatory.

4. MEMBER NAME: TATA CAPITAL FINANCIAL SERVICES
   ACCOUNT NUMBER: TC7492019284
   ACCOUNT TYPE: Personal Loan
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 08/07/2020
   DATE CLOSED: 14/11/2023
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 3,00,000
   CURRENT BALANCE: Rs. 0
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: Rs. 9,800
   STATUS: Closed / Settled
   PAYMENT HISTORY (DPD):
   Oct 2023: 000 | Sep 2023: 090 | Aug 2023: 060 | Jul 2023: 030
   REMARKS: Settled with post-writeoff waiver of Rs. 84,000.

5. MEMBER NAME: STATE BANK OF INDIA
   ACCOUNT NUMBER: 30294819203
   ACCOUNT TYPE: Education Loan
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 15/06/2014
   DATE CLOSED: 20/05/2021
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 4,00,000
   CURRENT BALANCE: Rs. 0
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: Rs. 6,200
   STATUS: Closed
   PAYMENT HISTORY (DPD):
   Apr 2021: 000 | Mar 2021: 000 | Feb 2021: 000
   REMARKS: Closed fully without default.`,
    parsedData: {
      reportHolderName: 'VIKRAMADITYA RAO',
      cibilScore: '585',
      scoreCategory: 'Poor',
      dateOfObtainingReport: '22/01/2025',
      controlNumber: 'TU-CIR-2025-1049283',
      panNumber: 'BVYPR7319M',
      dateOfBirth: '03/11/1979',
      summary: {
        totalAccounts: 5,
        activeAccounts: 2,
        closedAccounts: 3,
        totalSanctionedAmount: 2585000,
        totalCurrentBalance: 2717400,
        totalAmountOverdue: 466200,
        totalMonthlyEmi: 32200,
        derogatoryAccountsCount: 4,
        overallCreditHealthSummary:
          'High Risk Profile: CIBIL Score 585 with multiple active defaults (90+ DPD overdue on Canara Bank CC limit), Kotak Credit Card marked Written-off and Suit Filed, and Tata Capital settled loan.',
      },
      accounts: [
        {
          bankName: 'CANARA BANK',
          accountNumber: '104928100293',
          loanType: 'Overdraft / Cash Credit',
          highestCreditOrLoanAmount: '₹25,00,000',
          currentBalance: '₹26,85,000',
          amountOverdue: '₹2,80,000',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '14/02/2021',
          dateClosed: 'Active / N/A',
          emi: '₹28,000',
          status: 'Active / NPA',
          isActive: true,
          isClosed: false,
          hasDpd: true,
          maxDpd: '90+ Days',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: true,
          dpdSummary: 'Continuous 90+ DPD default with ₹2.8L overdue balance',
          paymentHistory: [
            { monthYear: 'Dec 2024', dpdDays: '090', statusText: '90+ Days Past Due (Substandard)' },
            { monthYear: 'Nov 2024', dpdDays: '090', statusText: '90+ Days Past Due' },
            { monthYear: 'Oct 2024', dpdDays: '060', statusText: '60 Days Past Due' },
            { monthYear: 'Sep 2024', dpdDays: '030', statusText: '30 Days Past Due' },
            { monthYear: 'Aug 2024', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: 'Serious non-payment default, 90+ DPD overdue balance',
        },
        {
          bankName: 'HDFC BANK LTD',
          accountNumber: '502938491028',
          loanType: 'Two-Wheeler Loan',
          highestCreditOrLoanAmount: '₹85,000',
          currentBalance: '₹32,400',
          amountOverdue: '₹4,200',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '18/05/2023',
          dateClosed: 'Active / N/A',
          emi: '₹4,200',
          status: 'Active',
          isActive: true,
          isClosed: false,
          hasDpd: true,
          maxDpd: '30 Days',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: true,
          dpdSummary: '30 DPD recorded with 1 overdue installment',
          paymentHistory: [
            { monthYear: 'Dec 2024', dpdDays: '030', statusText: '30 Days Late' },
            { monthYear: 'Nov 2024', dpdDays: '030', statusText: '30 Days Late' },
            { monthYear: 'Oct 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Sep 2024', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: '30 DPD with 1 EMI overdue',
        },
        {
          bankName: 'KOTAK MAHINDRA BANK',
          accountNumber: '412938491029XXXX',
          loanType: 'Credit Card',
          highestCreditOrLoanAmount: '₹1,50,000',
          currentBalance: '₹1,82,000',
          amountOverdue: '₹1,82,000',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '11/09/2018',
          dateClosed: '20/04/2024',
          emi: 'N/A',
          status: 'Written Off / Suit Filed',
          isActive: false,
          isClosed: true,
          hasDpd: true,
          maxDpd: '180 Days',
          isSuitFiled: true,
          isWrittenOff: true,
          isSettled: false,
          meetsCondition: true,
          dpdSummary: 'Written Off & Suit Filed status with 180 DPD',
          paymentHistory: [
            { monthYear: 'Mar 2024', dpdDays: '180', statusText: '180 Days (Loss/Write-off)' },
            { monthYear: 'Feb 2024', dpdDays: '150', statusText: '150 Days' },
            { monthYear: 'Jan 2024', dpdDays: '120', statusText: '120 Days' },
            { monthYear: 'Dec 2023', dpdDays: '090', statusText: '90 Days' },
          ],
          remarks: 'Suit Filed, Total amount written off Rs. 1,82,000. Severe Derogatory.',
        },
        {
          bankName: 'TATA CAPITAL FINANCIAL SERVICES',
          accountNumber: 'TC7492019284',
          loanType: 'Personal Loan',
          highestCreditOrLoanAmount: '₹3,00,000',
          currentBalance: '₹0',
          amountOverdue: '₹0',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '08/07/2020',
          dateClosed: '14/11/2023',
          emi: '₹9,800',
          status: 'Closed / Settled',
          isActive: false,
          isClosed: true,
          hasDpd: true,
          maxDpd: '90 Days',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: true,
          meetsCondition: true,
          dpdSummary: '90 DPD delay in Sep 2023, closed under one-time settlement with waiver',
          paymentHistory: [
            { monthYear: 'Oct 2023', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Sep 2023', dpdDays: '090', statusText: '90 Days Past Due' },
            { monthYear: 'Aug 2023', dpdDays: '060', statusText: '60 Days' },
            { monthYear: 'Jul 2023', dpdDays: '030', statusText: '30 Days' },
          ],
          remarks: 'Settled with post-writeoff waiver of Rs. 84,000.',
        },
        {
          bankName: 'STATE BANK OF INDIA',
          accountNumber: '30294819203',
          loanType: 'Education Loan',
          highestCreditOrLoanAmount: '₹4,00,000',
          currentBalance: '₹0',
          amountOverdue: '₹0',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '15/06/2014',
          dateClosed: '20/05/2021',
          emi: '₹6,200',
          status: 'Closed',
          isActive: false,
          isClosed: true,
          hasDpd: false,
          maxDpd: '000 (Clean)',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: false,
          dpdSummary: 'Closed cleanly in 2021 with zero DPD (omitted under conditioned filter)',
          paymentHistory: [
            { monthYear: 'Apr 2021', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Mar 2021', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Feb 2021', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: 'Closed fully without default.',
        },
      ],
    },
  },
  {
    id: 'sample-3',
    title: 'Sample 3: Ananya Verma (Score 788 - Excellent)',
    holderName: 'ANANYA VERMA',
    score: 788,
    description: 'Active Home Loan and Axis Personal Loan with pristine track record; clean closed Vehicle Loan.',
    rawText: `TRANSUNION CIBIL CREDIT INFORMATION REPORT (CIR)
REPORT ORDER NO: TU-CIR-2025-9920194
REPORT DATE: 25/02/2025
NAME: ANANYA VERMA
DATE OF BIRTH: 22/09/1990   GENDER: FEMALE   PAN: CLKPV8192N
CIBIL TRANSUNION SCORE: 788

ACCOUNT INFORMATION DETAILS:

1. MEMBER NAME: BANK OF BARODA
   ACCOUNT NUMBER: 048201948291
   ACCOUNT TYPE: Housing Loan
   OWNERSHIP: Joint
   DATE OPENED / DISBURSED: 10/08/2020
   DATE CLOSED: N/A
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 60,00,000
   CURRENT BALANCE: Rs. 51,40,000
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: Rs. 52,000
   STATUS: Active / Open
   PAYMENT HISTORY (DPD):
   Jan 2025: 000 | Dec 2024: 000 | Nov 2024: 000 | Oct 2024: 000 | Sep 2024: 000
   REMARKS: Flawless joint home loan repayment

2. MEMBER NAME: AXIS BANK LTD
   ACCOUNT NUMBER: 918204918234
   ACCOUNT TYPE: Personal Loan
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 12/01/2023
   DATE CLOSED: N/A
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 3,50,000
   CURRENT BALANCE: Rs. 1,12,000
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: Rs. 11,200
   STATUS: Active / Open
   PAYMENT HISTORY (DPD):
   Jan 2025: 000 | Dec 2024: 000 | Nov 2024: 000 | Oct 2024: 000
   REMARKS: All EMIs debited via auto-debit promptly

3. MEMBER NAME: HDFC BANK LTD
   ACCOUNT NUMBER: 501002938491
   ACCOUNT TYPE: Auto Loan
   OWNERSHIP: Individual
   DATE OPENED / DISBURSED: 04/03/2019
   DATE CLOSED: 10/03/2024
   HIGH CREDIT / SANCTIONED AMOUNT: Rs. 7,00,000
   CURRENT BALANCE: Rs. 0
   AMOUNT OVERDUE: Rs. 0
   EMI AMOUNT: Rs. 15,200
   STATUS: Closed
   PAYMENT HISTORY (DPD):
   Feb 2024: 000 | Jan 2024: 000 | Dec 2023: 000
   REMARKS: Closed with NOC issued, zero DPD.`,
    parsedData: {
      reportHolderName: 'ANANYA VERMA',
      cibilScore: '788',
      scoreCategory: 'Excellent',
      dateOfObtainingReport: '25/02/2025',
      controlNumber: 'TU-CIR-2025-9920194',
      panNumber: 'CLKPV8192N',
      dateOfBirth: '22/09/1990',
      summary: {
        totalAccounts: 3,
        activeAccounts: 2,
        closedAccounts: 1,
        totalSanctionedAmount: 6350000,
        totalCurrentBalance: 5252000,
        totalAmountOverdue: 0,
        totalMonthlyEmi: 63200,
        derogatoryAccountsCount: 0,
        overallCreditHealthSummary:
          'Prime Tier Profile: Score 788 with 100% on-time repayment history across all active and closed facilities. Zero adverse remarks or overdue balances.',
      },
      accounts: [
        {
          bankName: 'BANK OF BARODA',
          accountNumber: '048201948291',
          loanType: 'Housing Loan',
          highestCreditOrLoanAmount: '₹60,00,000',
          currentBalance: '₹51,40,000',
          amountOverdue: '₹0',
          ownership: 'Joint',
          dateOpenedOrDisbursed: '10/08/2020',
          dateClosed: 'Active / N/A',
          emi: '₹52,000',
          status: 'Active',
          isActive: true,
          isClosed: false,
          hasDpd: false,
          maxDpd: '000 (Clean)',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: true,
          dpdSummary: 'Pristine payment track record with 000 DPD',
          paymentHistory: [
            { monthYear: 'Jan 2025', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Dec 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Nov 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Oct 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Sep 2024', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: 'Flawless joint home loan repayment',
        },
        {
          bankName: 'AXIS BANK LTD',
          accountNumber: '918204918234',
          loanType: 'Personal Loan',
          highestCreditOrLoanAmount: '₹3,50,000',
          currentBalance: '₹1,12,000',
          amountOverdue: '₹0',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '12/01/2023',
          dateClosed: 'Active / N/A',
          emi: '₹11,200',
          status: 'Active',
          isActive: true,
          isClosed: false,
          hasDpd: false,
          maxDpd: '000 (Clean)',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: true,
          dpdSummary: 'Zero delinquency, prompt repayment',
          paymentHistory: [
            { monthYear: 'Jan 2025', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Dec 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Nov 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Oct 2024', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: 'All EMIs debited via auto-debit promptly',
        },
        {
          bankName: 'HDFC BANK LTD',
          accountNumber: '501002938491',
          loanType: 'Auto Loan',
          highestCreditOrLoanAmount: '₹7,00,000',
          currentBalance: '₹0',
          amountOverdue: '₹0',
          ownership: 'Individual',
          dateOpenedOrDisbursed: '04/03/2019',
          dateClosed: '10/03/2024',
          emi: '₹15,200',
          status: 'Closed',
          isActive: false,
          isClosed: true,
          hasDpd: false,
          maxDpd: '000 (Clean)',
          isSuitFiled: false,
          isWrittenOff: false,
          isSettled: false,
          meetsCondition: false,
          dpdSummary: 'Clean closed loan with zero DPD (omitted under conditioned filter)',
          paymentHistory: [
            { monthYear: 'Feb 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Jan 2024', dpdDays: '000', statusText: 'On Time' },
            { monthYear: 'Dec 2023', dpdDays: '000', statusText: 'On Time' },
          ],
          remarks: 'Closed with NOC issued, zero DPD.',
        },
      ],
    },
  },
];
