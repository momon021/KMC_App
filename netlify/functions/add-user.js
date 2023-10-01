const { google } = require('googleapis');
const bcrypt = require('bcryptjs'); // Import the bcrypt library

exports.handler = async (event, context) => {
  try {
    const keyFile = require('../../src/json/kmc-work-mangement-38261d8b5b5b.json'); // Replace with your key file path
    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';

    // Get existing data
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: 'USER!A1:H1000',
    });

    const values = response.data.values;

    // Find the last USER_ID and generate the next one
    let lastUserId = 0;
    if (values.length > 1) {
      for (let i = 1; i < values.length; i++) {
        const userId = parseInt(values[i][0], 10);
        if (!isNaN(userId) && userId > lastUserId) {
          lastUserId = userId;
        }
      }
    }

    // Generate the new USER_ID
    const newUserId = lastUserId + 1;
    const currentDate = new Date().toISOString();

    // Assuming you have a request body containing new user data
    const newUser = JSON.parse(event.body);

    // Generate a default password for the new user
    const defaultPassword = 'NewUser01'; // You can change this as needed

    // Hash the default password using bcrypt
    const hashedDefaultPassword = await bcrypt.hash(defaultPassword, 10);

    // Add the new user to your data (values array) and set Registration Date and Account Status to "active"
    const newUserRow = [
      newUserId,
      newUser.USERNAME,
      hashedDefaultPassword, // Store the hashed default password
      newUser.NAME,
      newUser.ROLE,
      currentDate,
      currentDate,
      'active',
    ];

    values.push(newUserRow);

    // Insert the new data into Google Sheets using sheetsAPI.spreadsheets.values.append
    await sheetsAPI.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: 'USER',
      valueInputOption: 'RAW',
      resource: { values: [newUserRow] },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: 'User added successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to add user data to Google Sheets' }),
    };
  }
};
