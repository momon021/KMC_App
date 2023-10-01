import React, { useState, useEffect } from "react";
import "./styles/myApp.css"; // Import your CSS file here
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./components/Login.js"; // Import the Login component
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button"; // Import the Button component

import MainDashboard from "./components/Dashboard.js";
import ClientDetails from "./components/ClientDetails.js";
import TaskManagement from "./components/TaskManagement.js";
import Settings from "./components/Settings.js";
import Home from "./components/Home.js";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoginPage, setIsLoginPage] = useState(false);
  const [username, setUsername] = useState(""); // Added state for username

  const pageNames = [
    "Dashboard",
    "Client Information",
    "Task Management",
    "Settings",
  ];

  // Check local storage for login state and username on initial load
  useEffect(() => {
    const storedLoginState = localStorage.getItem("isLoggedIn");
    const storedUsername = localStorage.getItem("username");

    if (storedLoginState) {
      setIsLoggedIn(true);
    }

    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLoginClick = () => {
    setIsLoginPage(true);
    setSelectedTab(-1);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedTab(-1);
    setIsLoginPage(false);

    // Clear login state and username in local storage when logged out
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
  };

  const handleSuccessfulLogin = (fetchedUsername) => {
    setIsLoggedIn(true);
    setSelectedTab(0);
    setIsLoginPage(false);

    // Set login state in local storage when logged in
    localStorage.setItem("isLoggedIn", "true");

    // Set the username received from the Login component
    setUsername(fetchedUsername);

    // Set the username in local storage
    localStorage.setItem("username", fetchedUsername);
  };

  const renderContent = () => {
    if (isLoginPage) {
      return <Login onLogin={handleSuccessfulLogin} />;
    }

    if (!isLoggedIn) {
      return <Home onLoginClick={handleLoginClick} />;
    }

    switch (selectedTab) {
      case 0:
        return <MainDashboard />;
      case 1:
        return <ClientDetails />;
      case 2:
        return <TaskManagement />;
      case 3:
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <CssBaseline />
      <header>
        <AppBar position="static">
          <Toolbar>
            <div className="logo-container">
              <Typography variant="h6">
                KM CASTILLO TAX AND ACCOUNTING SERVICES
              </Typography>
            </div>
            <div className="ml-auto">
              <ul className="navbar-nav">
                {pageNames.map((page, index) => (
                  <li className="nav-item" key={index}>
                    <a
                      className={`nav-link ${selectedTab === index ? "active" : ""
                        }`}
                      href="#!"
                      onClick={() => setSelectedTab(index)}
                    >
                      {page}
                    </a>
                  </li>
                ))}
                {isLoggedIn ? (
                  <li className="nav-item">
                    <Button variant="contained" color="primary" onClick={handleLogout}>
                      Logout
                    </Button>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Button variant="contained" color="primary" onClick={handleLoginClick}>
                      Login
                    </Button>
                  </li>
                )}
              </ul>
            </div>
            {isLoggedIn && (
              <div className="ml-auto">
                <Typography variant="h6">Welcome, {username}</Typography>
              </div>
            )}
          </Toolbar>
        </AppBar>
      </header>
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
