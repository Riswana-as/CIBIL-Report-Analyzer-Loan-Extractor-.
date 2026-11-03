import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Helper to initialize GoogleGenAI
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment secrets.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      timeout: 35000,
    },
  });
}

const cibilExtractionSchema = {
  type: Type.OBJECT,
  properties: {
    reportHolderName: {
      type: Type.STRING,
      description: 'Full Name of the CIBIL report holder / consumer (e.g., RAHUL SHARMA)',
    },
    cibilScore: {
      type: Type.STRING,
      description: 'CIBIL TransUnion Score (numeric 300-900, or "NA" / "-1" / "0" if no score)',
    },
    scoreCategory: {
      type: Type.STRING,
      description: 'Rating category: Excellent (750-900), Good (700-749), Fair (650-699), Poor (300-649), or No History',
    },
    dateOfObtainingReport: {
      type: Type.STRING,
      description: 'Date of obtaining or generation of the CIBIL report (e.g., "12/03/2024" or "12-Mar-2024")',
    },
    controlNumber: {
      type: Type.STRING,
      description: 'CIBIL Control Number or Report Order Number if available',
    },
    panNumber: {
      type: Type.STRING,
      description: 'PAN number of report holder if found (e.g. ABCDE1234F or masked)',
    },
    dateOfBirth: {
      type: Type.STRING,
      description: 'Date of birth of the report holder if found',
    },
    summary: {
      type: Type.OBJECT,
      properties: {
        totalAccounts: { type: Type.INTEGER, description: 'Total number of credit/loan accounts found in report' },
        activeAccounts: { type: Type.INTEGER, description: 'Total number of active/open loan accounts' },
        closedAccounts: { type: Type.INTEGER, description: 'Total number of closed loan accounts' },
        totalSanctionedAmount: { type: Type.NUMBER, description: 'Sum of sanctioned/high credit amounts across active loans' },
        totalCurrentBalance: { type: Type.NUMBER, description: 'Sum of current balance across active loans' },
        totalAmountOverdue: { type: Type.NUMBER, description: 'Sum of overdue amounts across all loans' },
        totalMonthlyEmi: { type: Type.NUMBER, description: 'Estimated total monthly EMI obligations across active loans' },
        derogatoryAccountsCount: { type: Type.INTEGER, description: 'Total accounts with DPD > 0, Suit Filed, Written-off, or Settled' },
        overallCreditHealthSummary: { type: Type.STRING, description: '1-3 sentence summary of credit standing, defaults, and risk assessment' },
      },
      required: ['totalAccounts', 'activeAccounts', 'closedAccounts', 'totalCurrentBalance', 'totalAmountOverdue'],
    },
    accounts: {
      type: Type.ARRAY,
      description: 'List of all loan/credit accounts extracted from the CIBIL report',
      items: {
        type: Type.OBJECT,
        properties: {
          bankName: {
            type: Type.STRING,
            description: 'Bank or Member Name (e.g. HDFC BANK, STATE BANK OF INDIA, BAJAJ FINANCE)',
          },
          accountNumber: {
            type: Type.STRING,
            description: 'Bank Account Number or Masked Account Number (e.g. XXXX1234 or full account number)',
          },
          loanType: {
            type: Type.STRING,
            description: 'Type Of Loan (e.g., Home Loan, Personal Loan, Auto Loan, Credit Card, Consumer Loan, Business Loan, Two Wheeler Loan, Gold Loan, Overdraft)',
          },
          highestCreditOrLoanAmount: {
            type: Type.STRING,
            description: 'Highest Credit or Sanctioned Loan Amount (e.g. ₹5,00,000 or 500000)',
          },
          currentBalance: {
            type: Type.STRING,
            description: 'Current Balance outstanding (e.g. ₹2,34,500 or 0)',
          },
          amountOverdue: {
            type: Type.STRING,
            description: 'Amount Overdue (e.g. ₹0 or ₹14,200)',
          },
          ownership: {
            type: Type.STRING,
            description: 'Ownership type (e.g., Individual, Joint, Guarantor, Authorized User)',
          },
          dateOpenedOrDisbursed: {
            type: Type.STRING,
            description: 'Date Opened / Disbursed (e.g. 15/06/2021)',
          },
          dateClosed: {
            type: Type.STRING,
            description: 'Date Closed if closed (e.g. 10/11/2023), or "Active" / "N/A" if open',
          },
          emi: {
            type: Type.STRING,
            description: 'Monthly EMI amount if available (e.g. ₹12,450), or "N/A"',
          },
          status: {
            type: Type.STRING,
            description: 'Status of loan (e.g., Active, Closed, Settled, Written Off, Suit Filed, Restructured, Wilful Default)',
          },
          isActive: {
            type: Type.BOOLEAN,
            description: 'True if loan is currently open / active / ongoing',
          },
          isClosed: {
            type: Type.BOOLEAN,
            description: 'True if loan has been closed or terminated',
          },
          hasDpd: {
            type: Type.BOOLEAN,
            description: 'True if there are any Days Past Due (DPD > 0 / non-zero / non-STD) in payment history',
          },
          maxDpd: {
            type: Type.STRING,
            description: 'Maximum DPD recorded or summary (e.g., "000 (Clean)", "30 Days", "60 Days", "90+ Days")',
          },
          isSuitFiled: {
            type: Type.BOOLEAN,
            description: 'True if Suit Filed (Wilful Default / Legal action)',
          },
          isWrittenOff: {
            type: Type.BOOLEAN,
            description: 'True if loan has been Written-Off (Loss / Doubtful)',
          },
          isSettled: {
            type: Type.BOOLEAN,
            description: 'True if loan was settled (one-time settlement / haircut / compromise)',
          },
          meetsCondition: {
            type: Type.BOOLEAN,
            description: 'CRITICAL: Must be TRUE if the account is ACTIVE, OR if the account is CLOSED and has any DPD > 0, suit filed, written-off status, or settlement. Otherwise FALSE (for clean closed accounts).',
          },
          dpdSummary: {
            type: Type.STRING,
            description: 'Brief summary of DPD occurrences and payment delays',
          },
          paymentHistory: {
            type: Type.ARRAY,
            description: 'Month, year and days history entries extracted from payment string/table',
            items: {
              type: Type.OBJECT,
              properties: {
                monthYear: { type: Type.STRING, description: 'Month and Year e.g. "Jan 2024" or "10/23"' },
                dpdDays: { type: Type.STRING, description: 'DPD days reported e.g. "000", "030", "060", "090", "XXX", "SUB"' },
                statusText: { type: Type.STRING, description: 'Explanation e.g. "On Time", "30 Days Past Due", "Sub-standard"' },
              },
              required: ['monthYear', 'dpdDays'],
            },
          },
          remarks: {
            type: Type.STRING,
            description: 'Any special remarks or annotations found in the report',
          },
        },
        required: [
          'bankName',
          'accountNumber',
          'loanType',
          'highestCreditOrLoanAmount',
          'currentBalance',
          'amountOverdue',
          'ownership',
          'dateOpenedOrDisbursed',
          'status',
          'isActive',
          'meetsCondition',
        ],
      },
    },
  },
  required: ['reportHolderName', 'cibilScore', 'dateOfObtainingReport', 'accounts', 'summary'],
};

