import { useEffect, useState } from "react";

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6060/leave-requests")
      .then((res) => res.json())
      .then((data) => setLeaves(data))
      .catch((err) => console.error("Error fetching leave requests:", err));
  }, []);

  const updateStatus = (id, status) => {
    fetch(`http://localhost:6060/leave-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then(() => {
        setLeaves(leaves.map((leave) => (leave._id === id ? { ...leave, status } : leave)));
      })
      .catch((err) => console.error("Error updating status:", err));
  };

  return (
    <div>
      <h2>Manage Leave Requests</h2>
      <p>Downloading.....</p>
      {/* <ul>
        {leaves.map((leave) => (
          <li key={leave._id}>
            {leave.email} - {leave.status}
            <button onClick={() => updateStatus(leave._id, "Approved")}>Approve</button>
            <button onClick={() => updateStatus(leave._id, "Rejected")}>Reject</button>
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default ManageLeaves;
