import React, { useState } from "react";
import { styled } from "@mui/system";
import "../styles/Login.css";
import logo from "../images/icon.png"

const Container = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  backgroundColor: "#f4f4f4",
});

const LeftSide = styled("div")({
  flex: 1,
  padding: "2rem",
  display: "none", // Hide on mobile view
  "@media (min-width: 768px)": {
    display: "block", // Display on screens wider than 768px
  },
});

const RightSide = styled("div")({
  flex: 1,
  padding: "2rem",
  backgroundColor: "#fff",
  borderRadius: "5px",
  boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const Logo = styled("img")({
  width: "100%",
  height: "auto",
  marginBottom: "2rem",
});

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = () => {
    // Send login credentials to the server
      //fetch("http://localhost:5000/api/login", {
      fetch("https://651ec833cf136800077286dd--kmcworkmanagement.netlify.app/.netlify/functions/login", {
        
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...formData }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Pass the username to the parent component
          onLogin(data.user.USERNAME);
        } else {
          // Display an error message for invalid credentials
          alert(data.error);
        }
      })
      .catch((error) => {
        console.error("Error during login:", error);
      });
  };

  return (
    <Container>
      <LeftSide>
        <Logo
          src={logo} // Replace with your image URL
          alt="Logo"
          loading="lazy"
        />
      </LeftSide>
      <RightSide>
        <h2>Login</h2>
        <form>
          <div className="mb-4">
            <label>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-4">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <button type="button" onClick={handleLogin}>
            Login
          </button>
        </form>
      </RightSide>
    </Container>
  );
}

export default Login;
