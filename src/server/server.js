const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt'); // Import bcrypt

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const keyFilePath = path.join(__dirname, '../json/kmc-work-mangement-38261d8b5b5b.json');

const auth = new google.auth.GoogleAuth({
  keyFile: keyFilePath,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

app.get('/get-google-sheets-data', async (req, res) => {
  try {
    const sheetsAPI = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const range = 'V_CLIENT!A:Z';

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

app.get('/api/get-users', async (req, res) => {
  try {
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

    res.json(users);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to retrieve user data from Google Sheets' });
  }
});

app.post('/api/add-user', async (req, res) => {
  try {
    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
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
    const newUser = req.body;

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

    res.json({ success: 'User added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to add user data to Google Sheets' });
  }
});



app.put('/api/edit-user/:userId', async (req, res) => {
  try {
    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const userId = req.params.userId; // Get USER_ID from request
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const sheetName = 'USER'; // Set the sheet name dynamically
    const range = `${sheetName}!A:Z`; // Set the range dynamically

    // Assuming you have a request body containing updated user data, including LAST_UPDATE_DATE
    const updatedUserData = req.body;
    updatedUserData.LAST_UPDATE_DATE = new Date().toISOString(); // Update Last Update Date

    // Load user data from Google Sheets to ensure 'values' is defined
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range, // Use the dynamically set range
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
        updatedUserData.LAST_UPDATE_DATE, // Update Last Update Date
        updatedUserData.ACCOUNT_STATUS, 
      ];
    } else {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update the data in Google Sheets using sheetsAPI.spreadsheets.values.update
    await sheetsAPI.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: `${sheetName}!A${userIndex + 1}:H${userIndex + 1}`, // Use the dynamically set sheet name and range
      valueInputOption: 'RAW',
      resource: { values: [values[userIndex]] },
    });

    res.json({ success: 'User updated successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update user data in Google Sheets' });
  }
});



app.post('/api/login', async (req, res) => {
  try {
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
      ACCOUNT_STATUS: row[7], // Assuming account status is in the fifth column
    }));

    // Assuming you have a request body containing the login credentials
    const { username, password } = req.body;

    // Find the user with the provided username
    const user = users.find((u) => u.USERNAME === username);

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.ACCOUNT_STATUS === 'deleted') {
      console.log('Account has been deleted');
      return res.status(401).json({ error: 'Account has been deleted' });
    }


    const passwordMatch = await bcrypt.compare(password, user.PASSWORD);

    if (passwordMatch) {
      // Passwords match, user is authenticated
      console.log('Login successful');
      res.json({ success: 'Login successful', user: { USER_ID: user.USER_ID, USERNAME: user.USERNAME } });
    } else {
      // Passwords do not match, authentication failed
      console.log('Invalid username or password');
      res.status(401).json({ error: 'Invalid username or password' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to perform login operation' });
  }
});


app.put('/api/update-password/:userId', async (req, res) => {
  try {
    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const userId = req.params.userId;
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const sheetName = 'USER';
    const range = `${sheetName}!A1:G1000`;

    // Assuming you have a request body containing the new password
    const newPassword = req.body.password;

    // Hash the new password using bcrypt
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Load user data from Google Sheets to ensure 'values' is defined
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const values = response.data.values;

    // Find the user in your data (values array) by USER_ID and update the password
    const userIndex = values.findIndex((row) => row[0] === userId);

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

      res.json({ success: 'Password updated successfully' });
    } else {
      return res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update user password in Google Sheets' });
  }
});
//============SERVICE==================

app.post('/api/add-service', async (req, res) => {
  try {
    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const sheetName = 'SERVICES';

    // Assuming you have a request body containing new service data
    const newService = req.body;

    // Find the last SERVICE_ID and generate the next one
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: `${sheetName}!A:Z`, // Assuming SERVICE_ID is in column A
    });

    const values = response.data.values;
    let lastServiceId = 0;

    if (values.length > 1) {
      for (let i = 1; i < values.length; i++) {
        const serviceId = parseInt(values[i][0], 10);
        if (!isNaN(serviceId) && serviceId > lastServiceId) {
          lastServiceId = serviceId;
        }
      }
    }

    // Generate the new SERVICE_ID
    const newServiceId = lastServiceId + 1;

    // Add the new service to your data (values array)
    const newServiceRow = [newServiceId, newService.SERVICE, newService.Type, newService.Scope, newService.Details];

    // Insert the new data into Google Sheets using sheetsAPI.spreadsheets.values.append
    await sheetsAPI.spreadsheets.values.append({
      spreadsheetId: spreadsheetId,
      range: `${sheetName}`,
      valueInputOption: 'RAW',
      resource: { values: [newServiceRow] },
    });

    res.json({ success: 'Service added successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to add service data to Google Sheets' });
  }
});


