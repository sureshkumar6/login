import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Using the same CSS as Login

const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [adminCode, setAdminCode] = useState(""); // Admin verification code
  const [isAdmin, setIsAdmin] = useState(false); // Admin toggle state
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      const isAdminUser = JSON.parse(localStorage.getItem("admin") || "false");
      navigate(isAdminUser ? "/admin" : "/");
    }
  }, []);

  const collectData = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill in all fields");
      return;
    }

    // Ensure isAdmin is only granted when the correct admin code is provided
    if (isAdmin && adminCode !== "888888") {
      alert("Invalid admin code. You are not authorized to create an admin user.");
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
        alert("User successfully created!");

        // Store user details in localStorage
        const userData = {
          name: result.name,
          email: result.email,
          employeeId: result.employeeId,
        };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("employeeId", result.employeeId);
        localStorage.setItem("admin", JSON.stringify(result.isAdmin));

        // Redirect based on user role
        navigate(result.isAdmin ? "/admin" : "/");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Something went wrong. Please try again.");
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

                <div className="inputBox mb-3">
                  <i className="fas fa-envelope"></i>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                    required
                  />
                </div>

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

                {/* Admin Checkbox */}
                <div className="checkbox-container mb-3">
                  <label>
                    <input
                      type="checkbox"
                      checked={isAdmin}
                      onChange={() => setIsAdmin(!isAdmin)}
                    />
                    Register as Admin
                  </label>
                </div>

                {/* Admin Code Input (Only shown if registering as Admin) */}
                {isAdmin && (
                  <div className="inputBox mb-3">
                    <i className="fas fa-lock"></i>
                    <input
                      type="password"
                      value={adminCode}
                      onChange={(e) => setAdminCode(e.target.value)}
                      placeholder="Enter Admin Code"
                      required
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
