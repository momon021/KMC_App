import React from "react";
import { Container, Grid, Paper, Typography, Card, CardContent } from "@mui/material";
import { Doughnut } from "react-chartjs-2"; // Import Doughnut chart
import { makeStyles } from "@mui/styles"; // Import makeStyles from @mui/styles

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

function Dashboard() {
  const classes = useStyles();

  // Sample data for demonstration
  const taskData = [
    { id: 1, title: "Task 1", status: "In Progress" },
    { id: 2, title: "Task 2", status: "Completed" },
    { id: 3, title: "Task 3", status: "Pending" },
  ];

  const clientProgressData = [
    { id: 1, clientName: "Client A", progress: 75 },
    { id: 2, clientName: "Client B", progress: 50 },
    { id: 3, clientName: "Client C", progress: 90 },
  ];

  const doughnutData = {
    labels: ["In Progress", "Completed", "Pending"],
    datasets: [
      {
        data: [1, 2, 3],
        backgroundColor: ["rgba(255, 99, 132, 0.6)", "rgba(54, 162, 235, 0.6)", "rgba(255, 206, 86, 0.6)"],
      },
    ],
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Task View */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" gutterBottom>
              Task View
            </Typography>
            <ul>
              {taskData.map((task) => (
                <li key={task.id}>
                  {task.title} - {task.status}
                </li>
              ))}
            </ul>
          </Paper>
        </Grid>

        {/* Client Progress View */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" gutterBottom>
              Client Progress
            </Typography>
            <ul>
              {clientProgressData.map((client) => (
                <li key={client.id}>
                  {client.clientName} - Progress: {client.progress}%
                </li>
              ))}
            </ul>
          </Paper>
        </Grid>

        {/* Task Status Doughnut Chart */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className={classes.paper}>
            <Typography variant="h5" gutterBottom>
              Task Status Doughnut Chart
            </Typography>
            <Doughnut data={doughnutData} />
          </Paper>
        </Grid>

        {/* More Graphs or Information */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                More Graphs or Information
              </Typography>
              {/* Add more graphs, information, or buttons as needed */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
