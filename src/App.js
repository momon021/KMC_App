import React, { useState } from "react";
import "./styles/Tab.css"; // Import your CSS file here
import CssBaseline from "@mui/material/CssBaseline";
import Login from "./components/Login.js"; // Import the Login component
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

// Import your new components for additional menu items
import MainDashboard from "./components/Dashboard.js";
import ClientDetails from "./components/ClientDetails.js";
import TaskManagement from "./components/TaskManagement.js";
import Analytics from "./components/Analytics.js";
import SEO from "./components/SEO.js";
import Settings from "./components/Settings.js";

function App() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Add a login state

  const pageNames = [
    "Dashboard",
    "Client Information",
    "Task Management",
    "Analytics",
    "SEO",
    "Settings",
  ];

  const handleLogin = () => {
    // Perform your login logic here
    // If login is successful, update the isLoggedIn state to true
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    // Perform logout actions, such as clearing user data or tokens

    // Update the isLoggedIn state to indicate the user is logged out
    setIsLoggedIn(false);
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      // Render the Login component if the user is not logged in
      return <Login onLogin={handleLogin} />;
    }

    // Render the content based on selectedTab if the user is logged in
    switch (selectedTab) {
      case 0:
        return <MainDashboard />;
      case 1:
        return <ClientDetails />;
      case 2:
        return <TaskManagement />;
      case 3:
        return <Analytics />;
      case 4:
        return <SEO />;
      case 5:
        return <Settings />;
      // Add cases for other menu items you created
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <CssBaseline />
      <header>
        {/* Top Navbar */}
        <nav
          id="main-navbar"
          className="navbar navbar-expand-lg navbar-light bg-light"
        >
          <div className="container-fluid">
            <a className="navbar-brand" href="#!">
              <img
                src="https://mdbootstrap.com/img/logo/mdb-transaprent-noshadows.png"
                height="25"
                alt="MDB Logo"
                loading="lazy"
              />
            </a>

            <div className="ml-auto">
              <ul className="navbar-nav">
                {/* Align the navbar to the right */}
                {pageNames.map((page, index) => (
                  <li className="nav-item" key={index}>
                    <a
                      className={`nav-link ${
                        selectedTab === index ? "active" : ""
                      }`}
                      href="#!"
                      onClick={() => setSelectedTab(index)}
                    >
                      {page}
                    </a>
                  </li>
                ))}
                <li className="nav-item">
                  <button className="nav-link" onClick={handleLogout}>
                    Logout <ExitToAppIcon />
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        {/* End Top Navbar */}
      </header>
      <main>
        <div className="container pt-4">
          <section className="mb-4">
            <div className="card">
              <div className="card-body">{renderContent()}</div>
            </div>
          </section>
          {/* Other sections */}
        </div>
      </main>
    </div>
  );
}

export default App;
