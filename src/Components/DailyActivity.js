import React, { useState, useEffect } from "react";
import axios from "axios";
import NeatBackground from "./NeatBackground.js";
import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import "./DailyActivity.css";

const DailyActivity = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [activities, setActivities] = useState([]);
  const [newActivity, setNewActivity] = useState({
    date: "",
    work: "",
    subWorkType: "",
    sheekLink: "",
    startTime: "",
    endTime: "",
    employeeName: user?.name || "",
  });
  const [isLocked, setIsLocked] = useState(localStorage.getItem("isLocked") === "true");

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    if (user) {
      axios.get(`${API_BASE_URL}/daily-activity?email=${user.email}`)
        .then(response => {
          setActivities(response.data);

          const ongoingActivity = response.data.find(activity => !activity.endTime);
          if (ongoingActivity) {
            setIsLocked(true);
            setNewActivity(prev => ({
              ...prev,
              date: ongoingActivity.date,
              work: ongoingActivity.work,
              subWorkType: ongoingActivity.subWorkType,
              sheekLink: ongoingActivity.sheekLink,
              startTime: ongoingActivity.startTime,
              endTime: prev.endTime || "",
            }));
            localStorage.setItem("ongoingActivity", JSON.stringify(ongoingActivity));
            localStorage.setItem("isLocked", "true");
          } else {
            setIsLocked(false);
            localStorage.removeItem("ongoingActivity");
            localStorage.removeItem("isLocked");
          }
        })
        .catch(error => console.error("Error fetching activities:", error));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewActivity({ ...newActivity, [name]: value });
  };

  const handleSaveStartTime = async (e) => {
    e.preventDefault();
    if (!newActivity.date || !newActivity.work || !newActivity.subWorkType || !newActivity.sheekLink || !newActivity.startTime) {
      alert("Please fill all fields except End Time!");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/daily-activity`, {
        email: user.email,
        employeeName: user.name,
        ...newActivity,
        endTime: null,
      });

      alert("Start time saved! You can enter End Time when work is done.");
      setActivities([...activities, { ...newActivity, endTime: null }]);
      setIsLocked(true);
      localStorage.setItem("ongoingActivity", JSON.stringify(newActivity));
      localStorage.setItem("isLocked", "true");
    } catch (error) {
      console.error("Error saving activity:", error);
      alert("Failed to save activity");
    }
  };

  const handleSaveEndTime = async (e) => {
    e.preventDefault();
    if (!newActivity.endTime) {
      alert("Please enter End Time before saving!");
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/daily-activity/update-end-time`, {
        email: user.email,
        date: newActivity.date,
        endTime: newActivity.endTime,
      });

      alert("End time saved successfully!");
      setActivities(activities.map(activity =>
        activity.date === newActivity.date ? { ...activity, endTime: newActivity.endTime } : activity
      ));

      setNewActivity({ date: "", work: "", subWorkType: "", sheekLink: "", startTime: "", endTime: "" });
      setIsLocked(false);
      localStorage.removeItem("ongoingActivity");
      localStorage.removeItem("isLocked");
    } catch (error) {
      console.error("Error updating end time:", error);
      alert("Failed to update end time");
    }
  };

  return (
    <div>
      <NeatBackground/>
      {/* <h2>Daily Activity Log</h2> */}
      <div className="dailyActivityForm">
        <TextField
          label="Date"
          type="date"
          name="date"
          value={newActivity.date}
          onChange={handleChange}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
          disabled={isLocked}
        />
        <TextField
          label="Work Description"
          type="text"
          name="work"
          value={newActivity.work}
          onChange={handleChange}
          required
          fullWidth
          disabled={isLocked}
        />
        <TextField
          label="Sub Work Type"
          type="text"
          name="subWorkType"
          value={newActivity.subWorkType}
          onChange={handleChange}
          required
          fullWidth
          disabled={isLocked}
        />
        <TextField
          label="Sheek Link"
          type="text"
          name="sheekLink"
          value={newActivity.sheekLink}
          onChange={handleChange}
          required
          fullWidth
          disabled={isLocked}
        />
        <TextField
          label="Start Time"
          type="time"
          name="startTime"
          value={newActivity.startTime}
          onChange={handleChange}
          required
          fullWidth
          InputLabelProps={{ shrink: true }}
          disabled={isLocked}
        />

        {!isLocked && (
          <Button  className="saveBtn" variant="contained" color="primary" onClick={handleSaveStartTime}>
            Save Start Time
          </Button>
        )}

        {isLocked && (
          <>
            <TextField
              label="End Time"
              type="time"
              name="endTime"
              value={newActivity.endTime}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <Button variant="contained" color="secondary" onClick={handleSaveEndTime}>
              Save End Time
            </Button>
          </>
        )}
      </div>

      <h3 className="mt-6">Previous Activities</h3>
      <div className="table-wrap">
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table stickyHeader className="table">
              <TableHead className="thead-primary">
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Work Description</TableCell>
                  <TableCell>Sub Work Type</TableCell>
                  <TableCell>Sheek Link</TableCell>
                  <TableCell>Start Time</TableCell>
                  <TableCell>End Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {activities.map((activity, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{activity.date}</TableCell>
                    <TableCell>{activity.work}</TableCell>
                    <TableCell>{activity.subWorkType}</TableCell>
                    <TableCell>
                      <a href={activity.sheekLink} target="_blank" rel="noopener noreferrer">
                        Open
                      </a>
                    </TableCell>
                    <TableCell>{activity.startTime}</TableCell>
                    <TableCell>{activity.endTime || "Not yet completed"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </div>
    </div>
  );
};

export default DailyActivity;
