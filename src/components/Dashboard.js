import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [sheetData, setSheetData] = useState([]);
  const apiKey = 'AIzaSyCUhDVG-ngYYJCZ-X3A-e-oRICiDkEcA2Y'; // Replace with your actual API key

  useEffect(() => {
    async function fetchData() {
      try {
        // Make the Google Sheets API request using the loaded API key
        const response = await axios.get(
          'https://sheets.googleapis.com/v4/spreadsheets/1e7nX6RI156cpSNQZ3ersg8Idg9cKZq9e-s5AtNRYMn4/values/Client!A1:W12',
          {
            params: {
              key: apiKey,
            },
          }
        );

        const jsonData = response.data.values;
        setSheetData(jsonData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1>Google Sheets Data</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
            {/* Add more table headers for your data */}
          </tr>
        </thead>
        <tbody>
          {sheetData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
