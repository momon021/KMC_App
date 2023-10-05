import React from "react";
import accountingImage from "../images/black.png";
import taxImage from "../images/black.png";
import consultingImage from "../images/black.png";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/system";

// Define styles using makeStyles
const useStyles = styled((theme) => ({
  card: {
    maxWidth: 345,
    marginBottom: "20px",
  },
}));

function ServicesHome() {
  const classes = useStyles(); // Use the makeStyles styles

  return (
    <div>
      <Typography variant="h4" align="center" mt={4}>
        <h2>Services</h2>
      </Typography>
      <Card className={classes.card}>
        <CardMedia
          component="img"
          height="140"
          image={accountingImage}
          alt="Accounting Services"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Accounting Services
          </Typography>
          <Typography variant="body2" color="text.secondary">
            We offer a wide range of accounting services to meet your financial
            needs.
          </Typography>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardMedia
          component="img"
          height="140"
          image={taxImage}
          alt="Tax Services"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Tax Services
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Our tax experts are here to help you with tax planning and
            preparation.
          </Typography>
        </CardContent>
      </Card>
      <Card className={classes.card}>
        <CardMedia
          component="img"
          height="140"
          image={consultingImage}
          alt="Consulting Services"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Consulting Services
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Get professional financial consulting to make informed decisions.
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default ServicesHome;
