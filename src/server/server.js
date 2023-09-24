const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const cors = require('cors'); // Import the cors middleware

// Load environment variables from a .env file
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());

// Create a new Google Sheets client
const sheets = google.sheets('v4');

// Configure Google Sheets API with service account credentials
const auth = new google.auth.GoogleAuth({
  keyFile: 'C:/Users/Raymond/Desktop/Node/work-management-app/src/json/kmc-work-mangement-38261d8b5b5b.json', // Replace with the actual path to your JSON key file
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.get('/get-google-sheets-data', async (req, res) => {
  try {
    // Create the sheets API client using the authenticated auth object
    const sheetsAPI = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4'; // Replace with your Google Sheets document ID
    const range = 'Sheet1!A1:G10'; // Replace with the desired sheet and range

    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values;
    res.json(values);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to retrieve data from Google Sheets' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
