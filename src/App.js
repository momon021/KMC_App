import React, { useState, useEffect } from "react";
import "./styles/myApp.css"; // Import your CSS file here
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./components/Login.js"; // Import the Login component
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button"; // Import the Button component
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SettingsIcon from "@mui/icons-material/Settings";
import Divider from "@mui/material/Divider"; // Import Divider
import MainDashboard from "./components/Dashboard.js";
import ClientDetails from "./components/ClientDetails.js";
import TaskManagement from "./components/TaskManagement.js";
import Settings from "./components/Settings.js";
import Home from "./components/Home.js";
import logo from "./images/icon.png";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [username, setUsername] = useState("");
  const [openDrawer, setOpenDrawer] = useState(true);

  // Define handleLoginClick at the top
  const handleLoginClick = () => {
    setIsLoginPage(true);
    setSelectedTab(isLoggedIn ? 1 : -1); // Change the default tab to 1 (Dashboard) if logged in
  };

  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");

    if (storedLoginState) {
      setIsLoggedIn(true);
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }

    // Set the default tab to Dashboard when the component mounts if logged in
    if (isLoggedIn) {
      setSelectedTab(1); // 1 corresponds to the Dashboard tab
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedTab(-1);
    setIsLoginPage(false);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
  };

  const handleSuccessfulLogin = (fetchedUsername) => {
    setIsLoggedIn(true);
    setSelectedTab(1); // Change the default tab to 1 (Dashboard) after successful login
    setIsLoginPage(false);

    localStorage.setItem("isLoggedIn", "true");
    setUsername(fetchedUsername);
    localStorage.setItem("username", fetchedUsername);
  };

  const pageNames = [
    {
      label: "Home",
      icon: <HomeIcon />,
      component: <Home onLoginClick={handleLoginClick} />,
    },
    {
      label: "Dashboard",
      icon: <DashboardIcon />,
      component: <MainDashboard />,
    },
    {
      label: "Client Information",
      icon: <PersonIcon />,
      component: <ClientDetails />,
    },
    {
      label: "Task Management",
      icon: <AssignmentIcon />,
      component: <TaskManagement />,
    },
    { label: "Configuration", icon: <SettingsIcon />, component: <Settings /> },
  ];

  const renderContent = () => {
    if (isLoginPage) {
      return <Login onLogin={handleSuccessfulLogin} />;
    }

    if (!isLoggedIn) {
      return <Home onLoginClick={handleLoginClick} />;
    }

    return pageNames[selectedTab].component;
  };

  return (
    <div className="App">
      <CssBaseline />
      <Drawer
        anchor="left"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <div>
          <IconButton onClick={() => setOpenDrawer(false)}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          {pageNames.map((page, index) => (
            <ListItem
              button
              key={index}
              onClick={() => {
                setSelectedTab(index);
                setOpenDrawer(false);
              }}
            >
              <ListItemIcon>{page.icon}</ListItemIcon>
              <ListItemText primary={page.label} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <div style={{ position: "absolute", bottom: 0, left: 16, padding: 16 }}>
          {isLoggedIn && (
            <Typography variant="subtitle1">Welcome, {username}</Typography>
          )}
          {isLoggedIn ? (
            <Button variant="contained" color="primary" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleLoginClick}
            >
              Login
            </Button>
          )}
        </div>
      </Drawer>
      <AppBar position="static" sx={{ backgroundColor: "#2196f3" }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpenDrawer(true)}
            sx={{ mr: 3 }}
          >
            <MenuIcon />
          </IconButton>
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo} // Replace with your logo URL
              alt="Logo"
              height="70" // Adjust the height as needed
              style={{ marginRight: "10px" }} // Add some spacing between logo and title
            />
            <Typography
              variant="h6"
              sx={{ flexGrow: 1, textAlign: "center", color: "black" }}
            >
              KM CASTILLO Tax and Accounting Services
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <main>
        <div className="container pt-4">
          <section className="mb-4">
            <div className="card">
              <div className="card-body">{renderContent()}</div>
            </div>
          </section>
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2023 KM CASTILLO TAX AND ACCOUNTING SERVICES</p>
      </footer>
    </div>
  );
}

export default App;
