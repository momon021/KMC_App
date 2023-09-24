import { useState } from "react"; // Import useState, but no need to import React

import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

import Dashboard from './components/Dashboard';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import "./styles/Tab.css";


function App() {
  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };


  return (
    <div className="content">
      <div className="top-tab">
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab label="Client Dashboard" />
          <Tab label="Task Dashboard" />
          <Tab label="Client" />
          <Tab label="Task List" />
        </Tabs>

        {selectedTab === 0 && <Dashboard />}
        {selectedTab === 1 && <Dashboard />}
        {selectedTab === 2 && <TaskList />}
        {selectedTab === 3 && <TaskForm />}
      </div>
    </div>
  );
}

export default App;
