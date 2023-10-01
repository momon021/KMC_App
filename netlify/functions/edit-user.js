const { google } = require('googleapis');

exports.handler = async (event, context) => {
  try {
    const keyFile = require('../../src/json/kmc-work-mangement-38261d8b5b5b.json'); // Replace with your key file path
    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const userId = event.path.split('/').pop(); // Get USER_ID from request URL
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const sheetName = 'USER';
    const range = `${sheetName}!A1:G1000`;

    // Assuming you have a request body containing updated user data, including LAST_UPDATE_DATE
    const updatedUserData = JSON.parse(event.body);
    updatedUserData.LAST_UPDATE_DATE = new Date().toISOString();

    // Load user data from Google Sheets to ensure 'values' is defined
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const values = response.data.values;

    // Find the user in your data (values array) by USER_ID and update it
    const userIndex = values.findIndex((row) => row[0] === userId);

    if (userIndex !== -1) {
      values[userIndex] = [
        userId,
        updatedUserData.USERNAME,
        updatedUserData.PASSWORD,
        updatedUserData.NAME,
        updatedUserData.ROLE,
        updatedUserData.REGISTRATION_DATE,
        updatedUserData.LAST_UPDATE_DATE,
        updatedUserData.ACCOUNT_STATUS, 
      ];
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    // Update the data in Google Sheets using sheetsAPI.spreadsheets.values.update
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: `${sheetName}!A${userIndex + 1}:H${userIndex + 1}`,
      valueInputOption: 'RAW',
      resource: { values: [values[userIndex]] },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: 'User updated successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update user data in Google Sheets' }),
    };
  }
};
