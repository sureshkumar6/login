import { useEffect, useState } from "react";

const ManageTimelogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6060/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((error) => console.error("Error fetching logs:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Timelogs</h1>
      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            {log.employeeName} - {log.date} - {log.totalLoginHours}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageTimelogs;
