import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Using the same CSS as Login

const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Employee"); // Default role: Employee
  const [adminCode, setAdminCode] = useState(""); // Required only if registering as Admin
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);

  const collectData = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    let isAdmin = role === "Admin"; // If "Admin" is selected, set isAdmin to true

    if (isAdmin && adminCode !== "888888") {
      alert("Incorrect Admin Code! Please enter the correct Admin Code.");
      return;
    }

    let result = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      body: JSON.stringify({ name, email, password, isAdmin }), // Send isAdmin
      headers: { "Content-Type": "application/json" },
    });

    result = await result.json();

    if (result.error) {
      alert(result.error);
    } else {
      const userData = {
        name,
        email,
        employeeId: result.employeeId,
        isAdmin: result.isAdmin, // Store isAdmin status
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("employeeId", result.employeeId);
      localStorage.setItem("isAdmin", result.isAdmin); // Save admin status

      navigate("/");
    }
  };

  return (
    <div className="login center-content">
      <div className="auth-box">
        <div className="loginform">
          <div className="logo">
            <img src="/saasoa_logo_b.png" alt="Company Logo" className="logo" />
            <h5 className="textUnderLogo">Sign Up</h5>
          </div>
          <div className="loginsys">
            <div className="col-12">
              <form className="loginform" onSubmit={collectData}>
                {/* Name Input */}
                <div className="inputBox mb-3">
                  <i className="fas fa-user"></i>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Name"
                    required
                  />
                </div>

                {/* Email Input */}
                <div className="inputBox mb-3">
                  <i className="fas fa-envelope"></i>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="inputBox mb-3">
                  <i className="fas fa-key"></i>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                    required
                  />
                </div>

                {/* Role Selection */}
                <div className="inputBox mb-3">
                  <i className="fas fa-user-tag"></i>
                  <select value={role} onChange={(e) => setRole(e.target.value)} required>
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                {/* Admin Code Input (Only shown if Admin is selected) */}
                {role === "Admin" && (
                  <div className="inputBox mb-3">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="Enter Admin Code"
                      required={role === "Admin"}
                    />
                  </div>
                )}

                <button className="LoginBtn" type="submit">
                  Submit
                </button>
              </form>

              {/* Login Option */}
              <p className="register-link">
                Already have an account?{" "}
                <span onClick={() => navigate("/login")} className="register-btn">
                  Login
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
