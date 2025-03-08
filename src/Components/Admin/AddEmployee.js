import React, { useState } from "react";
import axios from "axios";
import "./AddEmployee.css"; // Add styling

const AddEmployee = ({ onClose, onEmployeeAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // Default password
  const [profilePic, setProfilePic] = useState("");
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name,
        email,
        password,
        profilePic,
        isAdmin: false,
      });

      if (response.data.error) {
        alert(response.data.error);
      } else {
        alert("Employee Added Successfully!");
        onEmployeeAdded(response.data); // Update parent state
        onClose(); // Close modal
      }
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Error adding employee, please try again.");
    }
  };
//<input type="text" placeholder="Profile Picture URL (Optional)" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} /> // for profile pic
  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Add New Employee</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          <button type="submit">Add Employee</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default AddEmployee;
