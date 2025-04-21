import React, { useState, useEffect } from "react";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LockResetIcon from "@mui/icons-material/LockReset"; // Change Password
import InfoIcon from "@mui/icons-material/Info"; // Personal Information
import ContactMailIcon from "@mui/icons-material/ContactMail"; // Contact Information
import SaveIcon from "@mui/icons-material/Save"; // Save
import EditIcon from "@mui/icons-material/Edit"; // Edit

import {
  Modal,
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import "./Profile.css";
import AnimatedBackground from "./AnimatedBackground.js";
import NeatBackground from "./NeatBackground.js";

const Profile = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    name: "",
    lastName: "",
    dob: "",
    gender: "",
    maritalStatus: "",
    nationality: "",
    phone: "",
    address: "",
    email: user?.email || "",
  });
  const [passwordDetails, setPasswordDetails] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
    nationality: "",
    phone: "",
    address: "",
  });

  const email = user?.email;
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    if (user && !employeeDetails) {
      axios
        .get(`${API_BASE_URL}/employee-details?email=${user.email}`)
        .then((response) => {
          if (response.data) {
            setEmployeeDetails(response.data);
            setEditedDetails({
              name: response.data.name || "",
              lastName: response.data.lastName || "",
              dob: response.data.dob || "",
              gender: response.data.gender || "",
              maritalStatus: response.data.maritalStatus || "",
              nationality: response.data.nationality || "",
              phone: response.data.phone || "",
              address: response.data.address || "",
              email: response.data.email || user?.email || "",
            });
          }
        })
        .catch((error) =>
          console.error("Error fetching employee details:", error)
        );
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
      console.log(response);
      setEmployeeDetails(response.data.updatedEmployee);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  };
  //images upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);
    formData.append("email", user.email);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload-profile-picture`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setEmployeeDetails((prev) => ({
        ...prev,
        profilePicture: response.data.profilePicture,
      }));
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
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
        setPasswordDetails({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsChangingPassword(false);
      } else {
        alert(response.data.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      alert("Failed to change password. Please try again.");
    }
  };

  if (!employeeDetails) {
    return (
      <Typography variant="h5" align="center">
        Loading employee details...
      </Typography>
    );
  }

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <div className="profileContainer">
      {/* <AnimatedBackground/> */}
      <NeatBackground />
      <div className="profieWrapper">
        <div className="profilePicWrapper">
          <div className="imageHoverContainer">
            <CardMedia
              component="img"
              className="profile-pic"
              image={employeeDetails.profilePicture || "/default-profile.jpg"}
              alt="Profile Picture"
            />
            <div className="customUploadBtn">
              <CameraAltIcon fontSize="medium" />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="uploadInput"
              />
            </div>
          </div>
        </div>

        <div className="employeeCard">
          <h2 className="employeeName">{employeeDetails.name}</h2>
          <p className="employeeId">
            Employee ID: {employeeDetails.employeeId}
          </p>

          {/* Add horizontal line */}
          <hr className="employeeCardLine" />

          <div className="employeeCardInfo">
            <div>
              <p className="employeeLabel">Department</p>
              <p className="employeeValue">Support Team</p>
            </div>
            <div>
              <p className="employeeLabel">Joining Date</p>
              <p className="employeeValue">12/12/12</p>
            </div>
          </div>
        </div>

        <div className="passwordChangeDiv">
          <Modal open={openModal} onClose={() => setOpenModal(false)}>
            <Box sx={modalStyle}>
              <Typography variant="h6" gutterBottom>
                Change Password
              </Typography>
              <TextField
                fullWidth
                type="password"
                name="oldPassword"
                label="Old Password"
                value={passwordDetails.oldPassword}
                onChange={handlePasswordInputChange}
                margin="dense"
              />
              <TextField
                fullWidth
                type="password"
                name="newPassword"
                label="New Password"
                value={passwordDetails.newPassword}
                onChange={handlePasswordInputChange}
                margin="dense"
              />
              <TextField
                fullWidth
                type="password"
                name="confirmPassword"
                label="Confirm New Password"
                value={passwordDetails.confirmPassword}
                onChange={handlePasswordInputChange}
                margin="dense"
              />
              <Button
                variant="contained"
                color="success"
                fullWidth
                sx={{ mt: 2 }}
                onClick={handleSavePassword}
              >
                Save Password
              </Button>
            </Box>
          </Modal>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => setOpenModal(true)}
            startIcon={<LockResetIcon />}
          >
            Change Password
          </Button>
        </div>
      </div>
      <div item xs={12} sm={8} className="rightCards">
        <div className="personalContainer">
          <h2 className="h2Heading">
            {" "}
            <InfoIcon
              style={{
                color: "#007bff",
                verticalAlign: "middle",
                marginRight: 8,
              }}
            />{" "}
            Personal Information
          </h2>
          <div className="allInputFeild">
            <TextField
              label="First Name"
              name="name"
              value={editedDetails.name || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <TextField
              label="Last Name"
              name="lastName"
              value={editedDetails.lastName || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              name="dob"
              value={editedDetails.dob}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              disabled={!isEditing}
              margin="dense"
            />
            <FormControl
              component="fieldset"
              margin="dense"
              fullWidth
              disabled={!isEditing}
            >
              <FormLabel component="legend">Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={editedDetails.gender}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="Male"
                  control={<Radio />}
                  label="Male"
                />
                <FormControlLabel
                  value="Female"
                  control={<Radio />}
                  label="Female"
                />
                <FormControlLabel
                  value="Other"
                  control={<Radio />}
                  label="Other"
                />
              </RadioGroup>
            </FormControl>
            <Select
              fullWidth
              name="maritalStatus"
              value={editedDetails.maritalStatus}
              onChange={handleChange}
              disabled={!isEditing}
              displayEmpty
              margin="dense"
            >
              <MenuItem value="">Select Marital Status</MenuItem>
              <MenuItem value="Single">Single</MenuItem>
              <MenuItem value="Married">Married</MenuItem>
              <MenuItem value="Divorced">Divorced</MenuItem>
              <MenuItem value="Widowed">Widowed</MenuItem>
            </Select>
            <TextField
              label="Nationality"
              name="Nationality"
              value={editedDetails.Nationality || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        <div className="contactContainer">
          <h2 className="h2Heading">
            {" "}
            <ContactMailIcon
              style={{
                color: "#007bff",
                verticalAlign: "middle",
                marginRight: 8,
              }}
            />
            Contact Information
          </h2>
          <div className="allInputFeild ">
            <TextField
              label="Email Address"
              name="email"
              value={editedDetails.email || ""}
              onChange={handleChange}
              disabled
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={editedDetails.phone || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
            <TextField
              label="Address"
              name="address"
              value={editedDetails.address || ""}
              onChange={handleChange}
              disabled={!isEditing}
            />
          </div>
        </div>

        {isEditing ? (
          <Button
            variant="contained"
            color="success"
            fullWidth
            onClick={handleSave}
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleEdit}
            startIcon={<EditIcon />}
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default Profile;
