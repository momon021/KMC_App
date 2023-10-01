const { google } = require('googleapis');

exports.handler = async (event, context) => {
  try {
    const keyFile = require('../../src/json/kmc-work-mangement-38261d8b5b5b.json'); // Replace with your key file path
    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const range = 'USER!A:Z'; // Adjust the range to cover your data (including Registration Date and Last Update Date)

    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values;

    // Assuming your data structure contains USER_ID, USERNAME, PASSWORD, NAME, ROLE, REGISTRATION_DATE, LAST_UPDATE_DATE, and ACCOUNT_STATUS
    // Adjust this based on your actual Google Sheets structure
    const users = values.map((row) => ({
      USER_ID: row[0],
      USERNAME: row[1],
      PASSWORD: row[2], // Note: Passwords should be securely hashed, not stored in plain text
      NAME: row[3],
      ROLE: row[4],
      REGISTRATION_DATE: row[5],
      LAST_UPDATE_DATE: row[6],
      ACCOUNT_STATUS: row[7], // Add the Account Status to the response
    }));

    return {
      statusCode: 200,
      body: JSON.stringify(users),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to retrieve user data from Google Sheets' }),
    };
  }
};
