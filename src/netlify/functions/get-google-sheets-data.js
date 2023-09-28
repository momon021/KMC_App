// netlify/functions/get-google-sheets-data.js
const { google } = require('googleapis');

// Function to retrieve data from Google Sheets
exports.handler = async (event, context) => {
  try {
    const keyFile = require('../../json/kmc-work-mangement-38261d8b5b5b.json'); // Replace with your key file path
    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const range = 'Client!A1:W12';

    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values;
    return {
      statusCode: 200,
      body: JSON.stringify(values),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve data from Google Sheets' }),
    };
  }
};
