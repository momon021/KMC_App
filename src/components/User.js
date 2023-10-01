import React, { useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/system';

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
const config = {
  //baseUrl: 'http://localhost:5000/api',
  baseUrl: 'https://kmcworkmanagement.netlify.app/.netlify/functions',
  endpoints: {
    editUser: '/edit-user',
    addUser: '/add-user',
    getUsers: '/get-users',
    changePassword: '/update-password',
  },
};


function User() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteSnackbar, setOpenDeleteSnackbar] = useState(false);
  const [openAddUserDialog, setOpenAddUserDialog] = useState(false);
  const [newUser, setNewUser] = useState({
    USERNAME: '',
    NAME: '',
    ROLE: '',
  });
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false); // Add this line

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
  };

  const handleOpenEditDialog = (user) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };
  const handleEditUser = () => {
    // Send a PUT request to your edit API with the updated user data
    fetch(`${config.baseUrl}${config.endpoints.editUser}/${selectedUser.USER_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle success or error response from the server
        if (data.success) {
          setOpenEditDialog(false);
          fetchUserList();
          setAlertType('success');
          setAlertMessage('User edited successfully!');
          setOpenDeleteSnackbar(true);
        } else {
          console.error('Error editing user:', data.message);
          setAlertType('error');
          setAlertMessage(`Error editing user: ${data.message}`);
          setOpenDeleteSnackbar(true);
        }
      })
      .catch((error) => {
        console.error('Error editing user:', error);
        setAlertType('error');
        setAlertMessage('Error editing user.');
        setOpenDeleteSnackbar(true);
      });
  };

  
  const handleChangePassword = () => {
    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      setAlertType('error');
      setAlertMessage('New password and confirm password do not match.');
      setOpenDeleteSnackbar(true);
      return;
    }

    const updatePasswordUrl = `${config.baseUrl}${config.endpoints.changePassword}/${selectedUser.USER_ID}`;
    console.log ('updatePasswordUrl: ',updatePasswordUrl)
    putRequest(updatePasswordUrl, { password: newPassword })
      .then((data) => {
        if (data.success) {
          setOpenChangePasswordDialog(false);
          // Assuming the password change was successful
          setAlertType('success');
          setAlertMessage('Password changed successfully.');
          setOpenDeleteSnackbar(true);

          // Reset the password fields
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');

          // Close the password change dialog if needed
          setOpenEditDialog(false);
        } else {
          console.error('Error changing password:', data.message);
          setAlertType('error');
          setAlertMessage(`Error changing password: ${data.message}`);
          setOpenDeleteSnackbar(true);
        }
      })
      .catch((error) => {
        console.error('Error changing password:', error);
        setAlertType('error');
        setAlertMessage('Error changing password.');
        setOpenDeleteSnackbar(true);
      });
  };
  const handleDeleteUser = () => {
    handleCloseDeleteConfirmation();
    
    // Send a PUT request to update the user's status to "deleted"
    fetch(`${config.baseUrl}${config.endpoints.editUser}/${selectedUser.USER_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ACCOUNT_STATUS: 'deleted' }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          fetchUserList(); // Fetch updated user list
          setAlertType('success');
          setAlertMessage('User deleted successfully!');
          setOpenDeleteSnackbar(true);
        } else {
          console.error('Error deleting user:', data.message);
          setAlertType('error');
          setAlertMessage(`Error deleting user: ${data.message}`);
          setOpenDeleteSnackbar(true);
        }
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        setAlertType('error');
        setAlertMessage('Error deleting user.');
        setOpenDeleteSnackbar(true);
      });
  };
  
  const handleOpenDeleteConfirmation = (user) => {
    setSelectedUser(user);
    setOpenDeleteConfirmation(true);
  };

  const handleCloseDeleteConfirmation = () => {
    setOpenDeleteConfirmation(false);
  };

  const handleOpenChangePasswordDialog = (user) => {
    setSelectedUser(user);
    setOpenChangePasswordDialog(true);
  };

  const handleCloseChangePasswordDialog = () => {
    setOpenChangePasswordDialog(false);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenDeleteSnackbar(false);
  };

  const handleOpenAddUserDialog = () => {
    setOpenAddUserDialog(true);
  };

  const handleCloseAddUserDialog = () => {
    setOpenAddUserDialog(false);
  };

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Define a reusable function for making PUT requests
  async function putRequest(url, data) {
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      return responseData;
    } catch (error) {
      throw error;
    }
  }

  const fetchUserList = () => {
    return fetch(`${config.baseUrl}${config.endpoints.getUsers}`)
      .then((response) => response.json())
      .then((data) => {
        const userData = data.slice(1);
        setUsers(userData);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
        throw error; // Propagate the error for handling
      });
  };

  const handleAddUser = () => {
    // Send a POST request to your add-user API with the new user data
    fetch(`${config.baseUrl}${config.endpoints.addUser}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle success or error response from the server
        if (data.success) {
          setOpenAddUserDialog(false);
          setNewUser({
            USERNAME: '',
            NAME: '',
            ROLE: '',
          });
          fetchUserList();
          setAlertType('success');
          setAlertMessage('User added successfully!');
          setOpenDeleteSnackbar(true);
        } else {
          console.error('Error adding user:', data.message);
          setAlertType('error');
          setAlertMessage(`Error adding user: ${data.message}`);
          setOpenDeleteSnackbar(true);
        }
      })
      .catch((error) => {
        console.error('Error adding user:', error);
        setAlertType('error');
        setAlertMessage('Error adding user.');
        setOpenDeleteSnackbar(true);
      });
  };

  useEffect(() => {
    fetchUserList()
      .then(() => setLoading(false))
      .catch((err) => setError(err));
  }, []);

  return (
    <Container>
      <Header>
        <Typography variant="h4">User Management</Typography>
        <Button variant="contained" color="primary" onClick={handleOpenAddUserDialog}>
          New User
        </Button>
      </Header>
      {loading ? (
        <Typography>Loading...</Typography>
      ) : error ? (
        <Typography>Error: {error.message}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Username</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Account Status</TableCell>
                <TableCell>Registration Date</TableCell>
                <TableCell>Last Update Date</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.USER_ID}>
                  <TableCell>{user.USERNAME}</TableCell>
                  <TableCell>{user.NAME}</TableCell>
                  <TableCell>{user.ROLE}</TableCell>
                  <TableCell>{user.ACCOUNT_STATUS}</TableCell>
                  <TableCell>{user.REGISTRATION_DATE}</TableCell>
                  <TableCell>{user.LAST_UPDATE_DATE}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenEditDialog(user)}>Edit</Button>
                    <Button onClick={() => handleOpenDeleteConfirmation(user)}>Delete</Button>
                    <Button onClick={() => handleOpenChangePasswordDialog(user)}>Change Password</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

      )}

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle >Edit User</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Username"
            variant="outlined"
            margin="normal"
            value={selectedUser ? selectedUser.USERNAME : ''}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                USERNAME: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            margin="normal"
            value={selectedUser ? selectedUser.NAME : ''}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                NAME: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Role"
            variant="outlined"
            margin="normal"
            value={selectedUser ? selectedUser.ROLE : ''}
            onChange={(e) =>
              setSelectedUser({
                ...selectedUser,
                ROLE: e.target.value,
              })
            }
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleEditUser} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openChangePasswordDialog} onClose={handleCloseChangePasswordDialog}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Old Password"
            variant="outlined"
            margin="normal"
            fullWidth
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <TextField
            label="New Password"
            variant="outlined"
            margin="normal"
            fullWidth
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm New Password"
            variant="outlined"
            margin="normal"
            fullWidth
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseChangePasswordDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleChangePassword} color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openAddUserDialog} onClose={handleCloseAddUserDialog}>
        <DialogTitle >Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Username"
            variant="outlined"
            margin="normal"
            fullWidth
            value={newUser.USERNAME}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                USERNAME: e.target.value,
              })
            }
          />
          <TextField
            label="Name"
            variant="outlined"
            margin="normal"
            fullWidth
            value={newUser.NAME}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                NAME: e.target.value,
              })
            }
          />
          <TextField
            label="Role"
            variant="outlined"
            margin="normal"
            fullWidth
            value={newUser.ROLE}
            onChange={(e) =>
              setNewUser({
                ...newUser,
                ROLE: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddUserDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleAddUser} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteConfirmation} onClose={handleCloseDeleteConfirmation}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete this user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmation} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleDeleteUser} color="primary">
            Confirm Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openDeleteSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackbarClose}
          severity={alertType}
        >
          {alertMessage}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default User;
