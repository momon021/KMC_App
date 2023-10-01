import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios';
import Typography from '@mui/material/Typography';
import '../styles/Services.css'; // Import the CSS file
import { styled } from '@mui/system';

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '16px',
  },
};

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px',
});

const Header = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
  marginBottom: '16px',
});

// Configuration Object
const config = {
  baseUrl: 'http://localhost:5000/api', // Base URL
  endpoints: {
    viewService: '/view-service',
    deleteService: '/delete-service',
    editService: '/edit-service',
    addService: '/add-service',
  },
};

function Services() {
  const [services, setServices] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({});
  const [serviceName, setServiceName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [serviceScope, setServiceScope] = useState('');
  const [serviceDetails, setServiceDetails] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('error');
  const [loading, setLoading] = useState(true); // State variable for the loading indicator
  const [error, setError] = useState(null); // State variable for error handling
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false); // State variable for delete confirmation dialog

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${config.baseUrl}${config.endpoints.viewService}`);
      setServices(response.data);
      setLoading(false); // Set loading to false when data is fetched successfully
    } catch (error) {
      console.error('Error fetching services:', error);
      setError(error); // Set the error state when an error occurs
      setLoading(false); // Set loading to false when an error occurs
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = () => {
    setDialogOpen(true);
    setSelectedService(null);
  };

  const handleEditService = (service) => {
    setSelectedService(service);
    setServiceName(service.SERVICE);
    setServiceType(service.Type);
    setServiceScope(service.Scope);
    setServiceDetails(service.Details);
    setDialogOpen(true);
  };

  const handleDeleteService = async (serviceId) => {
    try {
      await axios.delete(`${config.baseUrl}${config.endpoints.deleteService}/${serviceId}`);
      fetchServices(); // Refresh data after deletion
      showNotification('Service deleted successfully', 'success');
      setDeleteConfirmationOpen(false); // Close the delete confirmation dialog after successful deletion
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Error deleting service');
      setAlertOpen(true);
      setDeleteConfirmationOpen(false); // Close the delete confirmation dialog after an error
    }
  };

  const handleOpenDeleteConfirmation = (service) => {
    setSelectedService(service);
    setDeleteConfirmationOpen(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setSelectedService({});
    setDeleteConfirmationOpen(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedService({});
    setServiceName('');
    setServiceType('');
    setServiceScope('');
    setServiceDetails('');
  };

  const handleSaveService = async () => {
    try {
      if (selectedService) {
        await axios.put(`${config.baseUrl}${config.endpoints.editService}/${selectedService.SERVICE_ID}`, {
          SERVICE: serviceName,
          Type: serviceType,
          Scope: serviceScope,
          Details: serviceDetails,
        });
        fetchServices(); // Refresh data after editing
        showNotification('Service updated successfully', 'success');
      } else {
        await axios.post(`${config.baseUrl}${config.endpoints.addService}`, {
          SERVICE: serviceName,
          Type: serviceType,
          Scope: serviceScope,
          Details: serviceDetails,
        });
        fetchServices(); // Refresh data after adding
        showNotification('Service added successfully', 'success');
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving service:', error);
      setAlertType('error');
      setAlertMessage('Error saving service');
      setAlertOpen(true);
    }
  };

  const showNotification = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertOpen(true);
  };

  const handleSnackbarClose = () => {
    setAlertOpen(false);
  };

  return (
    <Container>
      <Header>
        <Typography variant="h4">Services</Typography>
        <Button variant="contained" color="primary" onClick={handleAddService}>
          Add New Service
        </Button>
      </Header>
      {loading ? (
        <div style={styles.loadingContainer}>
          <Typography variant="h5">Loading...</Typography>
        </div>
      ) : error ? (
        <Typography>Error: {error.message}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Service</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Scope</TableCell>
                <TableCell>Details</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.SERVICE_ID}>
                  <TableCell>{service.SERVICE}</TableCell>
                  <TableCell>{service.Type}</TableCell>
                  <TableCell>{service.Scope}</TableCell>
                  <TableCell>{service.Details}</TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => handleEditService(service)}>
                      Edit
                    </Button>
                    <Button color="secondary" onClick={() => handleOpenDeleteConfirmation(service)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>{selectedService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Service Name"
            variant="outlined"
            margin="normal"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Service Type"
            variant="outlined"
            margin="normal"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          />
          <TextField
            fullWidth
            label="Service Scope"
            variant="outlined"
            margin="normal"
            value={serviceScope}
            onChange={(e) => setServiceScope(e.target.value)}
          />
          <TextField
            fullWidth
            label="Service Details"
            variant="outlined"
            margin="normal"
            value={serviceDetails}
            onChange={(e) => setServiceDetails(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveService} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmationOpen} onClose={handleCloseDeleteConfirmation}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this service?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleDeleteService(selectedService.SERVICE_ID)} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={alertOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <MuiAlert elevation={6} variant="filled" onClose={handleSnackbarClose} severity={alertType}>
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default Services;
