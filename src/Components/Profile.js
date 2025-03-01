import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false); // Track password change state
  const [editedDetails, setEditedDetails] = useState({
    dob: "",
    gender: "",
    maritalStatus: "",
  });
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const email = user?.email;
  const API_BASE_URL = "http://localhost:6060";

  useEffect(() => {
    if (user && !employeeDetails) {
      axios
        .get(`${API_BASE_URL}/employee-details?email=${user.email}`)
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
        .catch((error) => console.error("Error fetching employee details:", error));
    }
  }, [user, employeeDetails]);

  if (!email) {
    console.error("User email not found in localStorage");
    return;
  }

  const handleEdit = () => setIsEditing(true);
  const handlePasswordChange = () => setIsChangingPassword(true);

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
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSavePassword = async () => {
    const { oldPassword, newPassword, confirmPassword } = passwordDetails;

    if (!oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirmation do not match.");
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/change-password`, {
        email: user.email,
        oldPassword,
        newPassword,
      });
      if (response.data.success) {
        alert("Password changed successfully!");
        setPasswordDetails({ oldPassword: "", newPassword: "", confirmPassword: "" });
        setIsChangingPassword(false);
      } else {
        alert(response.data.message || "Failed to change password.");
      }
      console.log(response.data.message);
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    }
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

        {/* Change Password Section */}
        <h2>Change Password</h2>
        {!isChangingPassword ? (
          <button className="change-password-button" onClick={handlePasswordChange}>Change Password</button>
        ) : (
          <div className="password-change-form">
            <input
              type="password"
              name="oldPassword"
              placeholder="Enter Old Password"
              value={passwordDetails.oldPassword}
              onChange={handlePasswordInputChange}
            />
            <input
              type="password"
              name="newPassword"
              placeholder="Enter New Password"
              value={passwordDetails.newPassword}
              onChange={handlePasswordInputChange}
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={passwordDetails.confirmPassword}
              onChange={handlePasswordInputChange}
            />
            <button className="save-password-button" onClick={handleSavePassword}>Save Password</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
