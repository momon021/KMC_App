import React, { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

// Import the User and Services components
import User from './User'; // Replace with the correct path to your User component
import Services from './Services';

const mainContentStyle = {
  padding: '15px',
  fontSize: '12px', // Adjust the font size as needed
};

function Settings() {
  const [selectedItem, setSelectedItem] = useState('User Settings'); // Default selection

  const handleItemClick = (itemName) => {
    setSelectedItem(itemName);
  };

  return (
    <div>
      <CssBaseline />
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Side Navigation */}
          <Grid item xs={12} md={3}>
            <Paper elevation={3} style={{ height: '100%' }}>
              <List>
                <ListItem
                  button
                  onClick={() => handleItemClick('User Settings')}o
                  suppressContentEditableWarning
                  selected={selectedItem === 'User Settings'}
                >
                  <ListItemText primary="User Settings" />
                </ListItem>
                <ListItem
                  button
                  onClick={() => handleItemClick('Services Settings')}
                  selected={selectedItem === 'Services Settings'}
                >
                  <ListItemText primary="Services Settings" />
                </ListItem>
                {/* Add more list items for other settings categories */}
              </List>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Paper elevation={3} style={mainContentStyle}>
              {selectedItem === 'User Settings' ? (
                <User />
              ) : selectedItem === 'Services Settings' ? (
                <Services />
              ) : null}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Settings;
