import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeaveManagement.css"; // Optional: Styling

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  // Retrieve logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.email) {
      fetchLeaves(storedUser.email);
    }
  }, []); // ✅ Empty dependency array ensures it runs only once
  


  const fetchLeaves = async (email) => {
    if (!email) {
      console.error("User email not found!");
      return;
    }
  
    try {
      const response = await axios.get(`${API_BASE_URL}/leave-requests?email=${email}`);
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };
  
  

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/leave-requests/${id}`);
      alert("Leave request deleted successfully!");
      fetchLeaves();
    } catch (error) {
      console.error("Error deleting leave request:", error);
      alert("Failed to delete leave request.");
    }
  };
    // const handleEdit = (leave) => {
  //   const updatedReason = prompt("Edit Leave Reason:", leave.leaveReason);
  //   if (!updatedReason) return;
  
  //   axios.put(`${API_BASE_URL}/leave-requests/${leave._id}`, { leaveReason: updatedReason })
  //     .then(() => {
  //       alert("Leave request updated successfully!");
  //       fetchLeaves();
  //     })
  //     .catch((error) => {
  //       console.error("Error updating leave request:", error);
  //       alert("Failed to update leave request.");
  //     });
  // };

  return (
    <div className="leave-management">
      <h1>Manage Leaves</h1>
      
      <table className="leave-table">
        <thead>
          <tr>
            <th>S.No</th>
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
          {leaves.length > 0 ? (
            leaves.map((leave, index) => (
              <tr key={leave._id}>
                <td>{index + 1}</td>
                <td>{leave.leaveType}</td>
                <td>{leave.fromDate || "N/A"}</td>
                <td>{leave.toDate || "N/A"}</td>
                <td>{leave.specificTime || "N/A"}</td>
                <td>{leave.leaveReason}</td>
                <td>{leave.requestDate}</td>
                <td>{leave.compensationOption}</td>
                <td className={leave.status === "Accepted" ? "status-accepted" : "status-rejected"}>
                  {leave.status || "Pending"}
                </td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(leave._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">No leave requests found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveManagement;
