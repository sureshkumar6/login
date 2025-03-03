import { useEffect, useState } from "react";

const ManageLeaves = () => {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6060/leave-requests")
      .then((res) => res.json())
      .then((data) => setLeaves(data))
      .catch((error) => console.error("Error fetching leave requests:", error));
  }, []);

  const updateLeaveStatus = (id, status) => {
    fetch(`http://localhost:6060/leave-requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
      .then(() => setLeaves(leaves.map(leave => leave._id === id ? { ...leave, status } : leave)))
      .catch((error) => console.error("Error updating leave request:", error));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Leaves</h1>
      <ul>
        {leaves.map((leave) => (
          <li key={leave._id}>
            {leave.email} - {leave.status}
            <button onClick={() => updateLeaveStatus(leave._id, "Approved")} className="ml-2 text-green-500">Approve</button>
            <button onClick={() => updateLeaveStatus(leave._id, "Rejected")} className="ml-2 text-red-500">Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageLeaves;
