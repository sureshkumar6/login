import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Using the same CSS as Login

const SignUp = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [adminCode, setAdminCode] = useState(""); // New State for Admin Code
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    const auth = localStorage.getItem("user");
    if (auth) {
      navigate("/");
    }
  }, []);

  const collectData = async (e) => {
    e.preventDefault(); // Prevent form refresh

    if (!name || !email || !password || !adminCode) {
      alert("Please fill in all fields");
      return;
    }

    if (adminCode !== "888888") {
      alert("Incorrect Admin Code! Please enter the correct Admin Code.");
      return;
    }

    let result = await fetch(`${API_BASE_URL}/register`, {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    result = await result.json();

    if (result.error) {
      alert(result.error); // Show alert if email is already taken
    } else {
      localStorage.setItem("user", JSON.stringify(result));
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
                    type="email"
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

                {/* Admin Code Input */}
                <div className="inputBox mb-3">
                  <i className="fas fa-lock"></i>
                  <input
                    type="text"
                    value={adminCode}
                    onChange={(e) => setAdminCode(e.target.value)}
                    placeholder="Enter Admin Code"
                    required
                  />
                </div>

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
