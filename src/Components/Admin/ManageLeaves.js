import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageLeaves.css"; // Add styling as needed

const ManageLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  const fetchAllLeaves = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/leave-requests`);
      setLeaveRequests(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.patch(`${API_BASE_URL}/leave-requests/${id}`, { status: newStatus });
      alert(`Leave request ${newStatus.toLowerCase()} successfully!`);
      fetchAllLeaves(); // Refresh data
    } catch (error) {
      console.error("Error updating leave request status:", error);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/leave-requests/${id}`);
      alert("Leave request deleted successfully!");
      fetchAllLeaves();
    } catch (error) {
      console.error("Error deleting leave request:", error);
      alert("Failed to delete leave request.");
    }
  };

  return (
    <div className="manage-leaves">
      <h1>Manage Leave Requests</h1>

      <table className="leave-table">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Email</th>
            <th>Leave Type</th>
            <th>From</th>
            <th>To</th>
            <th>Specific Time</th>
            <th>Reason</th>
            <th>Applied Date</th>
            <th>Compensation</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.length > 0 ? (
            leaveRequests.map((leave, index) => (
              <tr key={leave._id}>
                <td>{index + 1}</td>
                <td>{leave.email}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.fromDate || "N/A"}</td>
                <td>{leave.toDate || "N/A"}</td>
                <td>{leave.specificTime || "N/A"}</td>
                <td>{leave.leaveReason}</td>
                <td>{leave.requestDate}</td>
                <td>{leave.compensationOption}</td>
                <td className={leave.status === "Accepted" ? "status-accepted" : leave.status === "Rejected" ? "status-rejected" : "status-pending"}>
                  {leave.status || "Pending"}
                </td>
                <td>
                  <button className="accept-btn" onClick={() => handleStatusChange(leave._id, "Accepted")}>Accept</button>
                  <button className="reject-btn" onClick={() => handleStatusChange(leave._id, "Rejected")}>Reject</button>
                  <button className="delete-btn" onClick={() => handleDelete(leave._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11">No leave requests found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ManageLeaves;
