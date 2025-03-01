// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./LeaveRequest.css";

// const LeaveRequest = () => {
//   const [employeeName, setEmployeeName] = useState("");
//   const [requestDate, setRequestDate] = useState("");
//   const [requestTime, setRequestTime] = useState("");
//   const [leaveType, setLeaveType] = useState("Full Day Off");
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [specificTime, setSpecificTime] = useState("");
//   const [leaveReason, setLeaveReason] = useState("");
//   const [compensationOption, setCompensationOption] = useState("Deduct from Pay");

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     if (storedUser) {
//       setEmployeeName(storedUser.name);
//     }

//     const options = { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" };
//     const timeOptions = { timeZone: "America/Chicago", hour12: true, hour: "2-digit", minute: "2-digit" };
    
//     setRequestDate(new Intl.DateTimeFormat("en-US", options).format(new Date()));
//     setRequestTime(new Intl.DateTimeFormat("en-US", timeOptions).format(new Date()));
//   }, []);

//   const handleSubmit = async () => {
//     if (!leaveReason) {
//       alert("Please provide a reason for the leave request.");
//       return;
//     }
  
//     const storedUser = JSON.parse(localStorage.getItem("user"));
//     const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";
  
//     try {
//       await axios.post(
//         `${API_BASE_URL}/leave-requests`,
//         {
//           employeeName,
//           requestDate,
//           requestTime,
//           leaveType,
//           fromDate: leaveType === "Full Day Off" || leaveType === "Multiple Days Off" ? fromDate : null,
//           toDate: leaveType === "Full Day Off" || leaveType === "Multiple Days Off" ? toDate : null,
//           specificTime: leaveType === "Arriving Late" || leaveType === "Leaving Early" ? specificTime : null,
//           leaveReason,
//           compensationOption,
//         },
//         {
//           headers: { "user-email": storedUser.email },
//         }
//       );
  
//       alert("Leave request submitted successfully!");
  
//       // Reset form inputs after successful submission
//       setLeaveType("Full Day Off");
//       setFromDate("");
//       setToDate("");
//       setSpecificTime("");
//       setLeaveReason("");
//       setCompensationOption("Deduct from Pay");
  
//     } catch (error) {
//       console.error("Error submitting leave request:", error.response?.data || error.message);
//       alert(error.response?.data?.error || "Something went wrong");
//     }
//   };
  

//   return (
//     <div className="leave-request">
//       <h2>Leave Request Form</h2>
//       <label>Employee Name:</label>
//       <input type="text" value={employeeName} readOnly />
      
//       <label>Request Date:</label>
//       <input type="text" value={requestDate} readOnly />
      
//       <label>Request Time:</label>
//       <input type="text" value={requestTime} readOnly />
      
//       <label>Type of Leave:</label>
//       <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
//         <option>Full Day Off</option>
//         <option>Multiple Days Off</option>
//         <option>Arriving Late</option>
//         <option>Leaving Early</option>
//       </select>
      
//       {(leaveType === "Full Day Off" || leaveType === "Multiple Days Off") && (
//         <>
//           <label>From Date:</label>
//           <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          
//           <label>To Date:</label>
//           <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </>
//       )}
      
//       {(leaveType === "Arriving Late" || leaveType === "Leaving Early") && (
//         <>
//           <label>Specify Time:</label>
//           <input type="time" value={specificTime} onChange={(e) => setSpecificTime(e.target.value)} />
//         </>
//       )}
      
//       <label>Reason for Request:</label>
//       <textarea value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} placeholder="Enter reason here..." />
      
//       <label>Compensation Option:</label>
//       <select value={compensationOption} onChange={(e) => setCompensationOption(e.target.value)}>
//         <option>Deduct from Pay</option>
//         <option>Make up Lost Time</option>
//       </select>
      
//       <button onClick={handleSubmit}>Submit Request</button>
//     </div>
//   );
// };

// export default LeaveRequest;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./LeaveRequest.css";

const LeaveRequest = () => {
  const [email, setEmail] = useState(""); // Store email instead of name
  const [requestDate, setRequestDate] = useState("");
  const [requestTime, setRequestTime] = useState("");
  const [leaveType, setLeaveType] = useState("Full Day Off");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [specificTime, setSpecificTime] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [compensationOption, setCompensationOption] = useState("Deduct from Pay");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setEmail(storedUser.email); // Set user email
    }

    const options = { timeZone: "America/Chicago", year: "numeric", month: "2-digit", day: "2-digit" };
    const timeOptions = { timeZone: "America/Chicago", hour12: true, hour: "2-digit", minute: "2-digit" };
    
    setRequestDate(new Intl.DateTimeFormat("en-US", options).format(new Date()));
    setRequestTime(new Intl.DateTimeFormat("en-US", timeOptions).format(new Date()));
  }, []);

  const handleSubmit = async () => {
    if (!leaveReason) {
      alert("Please provide a reason for the leave request.");
      return;
    }

    const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

    try {
      await axios.post(`${API_BASE_URL}/leave-requests`, {
        email, // Use email instead of employeeName
        requestDate,
        requestTime,
        leaveType,
        fromDate: leaveType === "Full Day Off" || leaveType === "Multiple Days Off" ? fromDate : null,
        toDate: leaveType === "Full Day Off" || leaveType === "Multiple Days Off" ? toDate : null,
        specificTime: leaveType === "Arriving Late" || leaveType === "Leaving Early" ? specificTime : null,
        leaveReason,
        compensationOption,
      });

      alert("Leave request submitted successfully!");

      // Reset form inputs after successful submission
      setLeaveType("Full Day Off");
      setFromDate("");
      setToDate("");
      setSpecificTime("");
      setLeaveReason("");
      setCompensationOption("Deduct from Pay");

    } catch (error) {
      console.error("Error submitting leave request:", error.response?.data || error.message);
      alert(error.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="leave-request">
      <h2>Leave Request Form</h2>

      <label>Email:</label>
      <input type="text" value={email} readOnly /> {/* Show email instead of name */}

      <label>Request Date:</label>
      <input type="text" value={requestDate} readOnly />

      <label>Request Time:</label>
      <input type="text" value={requestTime} readOnly />

      <label>Type of Leave:</label>
      <select value={leaveType} onChange={(e) => setLeaveType(e.target.value)}>
        <option>Full Day Off</option>
        <option>Multiple Days Off</option>
        <option>Arriving Late</option>
        <option>Leaving Early</option>
      </select>

      {(leaveType === "Full Day Off" || leaveType === "Multiple Days Off") && (
        <>
          <label>From Date:</label>
          <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          
          <label>To Date:</label>
          <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </>
      )}

      {(leaveType === "Arriving Late" || leaveType === "Leaving Early") && (
        <>
          <label>Specify Time:</label>
          <input type="time" value={specificTime} onChange={(e) => setSpecificTime(e.target.value)} />
        </>
      )}

      <label>Reason for Request:</label>
      <textarea value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} placeholder="Enter reason here..." />

      <label>Compensation Option:</label>
      <select value={compensationOption} onChange={(e) => setCompensationOption(e.target.value)}>
        <option>Deduct from Pay</option>
        <option>Make up Lost Time</option>
      </select>

      <button onClick={handleSubmit}>Submit Request</button>
    </div>
  );
};

export default LeaveRequest;
