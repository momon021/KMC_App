import React from 'react';
import { Typography, Container, Grid, Paper, Box } from '@mui/material';

function AboutUs() {
  return (
    <Container>
      <Typography variant="h4" align="center" mt={4}>
        About Us
      </Typography>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" paragraph>
          At KM CASTILLO Tax and Accounting Services, our mission is to provide top-notch tax
          consulting and accounting solutions to individuals and businesses. We are dedicated to
          helping our clients navigate the complexities of taxation and financial management with
          ease and confidence.
        </Typography>
        <Typography variant="h6" gutterBottom>
          Why Choose Us?
        </Typography>
        <Typography variant="body1" paragraph>
          With years of experience and a team of highly skilled professionals, we stand out as a
          trusted partner in managing your financial well-being. We offer personalized service,
          accuracy, and a commitment to maximizing your financial success.
        </Typography>
        <Typography variant="h6" gutterBottom mt={4}>
          Our Team
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                style={{ width: '100%' }}
              />
              <Typography variant="subtitle1" mt={2}>
                John Doe
              </Typography>
              <Typography variant="body2" color="textSecondary">
                CEO
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                style={{ width: '100%' }}
              />
              <Typography variant="subtitle1" mt={2}>
                Jane Smith
              </Typography>
              <Typography variant="body2" color="textSecondary">
                CTO
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <img
                src="https://via.placeholder.com/150"
                alt="Team Member"
                style={{ width: '100%' }}
              />
              <Typography variant="subtitle1" mt={2}>
                Bob Johnson
              </Typography>
              <Typography variant="body2" color="textSecondary">
                COO
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
      <Box mt={4} mb={4} />
    </Container>
  );
}

export default AboutUs;
