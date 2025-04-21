import React, { useState, useEffect } from "react";
import axios from "axios";
import NeatBackground from "./NeatBackground.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Link,
  TablePagination,
} from "@mui/material";

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
  const [isLocked, setIsLocked] = useState(
    localStorage.getItem("isLocked") === "true"
  );
  const [summaryView, setSummaryView] = useState("today"); // today | week | month

  const [page, setPage] = useState(0);
  const rowsPerPage = 5;

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    if (user) {
      axios
        .get(`${API_BASE_URL}/daily-activity?email=${user.email}`)
        .then((response) => {
          setActivities(response.data);
          const ongoing = response.data.find((act) => !act.endTime);
          if (ongoing) {
            setIsLocked(true);
            setNewActivity((prev) => ({
              ...prev,
              date: ongoing.date,
              work: ongoing.work,
              subWorkType: ongoing.subWorkType,
              sheekLink: ongoing.sheekLink,
              startTime: ongoing.startTime,
              endTime: prev.endTime || "", // Preserve any manual endTime set
            }));

            localStorage.setItem("ongoingActivity", JSON.stringify(ongoing));
            localStorage.setItem("isLocked", "true");
          } else {
            setIsLocked(false);
            localStorage.removeItem("ongoingActivity");
            localStorage.removeItem("isLocked");
          }
        })
        .catch(console.error);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewActivity({ ...newActivity, [name]: value });
  };

  const handleSaveStartTime = async () => {
    if (
      !newActivity.date ||
      !newActivity.work ||
      !newActivity.subWorkType ||
      !newActivity.sheekLink ||
      !newActivity.startTime
    ) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/daily-activity`, {
        email: user.email,
        employeeName: user.name,
        ...newActivity,
        endTime: null,
      });

      alert("Activity started!");
      setActivities([...activities, { ...newActivity, endTime: null }]);
      setIsLocked(true);
      localStorage.setItem("ongoingActivity", JSON.stringify(newActivity));
      localStorage.setItem("isLocked", "true");
    } catch (err) {
      console.error(err);
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

      alert("Activity ended!");
      setActivities(
        activities.map((act) =>
          act.date === newActivity.date
            ? { ...act, endTime: newActivity.endTime }
            : act
        )
      );
      setNewActivity({
        date: "",
        work: "",
        subWorkType: "",
        sheekLink: "",
        startTime: "",
        endTime: "",
      });
      setIsLocked(false);
      localStorage.removeItem("ongoingActivity");
      localStorage.removeItem("isLocked");
    } catch (err) {
      console.error(err);
      alert("Failed to update end time");
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  // Filter today's activities
  const getFilteredActivities = () => {
    const today = new Date();
    return activities.filter((act) => {
      const actDate = new Date(act.date);
      if (summaryView === "today") {
        return act.date === today.toISOString().split("T")[0];
      } else if (summaryView === "week") {
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return actDate >= startOfWeek && actDate <= endOfWeek;
      } else if (summaryView === "month") {
        return (
          actDate.getMonth() === today.getMonth() &&
          actDate.getFullYear() === today.getFullYear()
        );
      }
      return false;
    });
  };

  const filteredActivities = getFilteredActivities();

  const calculateTotalHours = () => {
    let totalMinutes = 0;
    filteredActivities.forEach((act) => {
      if (act.startTime && act.endTime) {
        const [startH, startM] = act.startTime.split(":").map(Number);
        const [endH, endM] = act.endTime.split(":").map(Number);
        const diff = endH * 60 + endM - (startH * 60 + startM);
        totalMinutes += diff > 0 ? diff : 0;
      }
    });
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const calculateProductivity = () => {
    let referenceMinutes = 0;
    if (summaryView === "today") referenceMinutes = 8 * 60;
    if (summaryView === "week") referenceMinutes = 8 * 60 * 5;
    if (summaryView === "month") referenceMinutes = 8 * 60 * 22; // avg working days

    let activeMinutes = 0;
    filteredActivities.forEach((act) => {
      if (act.startTime && act.endTime) {
        const [startH, startM] = act.startTime.split(":").map(Number);
        const [endH, endM] = act.endTime.split(":").map(Number);
        const diff = endH * 60 + endM - (startH * 60 + startM);
        activeMinutes += diff > 0 ? diff : 0;
      }
    });

    const productivity = Math.round((activeMinutes / referenceMinutes) * 100);
    return productivity > 100 ? 100 : productivity;
  };

  return (
    <div className="activity-page">
      <NeatBackground />
      <div className="card animate-fade-in">
        <h2 className="form-title">Log Daily Activity</h2>

        <form>
          {!isLocked ? (
            <div className="form-transition">
              <div className="grid-2">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={newActivity.date}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={newActivity.startTime}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Work Description</label>
                <input
                  type="text"
                  name="work"
                  value={newActivity.work}
                  onChange={handleChange}
                  placeholder="Enter work description"
                />
              </div>

              <div className="form-group">
                <label>Sub Work Type</label>
                <input
                  type="text"
                  name="subWorkType"
                  value={newActivity.subWorkType}
                  onChange={handleChange}
                  placeholder="Enter sub work type"
                />
              </div>

              <div className="form-group">
                <label>Sheek Link</label>
                <input
                  type="url"
                  name="sheekLink"
                  value={newActivity.sheekLink}
                  onChange={handleChange}
                  placeholder="https://example.com/sheek/123"
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveStartTime}
                >
                  Start Activity
                </button>
              </div>
            </div>
          ) : (
            <div className="form-transition">
              <div className="alert-info">
                <p>
                  You started working on <strong>{newActivity.work}</strong> at{" "}
                  <strong>{newActivity.startTime}</strong>.
                </p>
              </div>
              <div className="form-group">
                <label>End Time</label>
                <input
                  type="time"
                  name="endTime"
                  value={newActivity.endTime}
                  onChange={handleChange}
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => window.location.reload()}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSaveEndTime}
                >
                  End Activity
                </button>
              </div>
            </div>
          )}
        </form>
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
                {activities
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((activity, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{activity.date}</TableCell>
                      <TableCell>{activity.work}</TableCell>
                      <TableCell>{activity.subWorkType}</TableCell>
                      <TableCell>
                        <a
                          href={activity.sheekLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Open
                        </a>
                      </TableCell>
                      <TableCell>{activity.startTime}</TableCell>
                      <TableCell>
                        {activity.endTime || "Not yet completed"}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5]}
            component="div"
            count={activities.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
          />
        </Paper>
      </div>

      <div className="summary-card animate-fade-in delay-300">
        <div className="summaryHeading">
          <h2 className="summary-title">Today's Summary</h2>
          <div className="summary-view-selector">
            <label htmlFor="summaryView">View: </label>
            <select
              id="summaryView"
              value={summaryView}
              onChange={(e) => setSummaryView(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        <div className="summary-grid">
          <div className="summary-item indigo">
            <div className="summary-icon-wrap">
              <i className="fas fa-clock summary-icon text-indigo-600"></i>
            </div>
            <div>
              <p className="summary-label text-indigo-700">Total Hours</p>
              <p className="summary-value text-indigo-900">
                {calculateTotalHours()}
              </p>
            </div>
          </div>

          <div className="summary-item green">
            <div className="summary-icon-wrap">
              <i className="fas fa-tasks summary-icon text-green-600"></i>
            </div>
            <div>
              <p className="summary-label text-green-700">Activities</p>
              <p className="summary-value text-green-900">
                {filteredActivities.length}
              </p>
            </div>
          </div>

          <div className="summary-item blue">
            <div className="summary-icon-wrap">
              <i className="fas fa-chart-line summary-icon text-blue-600"></i>
            </div>
            <div>
              <p className="summary-label text-blue-700">Productivity</p>
              <p className="summary-value text-blue-900">
                {calculateProductivity()}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyActivity;
