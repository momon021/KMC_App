import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
} from '@mui/material';
import '../styles/ClientDetails.css';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '16px',
});

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
});

function ClientDetails() {
  const [sheetData, setSheetData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newClientData, setNewClientData] = useState({});

  useEffect(() => {
    // Fetch data from the API
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:5000/get-google-sheets-data', {
          method: 'GET',
        });

        const jsonData = await response.json();
        setSheetData(jsonData);
      } catch (error) {
        console.error(error);
      }
    }

    fetchData();
  }, []);

  const handleRowClick = (row) => {
    // Open the popup when a row is clicked
    setSelectedItem(row);
  };

  const handleEditClick = (row) => {
    // Open the edit popup when edit is clicked
    setEditedData(row);
    setIsEditOpen(true);
  };

  const handleEditSave = () => {
    // Save the edited data here and close the edit popup
    setIsEditOpen(false);
    // Add logic to save edited data to the API
  };

  const handleCloseEdit = () => {
    // Close the edit popup without saving
    setIsEditOpen(false);
  };

  const handleAddOpen = () => {
    setIsAddOpen(true);
  };

  const handleAddClose = () => {
    setIsAddOpen(false);
    setNewClientData({});
  };

  const selectedColumnsIndices = [1, 2, 3, 4, 23];
  const selectedColumnsIndicesView = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22
  ];

  return (
    <div>
      <Container>
        <Header>
          <Typography variant="h4">Client Information</Typography>
          <Button variant="contained" color="primary" onClick={handleAddOpen} style={{ margin: '20px' }}>
            Add Client
          </Button>
        </Header>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {selectedColumnsIndices.map((colIndex) => (
                  <TableCell key={colIndex} className="header-cell">
                    {sheetData[0] && sheetData[0][colIndex]}
                  </TableCell>
                ))}
                <TableCell className="header-cell">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sheetData.slice(1).map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {selectedColumnsIndices.map((colIndex) => (
                    <TableCell key={colIndex}>{row[colIndex]}</TableCell>
                  ))}
                  <TableCell>
                    <Button onClick={() => handleRowClick(row)}>View</Button>
                    <Button onClick={() => handleEditClick(row)}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {selectedItem && (
          <Dialog open={!!selectedItem} onClose={() => setSelectedItem(null)}>
            <DialogTitle>Client Details</DialogTitle>
            <DialogContent>
              <Grid container spacing={3} style={{ marginTop: '10px' }}>
                {selectedColumnsIndicesView.map((colIndex) => (
                  <Grid item xs={6} key={colIndex}>
                    <strong>{sheetData[0] && sheetData[0][colIndex]}:</strong> {selectedItem[colIndex]}
                  </Grid>
                ))}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedItem(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        )}

        <Dialog open={isEditOpen} onClose={handleCloseEdit}>
          <DialogTitle>Edit Client Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} style={{ marginTop: '10px' }}>
              {selectedColumnsIndicesView.map((colIndex) => (
                <Grid item xs={6} key={colIndex}>
                  <TextField
                    label={sheetData[0] && sheetData[0][colIndex]}
                    value={editedData[colIndex] || ''}
                    onChange={(e) => setEditedData({ ...editedData, [colIndex]: e.target.value })}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit}>Cancel</Button>
            <Button onClick={handleEditSave}>Save</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={isAddOpen} onClose={handleAddClose}>
          <DialogTitle>Add Client</DialogTitle>
          <DialogContent>
            <Grid container spacing={3} style={{ marginTop: '10px' }}>
              {selectedColumnsIndicesView.map((colIndex) => (
                <Grid item xs={6} key={colIndex}>
                  <TextField
                    label={sheetData[0] && sheetData[0][colIndex]}
                    value={newClientData[colIndex] || ''}
                    onChange={(e) => setNewClientData({ ...newClientData, [colIndex]: e.target.value })}
                    fullWidth
                  />
                </Grid>
              ))}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleAddClose}>Cancel</Button>
            <Button
              onClick={() => {
                // Add logic to save new client data to the API
                // After saving, you can close the popup and reset newClientData
                setIsAddOpen(false);
                setNewClientData({});
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
}

export default ClientDetails;
