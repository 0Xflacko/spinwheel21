import { google } from "googleapis";

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEET_NAME = "WTF Games Email Submissions"; // Custom sheet name

// Function to properly format the private key
function formatPrivateKey(): string | undefined {
  try {
    // First, try to use Base64 encoded private key (recommended for serverless)
    const base64PrivateKey = process.env.GOOGLE_PRIVATE_KEY_BASE64;
    if (base64PrivateKey) {
      console.log("Using Base64 encoded private key");
      try {
        const decodedKey = Buffer.from(base64PrivateKey, "base64").toString(
          "utf8"
        );
        console.log("Base64 private key decoded successfully");
        console.log("Decoded key length:", decodedKey.length);
        console.log("Key starts with:", decodedKey.substring(0, 27));
        console.log(
          "Key ends with:",
          decodedKey.substring(decodedKey.length - 25)
        );
        return decodedKey;
      } catch (error) {
        console.error("Error decoding Base64 private key:", error);
        // Fall back to regular private key
      }
    }

    // Fallback: try regular private key
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!privateKey) {
      console.error(
        "Neither GOOGLE_PRIVATE_KEY_BASE64 nor GOOGLE_PRIVATE_KEY is set"
      );
      return undefined;
    }

    console.log("Using regular private key (fallback)");

    // Remove any existing formatting and clean the key
    let cleanKey = privateKey
      .replace(/\\n/g, "\n") // Replace literal \n with actual newlines
      .replace(/"/g, "") // Remove any quotes
      .trim();

    // Ensure the key has proper BEGIN/END markers
    if (!cleanKey.includes("-----BEGIN PRIVATE KEY-----")) {
      console.error("Private key missing BEGIN marker");
      return undefined;
    }

    if (!cleanKey.includes("-----END PRIVATE KEY-----")) {
      console.error("Private key missing END marker");
      return undefined;
    }

    // Split into lines and clean each line
    const lines = cleanKey.split("\n");
    const cleanLines = lines
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Rejoin with proper newlines
    const formattedKey = cleanLines.join("\n");

    console.log("Regular private key formatted successfully");
    console.log("Key length:", formattedKey.length);
    console.log("First line:", cleanLines[0]);
    console.log("Last line:", cleanLines[cleanLines.length - 1]);

    return formattedKey;
  } catch (error) {
    console.error("Error formatting private key:", error);
    return undefined;
  }
}

// Initialize Google Sheets API with better error handling
let auth: any;
let sheets: any;

try {
  const formattedPrivateKey = formatPrivateKey();

  if (!formattedPrivateKey) {
    throw new Error("Failed to format private key");
  }

  auth = new google.auth.GoogleAuth({
    credentials: {
      type: "service_account",
      project_id: process.env.GOOGLE_PROJECT_ID,
      private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
      private_key: formattedPrivateKey,
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      client_id: process.env.GOOGLE_CLIENT_ID,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  sheets = google.sheets({ version: "v4", auth });
  console.log("Google Sheets API initialized successfully");
} catch (error) {
  console.error("Failed to initialize Google Sheets API:", error);
}

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

    if (!sheets) {
      console.error("Google Sheets API not initialized");
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
    if (!sheets) {
      console.error("Google Sheets API not initialized");
      return false;
    }

    // Get spreadsheet info to check if sheet exists
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
    });

    const sheetExists = spreadsheet.data.sheets?.some(
      (sheet: any) => sheet.properties?.title === SHEET_NAME
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

    if (!sheets) {
      console.error("Google Sheets API not initialized");
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
