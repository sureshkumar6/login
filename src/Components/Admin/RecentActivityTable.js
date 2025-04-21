import React, { useState } from "react";
import "./EmployeeManagement.css"; // Import CSS for styling
const RecentActivityTable = ({
  employees,
  currentPage,
  itemsPerPage,
  getEmployeeLog,
  getEmployeeActivity,
  getEmployeeLeave,
  getStatus,
  handlePageChange,
  getAvatarColor,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Filter employees based on search query (this filters all employees, not just the current page)
  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentEmployees = filteredEmployees.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  return (
    <section className="recent-activity-table animate-fade-in delay-300">
      <div className="tableCard">
        <div className="overflow-x-auto">
          <table className="activity-table">
            <thead>
              <tr>
                <th colSpan="4" className="table-header">
                  {/* Search bar inside the table header */}
                  <div className="search-container">
                    <input
                      type="text"
                      placeholder="Search by employee name"
                      className="search-input"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        handlePageChange(1); // reset to first page when searching
                      }}
                    />
                  </div>
                </th>
              </tr>
              <tr>
                <th>Employee</th>
                <th>Activity</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentEmployees.map((employee) => {
                const log = getEmployeeLog(employee.name);
                const activity = getEmployeeActivity(employee.name);
                const leave = getEmployeeLeave(employee.name);
                const status = getStatus(employee.name);

                let activityLabel = "NA";
                let timeLabel = "NA";

                if (leave) {
                  activityLabel = "Applied for leave";
                  timeLabel = "Yesterday";
                } else if (log?.logoutTime) {
                  activityLabel = "Logged out";
                  timeLabel = log.logoutTime;
                } else if (log?.dinnerStartTime && !log?.dinnerEndTime) {
                  activityLabel = "Started break";
                  timeLabel = log.dinnerStartTime;
                } else if (activity) {
                  activityLabel = "Started task";
                  timeLabel = activity.startTime;
                } else if (log?.loginTime) {
                  activityLabel = "Logged in";
                  timeLabel = log.loginTime;
                }

                return (
                  <tr
                    key={employee._id}
                    className="cursor-pointer transition-all duration-300 hover:bg-blue-100"
                  >
                    <td>
                      <div className="employee-info">
                        <div
                          className="avatar"
                          style={{
                            backgroundColor: getAvatarColor(employee.name),
                          }}
                        >
                          <span>{employee.name.charAt(0)}</span>
                        </div>
                        <div className="employee-name-cell">
                          {employee.name}
                        </div>
                      </div>
                    </td>
                    <td>{activityLabel}</td>
                    <td>{timeLabel || "NA"}</td>
                    <td>
                      <span
                        className={`badge badge-${status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="pagination-controls p-4 flex justify-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-btn"
        >
          Previous
        </button>

        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={`pagination-btn ${
              currentPage === i + 1 ? "active" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-btn"
        >
          Next
        </button>
      </div>
    </section>
  );
};

export default RecentActivityTable;
