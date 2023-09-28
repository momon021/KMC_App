// WebsiteTraffic.js
import React, { useEffect, useState } from 'react';


function ClientDetails() {

  const [sheetData, setSheetData] = useState([]);

  useEffect(() => {
      // Fetch data from the backend API
      async function fetchData() {
          try {
              //const response = await fetch('/get-google-sheets-data');
              //const response = await fetch('http://localhost:5000/get-google-sheets-data');
              const response = await fetch('https://kmcworkmanagement.netlify.app/.netlify/functions/get-google-sheets-data');
              
              const jsonData = await response.json();
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
          <table>
              <thead>
                  <tr>
                      <th>Column 1</th>
                      <th>Column 2</th>
                      <th>Column 3</th>
                      <th>Column 4</th>
                  </tr>
              </thead>
              <tbody>
                  {sheetData.map((row, index) => (
                      <tr key={index}>
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

export default ClientDetails;
