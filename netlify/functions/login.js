const { google } = require('googleapis');
const bcrypt = require('bcryptjs');

exports.handler = async (event, context) => {
  try {
    const keyFile = require('../../src/json/kmc-work-mangement-38261d8b5b5b.json'); // Replace with your key file path
    const auth = new google.auth.GoogleAuth({
      credentials: keyFile,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const range = 'USER!A:Z'; // Adjust the range to cover your data

    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values;
    const users = values.map((row) => ({
      USER_ID: row[0], // Add USER_ID for later reference
      USERNAME: row[1],
      PASSWORD: row[2],
      ACCOUNT_STATUS: row[7], // Assuming account status is in the eighth column
    }));

    // Assuming you have a request body containing the login credentials
    const { username, password } = JSON.parse(event.body);

    // Find the user with the provided username
    const user = users.find((u) => u.USERNAME === username);

    if (!user) {
      console.log('User not found');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'User not found' }),
      };
    }

    if (user.ACCOUNT_STATUS === 'deleted') {
      console.log('Account has been deleted');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Account has been deleted' }),
      };
    }

    const passwordMatch = await bcrypt.compare(password, user.PASSWORD);

    if (passwordMatch) {
      // Passwords match, user is authenticated
      console.log('Login successful');
      return {
        statusCode: 200,
        body: JSON.stringify({ success: 'Login successful', user: { USER_ID: user.USER_ID, USERNAME: user.USERNAME } }),
      };
    } else {
      // Passwords do not match, authentication failed
      console.log('Invalid username or password');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid username or password' }),
      };
    }
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to perform login operation' }),
    };
  }
};
