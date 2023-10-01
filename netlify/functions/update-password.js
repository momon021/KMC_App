const { google } = require('googleapis');
const bcrypt = require('bcryptjs');

exports.handler = async (event, context) => {
  try {
    // Parse the JSON request body to get the new password
    let newPassword;
    try {
      const requestBody = JSON.parse(event.body);
      newPassword = requestBody.password;
    } catch (error) {
      console.error('Error parsing JSON body:', error);
      return {
        statusCode: 400, // Bad Request
        body: JSON.stringify({ error: 'Invalid JSON input' }),
      };
    }

    const keyFile = require('../../src/json/kmc-work-mangement-38261d8b5b5b.json'); // Replace with your key file path
    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheetsAPI = google.sheets({ version: 'v4', auth });

    // Extract the userId from query parameters
    const userId = event.queryStringParameters.userId; // Get USER_ID from query parameters

    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const sheetName = 'USER';
    const range = `${sheetName}!A1:G1000`;

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Load user data from Google Sheets to ensure 'values' is defined
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const values = response.data.values;
console.log('values: ',values)
    // Find the user in your data (values array) by USER_ID and update the password
    const userIndex = values.findIndex((row) => row[0] === userId);

    console.log('userIndex: ',userIndex)
    console.log('userId: ',userId)
    if (userIndex !== -1) {
      // Update the user's password with the hashed password
      values[userIndex][2] = hashedPassword;

      // Update the data in Google Sheets using sheetsAPI.spreadsheets.values.update
      await sheetsAPI.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!C${userIndex + 1}`,
        valueInputOption: 'RAW',
        resource: { values: [[hashedPassword]] }, // Store the hashed password
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ success: 'Password updated successfully' }),
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to update user password in Google Sheets' }),
    };
  }
};
