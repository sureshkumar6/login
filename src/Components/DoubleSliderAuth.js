import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ParticlesBackground from "./ParticlesBackground.js"; 
// import Polygonmaskparticle from "./Polygonmaskparticle.js";
import "./DoubleSliderAuth.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

const DoubleSliderAuth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (result.employeeId) {
        const userData = {
          name: result.name,
          email: result.email,
          employeeId: result.employeeId,
          isAdmin: result.isAdmin,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("employeeId", result.employeeId);
        
        console.log("isAdmin received from API:", result.isAdmin); // Debugging line
        
        const isAdmin = Boolean(result.isAdmin); // Ensure correct boolean conversion
        localStorage.setItem("admin", JSON.stringify(isAdmin));

        navigate(isAdmin ? "/admin" : "/");
      } else {
        alert("Invalid email or password");
      }
  } catch (error) {
    console.error("Login error:", error);
    alert("Something went wrong. Please try again.");
  }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (isAdmin && adminCode !== "888888") {
      alert("Invalid admin code.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        body: JSON.stringify({ name, email, password, isAdmin }),
        headers: { "Content-Type": "application/json" },
      });

      const result = await response.json();
      if (result.error) {
        alert(result.error);
      } else {
        localStorage.setItem("user", JSON.stringify(result));
        localStorage.setItem("admin", JSON.stringify(result.isAdmin));
        navigate(result.isAdmin ? "/admin" : "/");
      }
    } catch (error) {
      alert("Signup failed");
    }
  };

  return (
    <div className="loginBody">

    
    <div className="auth-wrapper">
      <ParticlesBackground />
      {/* <Polygonmaskparticle /> */}
      
    <div className={`auth-container ${isSignUp ? "right-panel-active" : ""}`} id="auth-container">
      {/* Signup Form */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSignup}>
          <img src="/saasoa_logo_b.png" alt="Company Logo" className="logo" />
          <h1>Register</h1>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label>
            <input type="checkbox" checked={isAdmin} onChange={() => setIsAdmin(!isAdmin)} /> Register as Admin
          </label>
          {isAdmin && <input type="password" placeholder="Admin Code" value={adminCode} onChange={(e) => setAdminCode(e.target.value)} required />}
          <button className="authButton" type="submit">Sign Up</button>
        </form>
      </div>

      {/* Login Form */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleLogin}>
          <img src="/saasoa_logo_b.png" alt="Company Logo" className="logo" />
          <h1>Sign in</h1>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="authButton" type="submit">Sign In</button>
        </form>
      </div>

      {/* Overlay */}
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To stay connected, please login</p>
            <button className="ghost" onClick={toggleForm}>Sign In</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello!</h1>
            <p>Enter your details and start Tracking Your Activities</p>
            <button className="ghost" onClick={toggleForm}>Sign Up</button>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default DoubleSliderAuth;
