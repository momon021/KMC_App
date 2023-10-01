import React from 'react';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
} from '@mui/material';
import '../styles/Home.css'; // Import your CSS file here

function Home() {
  return (
    <Container className="Container">
      <h2>Welcome to KM Castillo Tax and Accounting Services</h2>
      <p>
        We provide professional accounting and tax services to individuals and
        businesses. Our team of experts is here to assist you with all your
        financial needs.
      </p>

      <Grid container spacing={2}>
        {/* Service Card 1 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className="ServiceCard">
            <CardMedia
              component="img"
              height="200"
              image="https://via.placeholder.com/300" // Replace with your image URL
              alt="Service 1"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Accounting Services
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We offer a wide range of accounting services to help you manage
                your finances efficiently.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Card 2 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className="ServiceCard">
            <CardMedia
              component="img"
              height="200"
              image="https://via.placeholder.com/300" // Replace with your image URL
              alt="Service 2"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Tax Planning
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Our tax planning services are designed to minimize your tax
                liability and maximize savings.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Service Card 3 */}
        <Grid item xs={12} sm={6} md={4}>
          <Card className="ServiceCard">
            <CardMedia
              component="img"
              height="200"
              image="https://via.placeholder.com/300" // Replace with your image URL
              alt="Service 3"
            />
            <CardContent>
              <Typography variant="h5" component="div">
                Financial Consultation
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get expert financial advice and consultation to make informed
                decisions.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
