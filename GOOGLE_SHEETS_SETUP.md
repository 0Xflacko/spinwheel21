# Google Sheets Integration Setup

## Prerequisites

1. Install the Google APIs package:

```bash
npm install googleapis
```

## Google Cloud Console Setup

### Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### Step 2: Enable Google Sheets API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

### Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

### Step 4: Generate Service Account Key

1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create New Key"
4. Choose "JSON" format
5. Download the JSON file - this contains all your credentials

### Step 5: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "WTF Games Email Submissions"
4. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 6: Share Sheet with Service Account

1. In your Google Sheet, click "Share"
2. Add the service account email (from the JSON file, `client_email` field)
3. Give it "Editor" permissions
4. Click "Send"

## Environment Variables Setup

Add these variables to your `.env.local` file:

```env
# Google Sheets Configuration
GOOGLE_SHEETS_ID=your_sheet_id_from_url
GOOGLE_PROJECT_ID=project_id_from_json
GOOGLE_PRIVATE_KEY_ID=private_key_id_from_json
GOOGLE_PRIVATE_KEY="private_key_from_json_with_newlines"
GOOGLE_CLIENT_EMAIL=client_email_from_json
GOOGLE_CLIENT_ID=client_id_from_json
```

**Important Notes:**

- The `GOOGLE_PRIVATE_KEY` should include the full key with `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Make sure to wrap it in quotes and preserve the `\n` characters
- The `GOOGLE_SHEETS_ID` is the long string in your sheet URL between `/d/` and `/edit`

## Sheet Structure

The integration will automatically create a sheet named "Email Submissions" with these columns:

- **Timestamp**: When the email was submitted
- **Email**: User's email address
- **Prize Amount**: The prize they won (e.g., $100)
- **IP Address**: User's IP address
- **User Agent**: Browser information

## Testing

1. Complete the setup above
2. Restart your development server
3. Test the wheel and submit an email
4. Check your Google Sheet - new submissions should appear automatically

## Troubleshooting

- **403 Error**: Make sure you shared the sheet with the service account email
- **404 Error**: Check that the Google Sheets ID is correct
- **Authentication Error**: Verify all environment variables are set correctly
- **API Not Enabled**: Ensure Google Sheets API is enabled in Google Cloud Console
