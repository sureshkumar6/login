import { useEffect, useState } from "react";

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetch("http://localhost:6060/employee-details")
      .then((res) => res.json())
      .then((data) => setEmployees(data))
      .catch((error) => console.error("Error fetching employees:", error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Employees</h1>
      <ul>
        {employees.map((employee) => (
          <li key={employee.email}>
            {employee.name} ({employee.email})
            {/* Add edit & delete buttons */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageEmployees;
