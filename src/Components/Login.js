import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

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
        };

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("employeeId", result.employeeId);

        navigate("/");
      } else {
        alert("Invalid email or password");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="login center-content">
      <div className="auth-box">
        <div className="loginform">
          <div className="logo">
            <img src="/saasoa_logo_b.png" alt="Company Logo" className="logo" />
            <h5 className="textUnderLogo">Login</h5>
          </div>
          <div className="loginsys">
            <div className="col-12">
              <form className="loginform" onSubmit={handleLogin}>
                {/* Email Input */}
                <div className="inputBox mb-3">
                  <i className="fas fa-envelope"></i>
                  <input
                    // type="email"
                    placeholder="Enter Email"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                </div>

                {/* Password Input */}
                <div className="inputBox">
                  <i className="fas fa-key"></i>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                </div>

                {/* Login Button */}
                <button className="LoginBtn" type="submit">
                  Login
                </button>
              </form>

              {/* Register Option */}
              <p className="register-link">
                Don't have an account?{" "}
                <span onClick={() => navigate("/signup")} className="register-btn">
                  Register
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
