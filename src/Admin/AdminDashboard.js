import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <nav>
        <ul className="space-y-2">
          <li><Link to="/admin/employees" className="text-blue-500">Manage Employees</Link></li>
          <li><Link to="/admin/timelogs" className="text-blue-500">Manage Timelogs</Link></li>
          <li><Link to="/admin/leaves" className="text-blue-500">Manage Leaves</Link></li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminDashboard;
