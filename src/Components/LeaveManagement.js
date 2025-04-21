import React, { useState, useEffect } from "react";
import axios from "axios";
import EventAvailableIcon from "@mui/icons-material/EventAvailable"; // Total Requests
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // Approved
import CancelIcon from "@mui/icons-material/Cancel"; // Rejected
import AccessTimeIcon from "@mui/icons-material/AccessTime"; // Pending
import AddIcon from "@mui/icons-material/Add";

import LeaveRequest from "./LeaveRequest.js";

import NeatBackground from "./NeatBackground.js";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Dialog,
  DialogContent,
  Fade,
  TablePagination,
} from "@mui/material";
import "./LeaveManagement.css";

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";
  const totalRequests = leaves.length;
  const approvedCount = leaves.filter(
    (leave) => leave.status === "Accepted"
  ).length;
  const rejectedCount = leaves.filter(
    (leave) => leave.status === "Rejected"
  ).length;
  const pendingCount = leaves.filter(
    (leave) => !leave.status || leave.status === "Pending"
  ).length;

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      fetchLeaves(user.email);
    }
  }, []);

  const fetchLeaves = async (email) => {
    if (!email) {
      console.error("User email not found!");
      return;
    }

    try {
      const response = await axios.get(
        `${API_BASE_URL}/leave-requests?email=${email}`
      );
      setLeaves(response.data);
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this leave request?"))
      return;

    try {
      await axios.delete(`${API_BASE_URL}/leave-requests/${id}`);
      alert("Leave request deleted successfully!");
      fetchLeaves(user.email);
    } catch (error) {
      console.error("Error deleting leave request:", error);
      alert("Failed to delete leave request.");
    }
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="leave-management">
      <NeatBackground />
      <div className="headerContainer">
        <div className="topHeading">
          <Typography variant="h4" className="leave-title" gutterBottom>
            Manage Leaves
          </Typography>
          <p>View and manage Your leave requests</p>
        </div>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          className="new-request-btn"
          onClick={handleOpenModal}
        >
          New Request
        </Button>
        <Dialog
          open={openModal}
          onClose={handleCloseModal}
          TransitionComponent={Fade}
          maxWidth="sm"
          scroll="body"
          sx={{
            "& .MuiDialog-paper": {
              borderRadius: 4,
              p: 3,
              m: 2,
              maxWidth: "600px", // just to be safe
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
              backdropFilter: "blur(10px)",
              overflowY: "visible", // removes inner scroll if not needed
            },
          }}
        >
          <DialogContent sx={{ p: 0 }}>
            <LeaveRequest onClose={handleCloseModal} />
          </DialogContent>
        </Dialog>
      </div>
      <div className="leaveCards">
        <div className="card total">
          <EventAvailableIcon className="icon total-icon" />
          <Typography variant="h6">Total Requests</Typography>
          <Typography variant="h4">{totalRequests}</Typography>
        </div>
        <div className="card approved">
          <CheckCircleIcon className="icon approved-icon" />
          <Typography variant="h6">Approved</Typography>
          <Typography variant="h4">{approvedCount}</Typography>
        </div>
        <div className="card rejected">
          <CancelIcon className="icon rejected-icon" />
          <Typography variant="h6">Rejected</Typography>
          <Typography variant="h4">{rejectedCount}</Typography>
        </div>
        <div className="card pending">
          <AccessTimeIcon className="icon pending-icon" />
          <Typography variant="h6">Pending</Typography>
          <Typography variant="h4">{pendingCount}</Typography>
        </div>
      </div>

      <Paper sx={{ width: "100%", overflow: "hidden" }} className="table-wrap">
        <TableContainer sx={{ maxHeight: 440 }}>
          <Table
            stickyHeader
            aria-label="leave requests table"
            className="table"
          >
            <TableHead className="thead-primary">
              <TableRow>
                <TableCell>S.No</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>From</TableCell>
                <TableCell>To</TableCell>
                <TableCell>Specific Time</TableCell>
                <TableCell>Reason</TableCell>
                <TableCell>Applied Date</TableCell>
                <TableCell>Compensation</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {leaves.length > 0 ? (
                leaves
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((leave, index) => (
                    <TableRow key={leave._id} hover>
                      <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                      <TableCell>{leave.leaveType}</TableCell>
                      <TableCell>{leave.fromDate || "N/A"}</TableCell>
                      <TableCell>{leave.toDate || "N/A"}</TableCell>
                      <TableCell>{leave.specificTime || "N/A"}</TableCell>
                      <TableCell>{leave.leaveReason}</TableCell>
                      <TableCell>{leave.requestDate}</TableCell>
                      <TableCell>{leave.compensationOption}</TableCell>
                      <TableCell>
                        <div
                          className={`status-badge ${
                            leave.status === "Accepted"
                              ? "status-accepted"
                              : leave.status === "Rejected"
                              ? "status-rejected"
                              : "status-pending"
                          }`}
                        >
                          <i
                            className={`mr-1 ${
                              leave.status === "Accepted"
                                ? "fas fa-check-circle"
                                : leave.status === "Rejected"
                                ? "fas fa-times-circle"
                                : "fas fa-clock"
                            }`}
                          ></i>
                          {leave.status || "Pending"}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleDelete(leave._id)}
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
              ) : (
                <TableRow>
                  <TableCell colSpan="10" align="center">
                    No leave requests found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={leaves.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default LeaveManagement;
