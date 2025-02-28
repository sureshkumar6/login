import React, { useState, useEffect } from "react";
import axios from "axios";
import './Profile.css';

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    dob: "",
    gender: "",
    maritalStatus: "",
  });
  const email = user?.email;
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    if (user && !employeeDetails) {  // Only set details if they haven't been set already
      axios.get(`${API_BASE_URL}/employee-details?email=${user.email}`)
        .then((response) => {
          if (response.data) {
            setEmployeeDetails(response.data);
            setEditedDetails({
              dob: response.data.dob || "",
              gender: response.data.gender || "",
              maritalStatus: response.data.maritalStatus || "",
            });
          }
        })
        .catch(error => console.error("Error fetching employee details:", error));
    }
  }, [user, API_BASE_URL, employeeDetails]);  // Add employeeDetails as dependency to prevent overwriting
  
  
  
  if (!email) {
    console.error("User email not found in localStorage");
    return;
  }

  const handleEdit = () => setIsEditing(true);

  const handleSave = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/employee-details`, {
        email: user.email,
        ...editedDetails,
      });
  
      setEmployeeDetails(response.data.updatedEmployee);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Updating ${name} to`, value); // Debugging output
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };
  
  
  

  if (!employeeDetails) {
    return <h2>Loading employee details...</h2>;
  }

  return (
    <div className="profile-container">
      <div className="profile-left">
        <img src={user.profilePicture || "/default-profile.jpg"} alt="Profile" className="profile-pic" />
      </div>

      <div className="profile-right">
        <h2>Employee Details</h2>
        <p><strong>Name:</strong> {employeeDetails.name}</p>
        <p><strong>Employee ID:</strong> {employeeDetails.employeeId}</p>

        <p>
          <strong>Date of Birth:</strong>
          {isEditing ? (
            <input type="date" name="dob" value={editedDetails.dob} onChange={handleChange} />
          ) : (
            employeeDetails.dob || "N/A"
          )}
        </p>

        <p>
          <strong>Gender:</strong>
          {isEditing ? (
            <select name="gender" value={editedDetails.gender} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          ) : (
            employeeDetails.gender || "N/A"
          )}
        </p>

        <p>
          <strong>Marital Status:</strong>
          {isEditing ? (
            <select name="maritalStatus" value={editedDetails.maritalStatus} onChange={handleChange}>
            <option value="">Select</option>
            <option value="Single">Single</option>
            <option value="Married">Married</option>
            <option value="Divorced">Divorced</option>
            <option value="Widowed">Widowed</option>
          </select>
          ) : (
            employeeDetails.maritalStatus || "N/A"
          )}
        </p>

        {isEditing ? (
          <button className="save-button" onClick={handleSave}>Save</button>
        ) : (
          <button className="edit-button" onClick={handleEdit}>Edit Profile</button>
        )}
      </div>
    </div>
  );
};

export default Profile;
