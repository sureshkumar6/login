import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Button, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete"; // Import delete icon
import "./Announcements.css";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

const Announcements = ({ onClose }) => {
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState([]);

  // Fetch existing announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/announcements`);
        setAnnouncements(response.data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
      }
    };
    fetchAnnouncements();
  }, []);

  // Handle new announcement submission
  const handleSubmit = async () => {
    if (!announcement.trim()) return;

    try {
      const newAnnouncement = { message: announcement, date: new Date().toISOString() };
      const response = await axios.post(`${API_BASE_URL}/announcements`, newAnnouncement);

      setAnnouncements([response.data, ...announcements]); // Update UI instantly
      setAnnouncement("");
    } catch (error) {
      console.error("Error posting announcement:", error);
    }
  };

  // Handle Delete Announcement
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/announcements/${id}`);
      setAnnouncements(announcements.filter((item) => item._id !== id)); // Update UI instantly
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div className="modal">
      <Box className="modal-content">
        <Typography variant="h6" align="center">📢 Make an Announcement</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Enter Announcement"
            variant="outlined"
            fullWidth
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            sx={{ my: 2 }}
            required
          />
          
          <Button variant="contained" color="primary" fullWidth type="submit">
            Post Announcement
          </Button>
          <Button variant="outlined" color="secondary" fullWidth onClick={onClose} sx={{ mt: 2 }}>
            Cancel
          </Button>
        </form>

        <Typography variant="subtitle1" sx={{ mt: 3 }}>Previous Announcements:</Typography>
        <List>
          {announcements.map((item) => (
            <ListItem key={item._id} divider secondaryAction={
              <IconButton edge="end" color="error" onClick={() => handleDelete(item._id)}>
                <DeleteIcon />
              </IconButton>
            }>
              <ListItemText primary={item.message} secondary={new Date(item.date).toLocaleDateString()} />
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );
};

export default Announcements;
