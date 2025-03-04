import { useEffect, useState } from "react";

const AdminTimelogger = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6060/logs")
      .then((res) => res.json())
      .then((data) => setLogs(data))
      .catch((err) => console.error("Error fetching logs:", err));
  }, []);

  return (
    <div>
      <h2>Modify Timelogger</h2>
      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            {log.employeeName} - {log.date} - {log.loginTime}
            {/* Add an Edit or Delete Button Here */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminTimelogger;