app.put('/api/edit-service/:serviceId', async (req, res) => {
  try {
    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const serviceId = req.params.serviceId;
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const sheetName = 'SERVICES';
    const range = `${sheetName}!A1:E1000`; // Adjust the range based on your data

    // Assuming you have a request body containing updated service data
    const updatedServiceData = req.body;

    // Load service data from Google Sheets to ensure 'values' is defined
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const values = response.data.values;

    // Find the service in your data (values array) by SERVICE_ID and update it
    const serviceIndex = values.findIndex((row) => row[0] === serviceId);

    if (serviceIndex !== -1) {
      values[serviceIndex] = [serviceId, updatedServiceData.SERVICE, updatedServiceData.Type, updatedServiceData.Scope, updatedServiceData.Details];

      // Update the data in Google Sheets using sheetsAPI.spreadsheets.values.update
      await sheetsAPI.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!A${serviceIndex + 1}:E${serviceIndex + 1}`,
        valueInputOption: 'RAW',
        resource: { values: [values[serviceIndex]] },
      });

      res.json({ success: 'Service updated successfully' });
    } else {
      return res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to update service data in Google Sheets' });
  }
});


app.get('/api/view-service/:serviceId', async (req, res) => {
  try {
    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const serviceId = req.params.serviceId;
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const sheetName = 'SERVICES';
    const range = `${sheetName}!A:Z`; // Assuming your data is in columns A to E

    // Load service data from Google Sheets
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    const values = response.data.values;

    // Find the service in your data (values array) by SERVICE_ID
    const service = values.find((row) => row[0] === serviceId);

    if (service) {
      const [SERVICE_ID, Service, Type, Scope, Details] = service;
      res.json({ SERVICE_ID, Service, Type, Scope, Details });
    } else {
      return res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to retrieve service data from Google Sheets' });
  }
});
app.get('/api/view-service/', async (req, res) => {
  try {
    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const sheetName = 'SERVICES';
    const range = `${sheetName}!A2:E`; // Assuming your data is in columns B to E, excluding SERVICE_ID

    // Load service data from Google Sheets
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: range,
    });

    // Extract the values correctly
    const values = response.data.values;

    // Map the values to an array of service objects
    const services = values.map((row) => ({
      SERVICE_ID: row[0],
      SERVICE: row[1],
      Type: row[2],
      Scope: row[3],
      Details: row[4],
    }));

    res.json(services);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to retrieve service data from Google Sheets' });
  }
});
app.delete('/api/delete-service/:serviceId', async (req, res) => {
  try {
    const sheetsAPI = google.sheets({ version: 'v4', auth });
    const serviceId = req.params.serviceId;
    const spreadsheetId = '1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4';
    const sheetName = 'SERVICES';

    // Load service data from Google Sheets to ensure 'values' is defined
    const response = await sheetsAPI.spreadsheets.values.get({
      spreadsheetId: spreadsheetId,
      range: `${sheetName}!A:X`,
    });

    const values = response.data.values;

    // Find the index of the row to be "deleted"
    const serviceIndex = values.findIndex((row) => row[0] === serviceId);

    if (serviceIndex !== -1) {
      // Clear the values in the selected row
      await sheetsAPI.spreadsheets.values.clear({
        spreadsheetId: spreadsheetId,
        range: `${sheetName}!A${serviceIndex + 1}:X${serviceIndex + 1}`,
      });

      res.json({ success: 'Service deleted successfully' });
    } else {
      console.log('Service not found');
      return res.status(404).json({ error: 'Service not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    console.log('Error:', error);
    res.status(500).json({ error: 'Failed to delete service data from Google Sheets' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
