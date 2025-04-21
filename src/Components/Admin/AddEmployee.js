import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography } from "@mui/material";
import "./AddEmployee.css"; // Keep your styles for modal effect

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

const AddEmployee = ({ onClose, onEmployeeAdded }) => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name,
        lastName,
        email,
        password,
        profilePic,
        isAdmin: false,
      });

      if (response.data.error) {
        alert(response.data.error);
      } else {
        alert("Employee Added Successfully!");
        onEmployeeAdded(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Error adding employee, please try again.");
    }
  };

  return (
    <div className="modal">
      <Box className="modal-content">
        <Typography variant="h6" align="center">
          👤 Add New Employee
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ my: 1 }}
            required
          />
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ my: 1 }}
          />

          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ my: 1 }}
            required
          />
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ my: 1 }}
            required
          />
          <TextField
            label="Profile Picture URL (Optional)"
            variant="outlined"
            fullWidth
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            sx={{ my: 1 }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
            sx={{ mt: 2 }}
          >
            Add Employee
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={onClose}
            sx={{ mt: 2 }}
          >
            Cancel
          </Button>
        </form>
      </Box>
    </div>
  );
};

export default AddEmployee;