// API Route: Extract CIBIL Data
app.post('/api/extract-cibil', async (req: Request, res: Response) => {
  try {
    const { fileBase64, mimeType, textContent } = req.body;

    if (!fileBase64 && !textContent) {
      return res.status(400).json({
        error: 'Please upload a CIBIL report file (PDF/Image) or provide report text.',
      });
    }

    const ai = getGenAI();

    const systemInstruction = `You are an expert Indian Banking Credit Officer and CIBIL (Credit Information Bureau India Limited) Credit Report Analyst.
Your task is to accurately extract all credit information from the provided CIBIL credit report document or text according to exact banking underwriting requirements.

CRITICAL DATE EXTRACTION REQUIREMENTS (EXTREME ACCURACY):
1. "Date Of Obtaining Cibil Report":
   - MUST be the EXACT date the report was fetched, obtained, generated, or processed as printed on the CIBIL CIR (Credit Information Report).
   - Look specifically for "DATE OF REPORT", "REPORT DATE", "DATE:", "DATE OF ISSUE", "DATE PROCESSED", "GENERATION DATE", or the timestamp in the CIR header/footer (e.g. "16-09-2025", "16/09/2025", or "16-Sep-2025").
   - NEVER use the current date or today's date unless that exact date is literally printed on the CIBIL report itself.
   - Extract the date accurately in DD-MM-YYYY or DD/MM/YYYY format as found in the report.

2. "Date Opened / Disbursed":
   - For every account, accurately extract the loan open / disbursement date (e.g., "12-05-2022" or "12/05/2022").
   - Never output "########" or corrupted dates.

3. "Date Closed":
   - If the account has been closed, extract the exact closure date (e.g., "15-10-2023").
   - If the account is open or active, return "Active / N/A".

HEADER FIELDS (TO BE PRESENTED ONE BY ONE):
1. CIBIL REPORT HOLDER NAME: (Full legal name as printed on CIBIL report)
2. SCORE: (CIBIL Score, e.g. 748, 650, or "NA" / "-1")
3. DATE OF OBTAINING CIBIL REPORT: (Exact report generation/issue date from document)
4. TOTAL ACTIVE ACCOUNTS: (Exact count of currently open/active accounts)
5. TOTAL CURRENT BALANCE: (Sum of current balance across active facilities)
6. TOTAL OVERDUE: (Sum of overdue amount across all facilities)

ACCOUNT-WISE SCHEDULE (FOR EACH LOAN):
1. Bank Name (e.g., KARUR VYSYA, AXIO, HDFC BANK, SBI, ICICI BANK)
2. Bank Account No (full or masked as printed in CIR)
3. Type Of Loan (e.g., Consumer Loan, Housing Loan, Personal Loan, Credit Card, Auto Loan)
4. Highest Credit / Loan Amount (High credit or sanctioned limit)
5. Current Balance (Outstanding balance)
6. Amount Overdue (Amount overdue, 0 if nil)
7. Ownership (Individual, Joint, Guarantor, etc.)
8. Date Opened / Disbursed (Accurate date string)
9. Date Closed (Accurate date or Active / N/A)
10. EMI (Installment amount or N/A)
11. Status (Active, Closed, Settled, Written Off, Suit Filed)
12. DPD (Days Past Due e.g. 000, 030, 060, 090+)
13. Month, year and days (Payment history track)

CONDITION FOR REPORT COMPILATION:
For each account, evaluate 'meetsCondition':
- If the loan is ACTIVE / OPEN: set 'meetsCondition' = true.
- If the loan is CLOSED: set 'meetsCondition' = true IF AND ONLY IF there are any instances of:
  * DPD > 0 (Days Past Due, e.g. 30, 60, 90, 120, etc.)
  * Suit filed
  * Written-off status (total or principal write-off)
  * Settlement / Compromise
- If the loan is CLOSED with completely clean payment history (000 DPD throughout and no derogatory remarks): set 'meetsCondition' = false.

Calculate total summary numbers accurately based on all active loans and total overdues across all accounts.`;

    const contents: any[] = [];

    if (fileBase64 && mimeType) {
      contents.push({
        inlineData: {
          mimeType: mimeType,
          data: fileBase64,
        },
      });
    }

    if (textContent) {
      contents.push({
        text: `Here is the CIBIL report text:\n\n${textContent}`,
      });
    } else {
      contents.push({
        text: 'Please extract all the CIBIL report details as instructed and format in the exact JSON schema provided.',
      });
    }

    // Robust multi-model fallback with fast-first routing
    // gemini-3.1-flash-lite provides sub-second structured JSON responses with high reliability
    // Falls back to gemini-3.8-flash and gemini-flash-latest if needed
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];
    let lastError: any = null;
    let parsedData: any = null;

    for (const modelName of modelsToTry) {
      const maxAttempts = 2;
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
          console.log(`[CIBIL Extractor] Calling ${modelName} (attempt ${attempt}/${maxAttempts})...`);
          
          const modelConfig: any = {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: cibilExtractionSchema,
          };

          if (modelName === 'gemini-3.8-flash') {
            modelConfig.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
          }

          const response = await ai.models.generateContent({
            model: modelName,
            contents: contents,
            config: modelConfig,
          });

          const outputText = response.text;
          if (!outputText) {
            throw new Error('Gemini model did not return any extracted data.');
          }

          parsedData = JSON.parse(outputText);
          console.log(`[CIBIL Extractor] Successfully extracted data with ${modelName}`);
          break; // success, break attempt loop
        } catch (err: any) {
          lastError = err;
          const errMsg = String(err.message || '');
          const isRetryable =
            errMsg.includes('503') ||
            errMsg.includes('504') ||
            errMsg.includes('DEADLINE_EXCEEDED') ||
            errMsg.includes('high demand') ||
            errMsg.includes('UNAVAILABLE') ||
            errMsg.includes('429') ||
            errMsg.includes('RESOURCE_EXHAUSTED');

          console.warn(`[CIBIL Extractor] ${modelName} attempt ${attempt} failed: ${errMsg}`);

          // If model is not found (404), do not retry this model - immediately fallback to next model
          if (errMsg.includes('404') || errMsg.includes('NOT_FOUND') || !isRetryable) {
            break;
          }

          if (isRetryable && attempt < maxAttempts) {
            const delayMs = attempt * 800;
            console.log(`[CIBIL Extractor] Retrying ${modelName} in ${delayMs}ms...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));
            continue;
          }

          break; // break out to try next fallback model
        }
      }

      if (parsedData) {
        break; // successfully extracted
      }
    }

    if (!parsedData) {
      throw lastError || new Error('Failed to extract CIBIL report after retry attempts.');
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(200).json({ success: true, data: parsedData });
  } catch (error: any) {
    console.error('Error extracting CIBIL report:', error);
    let userFriendlyMsg = String(error.message || 'Failed to extract CIBIL report data.');

    // Strip raw JSON wrapping if present in error message
    try {
      const jsonMatch = userFriendlyMsg.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedJson = JSON.parse(jsonMatch[0]);
        if (parsedJson?.error?.message) {
          userFriendlyMsg = parsedJson.error.message;
        } else if (parsedJson?.message) {
          userFriendlyMsg = parsedJson.message;
        }
      }
    } catch (_) {}

    const isHighDemand =
      userFriendlyMsg.includes('503') ||
      userFriendlyMsg.includes('504') ||
      userFriendlyMsg.includes('DEADLINE_EXCEEDED') ||
      userFriendlyMsg.includes('high demand') ||
      userFriendlyMsg.includes('UNAVAILABLE') ||
      userFriendlyMsg.includes('overloaded');

    if (isHighDemand) {
      userFriendlyMsg =
        'The AI service is temporarily experiencing high traffic. Please click "Try Again" to re-process your CIBIL report, or load sample data.';
    }

    res.setHeader('Content-Type', 'application/json');
    return res.status(503).json({
      error: userFriendlyMsg,
      isRetryable: true,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Setup Vite middleware in dev or static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CIBIL Report Analyzer server running on port ${PORT}`);
  });
}

startServer();
