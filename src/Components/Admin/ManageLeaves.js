import React, { useState, useEffect } from "react";
import axios from "axios";
import NeatBackground from "../NeatBackground.js";
import "./ManageLeaves.css";
import { CheckCircle, Cancel, Delete } from "@mui/icons-material";
import { IconButton, TablePagination } from "@mui/material"; // MUI IconButton
// import IconButton from '@mui/material/IconButton';
const ManageLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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
      await axios.patch(`${API_BASE_URL}/leave-requests/${id}`, {
        status: newStatus,
      });
      alert(`Leave request ${newStatus.toLowerCase()} successfully!`);
      fetchAllLeaves(); // Refresh data
    } catch (error) {
      console.error("Error updating leave request status:", error);
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?"))
      return;

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
      <NeatBackground />
      {/* <h1>Manage Leave Requests</h1> */}

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
            leaveRequests
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((leave, index) => (
                <tr key={leave._id}>
                  <td>{page * rowsPerPage + index + 1}</td>
                  <td>{leave.email}</td>
                  <td>{leave.leaveType}</td>
                  <td>{leave.fromDate || "N/A"}</td>
                  <td>{leave.toDate || "N/A"}</td>
                  <td>{leave.specificTime || "N/A"}</td>
                  <td>{leave.leaveReason}</td>
                  <td>{leave.requestDate}</td>
                  <td>{leave.compensationOption}</td>
                  <td
                    className={`status-${
                      leave.status?.toLowerCase() || "pending"
                    }`}
                  >
                    {leave.status || "Pending"}
                  </td>
                  <td>
                    {leave.status === "Pending" && (
                      <>
                        <IconButton
                          onClick={() =>
                            handleStatusChange(leave._id, "Accepted")
                          }
                          color="success"
                          title="Accept"
                        >
                          <CheckCircle />
                        </IconButton>

                        <IconButton
                          onClick={() =>
                            handleStatusChange(leave._id, "Rejected")
                          }
                          color="error"
                          title="Reject"
                        >
                          <Cancel />
                        </IconButton>
                      </>
                    )}

                    {/* Delete button always visible */}
                    <IconButton
                      onClick={() => handleDelete(leave._id)}
                      color="secondary"
                      title="Delete"
                    >
                      <Delete />
                    </IconButton>
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
      <TablePagination
        component="div"
        count={leaveRequests.length}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0); // reset to first page
        }}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

export default ManageLeaves;
