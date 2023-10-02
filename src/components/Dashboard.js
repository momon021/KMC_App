import React from "react";
import { Container, Grid, Paper, Typography } from "@mui/material";

function Dashboard() {
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

  const agingData = [
    { id: 1, clientName: "Client A", agingDays: 15 },
    { id: 2, clientName: "Client B", agingDays: 30 },
    { id: 3, clientName: "Client C", agingDays: 7 },
  ];

  const nearDeadlineData = [
    { id: 1, taskName: "Task X", daysUntilDeadline: 3 },
    { id: 2, taskName: "Task Y", daysUntilDeadline: 5 },
    { id: 3, taskName: "Task Z", daysUntilDeadline: 2 },
  ];

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Task View */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "20px" }}>
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
          <Paper elevation={3} style={{ padding: "20px" }}>
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

        {/* Aging View */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h5" gutterBottom>
              Aging
            </Typography>
            <ul>
              {agingData.map((client) => (
                <li key={client.id}>
                  {client.clientName} - Aging Days: {client.agingDays}
                </li>
              ))}
            </ul>
          </Paper>
        </Grid>

        {/* Near Deadline View */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} style={{ padding: "20px" }}>
            <Typography variant="h5" gutterBottom>
              Near Deadlines
            </Typography>
            <ul>
              {nearDeadlineData.map((task) => (
                <li key={task.id}>
                  {task.taskName} - Days Until Deadline: {task.daysUntilDeadline}
                </li>
              ))}
            </ul>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
