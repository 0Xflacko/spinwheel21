import { google } from "googleapis";

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEET_NAME = "WTF Games Email Submissions"; // Custom sheet name

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: "service_account",
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export interface EmailSubmission {
  email: string;
  prizeAmount: number;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Save email submission to Google Sheets
 */
export async function saveEmailToSheet(
  submission: EmailSubmission
): Promise<boolean> {
  try {
    if (!SPREADSHEET_ID) {
      console.error("Google Sheets ID not configured");
      return false;
    }

    // Prepare the row data
    const values = [
      [
        submission.timestamp,
        submission.email,
        `$${submission.prizeAmount}`,
        submission.ipAddress || "Unknown",
        submission.userAgent || "Unknown",
      ],
    ];

    // Append the data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:E`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      requestBody: {
        values,
      },
    });

    console.log("Email successfully saved to Google Sheets");
    return true;
  } catch (error) {
    console.error("Error saving email to Google Sheets:", error);
    return false;
  }
}

/**
 * Create the sheet tab if it doesn't exist
 */
async function createSheetIfNotExists(): Promise<boolean> {
  try {
    // Get spreadsheet info to check if sheet exists
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetExists = spreadsheet.data.sheets?.some(
      (sheet) => sheet.properties?.title === SHEET_NAME
    );

    if (!sheetExists) {
      console.log(`Creating sheet: ${SHEET_NAME}`);
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: SHEET_NAME,
                },
              },
            },
          ],
        },
      });
      console.log(`Sheet "${SHEET_NAME}" created successfully`);
    } else {
      console.log(`Sheet "${SHEET_NAME}" already exists`);
    }

    return true;
  } catch (error) {
    console.error("Error creating sheet:", error);
    return false;
  }
}

/**
 * Initialize the Google Sheet with headers (run once)
 */
export async function initializeSheet(): Promise<boolean> {
  try {
    if (!SPREADSHEET_ID) {
      console.error("Google Sheets ID not configured");
      return false;
    }

    // First, ensure the sheet tab exists
    const sheetCreated = await createSheetIfNotExists();
    if (!sheetCreated) {
      return false;
    }

    // Try to check if headers already exist
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:E1`,
      });

      // If headers exist and are not empty, we're good
      if (response.data.values && response.data.values.length > 0) {
        console.log("Headers already exist in the sheet");
        return true;
      }
    } catch {
      console.log(
        "Sheet may be empty or range doesn't exist, will add headers"
      );
    }

    // Add headers if they don't exist or sheet is empty
    const headers = [
      ["Timestamp", "Email", "Prize Amount", "IP Address", "User Agent"],
    ];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:E1`,
      valueInputOption: "RAW",
      requestBody: {
        values: headers,
      },
    });

    console.log("Google Sheet initialized with headers");
    return true;
  } catch (error) {
    console.error("Error initializing Google Sheet:", error);
    return false;
  }
}
