const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path'); // Import the 'path' module

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json()); // Add this middleware to parse JSON request bodies

// Use 'path.join' to create absolute file paths
const userFilePath = path.join(__dirname, '../json/user.json');
const keyFilePath = path.join(__dirname, '../json/kmc-work-mangement-38261d8b5b5b.json');

// Load user data from JSON file
const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));

// Configure Google Sheets API with service account credentials
const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.get('/get-google-sheets-data', async (req, res) => {
  try {
    const sheetsAPI = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const range = 'Sheet1!A1:G10';

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

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Find a user with matching credentials
  const user = userData.users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Successful login
    res.json({ success: true, user });
  } else {
    // Invalid credentials
    res.status(401).json({ success: false, message: 'Invalid username or password' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
