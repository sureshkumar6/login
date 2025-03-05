import { useEffect, useState } from "react";

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6060/employee-details")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  return (
    <div>
      <h2>Employee Management</h2>
      <p>Downloading.....</p>
      {/* <ul>
        {employees.map((emp) => (
          <li key={emp.employeeId}>{emp.name} - {emp.email}</li>
        ))}
      </ul> */}
    </div>
  );
};

export default EmployeeManagement;
