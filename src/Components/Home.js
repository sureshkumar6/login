import React, { useEffect, useState } from "react";
import axios from "axios";
import EmployeeLoginChart from "./EmployeeLoginChart.js";
import NeatBackground from "./NeatBackground.js";
import "./Home.css";

const translations = [
  {
    hindi: "सभी उपनिषद् गाय हैं, भगवान कृष्ण ग्वाले हैं, अर्जुन बुद्धिमान बछड़ा हैं और भगवद्गीता का अमृत महान दूध है।",
    english: "All the Upanishads are cows, Lord Krishna is the Cowherd, Arjuna is the wise Calf and the nectar of the Bhagavadgītā is the greatest Milk."
  },
  {
    hindi: "जन्मने वाले की मृत्यु निश्चित है और मरने वाले का जन्म निश्चित है इसलिए जो अटल है अपरिहार्य है उसके विषय में तुमको शोक नहीं करना चाहिये।",
    english: "Death is certain for the born, and re-birth is certain for the dead; therefore you should not feel grief for what is inevitable."
  },
  {
    hindi: "प्रारब्ध-कर्म को भोगता हुआ जो मनुष्य गीता के अभ्यास में निरत है, वह इस लोक में मुक्त और सुखी होता है तथा कर्म में लिप्त नहीं होता।",
    english: "One who indulges in ongoing action and is engaged in regular study of the gītā, is free and happy in this world and is not bound by karma."
  },
  {
    hindi: "जैसे इस देह में देही जीवात्मा की कुमार, युवा और वृद्धावस्था होती है वैसे ही उसको अन्य शरीर की प्राप्ति होती है। धीर पुरुष इसमें मोहित नहीं होता है।",
    english: "Just as the boyhood, youth and old age come to the embodied Soul in this body, in the same manner, is the attaining of another body; the wise man is not deluded at that."
  },
  {
    hindi: "जो आत्मा को मारने वाला समझता है और जो इसको मरा समझता है वे दोनों ही नहीं जानते हैं, क्योंकि यह आत्मा न मरता है और न मारा जाता है।",
    english: "He who thinks that the soul kills, and he who thinks of it as killed, are both ignorant. The soul kills not, nor is it killed."
  },
  {
    hindi: "आत्मा किसी काल में भी न जन्मता है और न मरता है और न यह एक बार होकर फिर अभावरूप होने वाला है। आत्मा अजन्मा, नित्य, शाश्वत और पुरातन है, शरीर के नाश होने पर भी इसका नाश नहीं होता।",
    english: "The soul is never born, it never dies having come into being once, it never ceases to be. Unborn, eternal, abiding and primeval, it is not slain when the body is slain."
  }
];

const Home = () => {
  const [employeeName, setEmployeeName] = useState("");
  const [shloka, setShloka] = useState({});
  const [employeeStatus, setEmployeeStatus] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [workSummary, setWorkSummary] = useState([]);
  const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:6060";

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setEmployeeName(storedUser.name);
    }
    
    fetchAnnouncements();
    setDailyShloka();
    fetchEmployeeStatus();
    fetchAnnouncements();
    fetchWorkSummary();
  }, []);

  const setDailyShloka = () => {
    const today = new Date().toISOString().split("T")[0];
    const storedShloka = JSON.parse(localStorage.getItem("dailyShloka"));

    if (storedShloka && storedShloka.date === today) {
      setShloka(storedShloka.shloka);
    } else {
      const newShloka = translations[Math.floor(Math.random() * translations.length)];
      localStorage.setItem("dailyShloka", JSON.stringify({ date: today, shloka: newShloka }));
      setShloka(newShloka);
    }
  };

  const fetchEmployeeStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/daily-activity`);
      const data = await response.json();
      // console.log(data)

      const statusMap = {};
      const today = new Date().toISOString().split("T")[0];

      data.forEach((entry) => {
        if (entry.date === today) {
          statusMap[entry.email] = {
            name: entry.email.split("@")[0],
            work: entry.work,
            status: entry.endTime ? "Logged Out" : "Working"
          };
        }
      });

      setEmployeeStatus(Object.values(statusMap));
    } catch (error) {
      console.error("Error fetching employee status:", error);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/announcements`);
      console.log("announcements response:", response.data); // This will correctly log the data
      setAnnouncements(response.data); // ✅ Correct way to update state
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };
  // Fetch daily work summary
  const fetchWorkSummary = async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const employeeEmail = storedUser?.email; // Get employee email from local storage
  
      if (!employeeEmail) {
        console.warn("No employee email found in local storage.");
        return;
      }
  
      // console.log("Fetching work summary for:", employeeEmail);
  
      const response = await axios.get(`${API_BASE_URL}/daily-activity`);
      // console.log("API Response:", response.data);
  
      const data = response.data;
      const today = new Date().toISOString().split("T")[0];
  
      // Filter activities for the logged-in employee and today's date
      const filteredActivities = data.filter((activity) => {
        const isMatchingEmail = activity.email  === employeeEmail;
        const isMatchingDate = activity.date === today;
  
        // console.log("Checking activity:", activity);
        // console.log("Email match:", isMatchingEmail, "| Date match:", isMatchingDate);
  
        return isMatchingEmail && isMatchingDate;
      });
  
      // console.log("Filtered Activities:", filteredActivities);
  
      setWorkSummary(filteredActivities);
    } catch (error) {
      console.error("Error fetching work summary:", error);
    }
  };
  

  return (
    <div className="home-container">
      <NeatBackground/>
      <h1>Hello, {employeeName} 👋</h1>

      {/* Bhagavad Gita Shloka */}
      <div className="shloka-box">
        <h2>📖 Thought of the Day</h2>
        <p><strong>Hindi:</strong> {shloka.hindi}</p>
        <p><strong>English:</strong> {shloka.english}</p>
      </div>

      {/* Real-time Employee Status */}
      <div className="status-section">
        {/* <h2>👥 Employee Status</h2> */}
        <div className="work-summary">
        <h2>📅 Date: {new Date().toLocaleDateString()}</h2>
        <h3>Today I Worked On:</h3>
        {workSummary.length > 0 ? (
          <ul>
            {workSummary.map((activity, index) => (
              <li key={index}>
                ➝ Worked on "{activity.work}" "{activity.subWorkType}"
              </li>
            ))}
          </ul>
        ) : (
          <p>No work logged today.</p>
        )}
      </div>
        <div className="chart-section">
        {/* <h2>📊 Your Work Summary</h2> */}
        {employeeName ? (
          <EmployeeLoginChart selectedEmployee={employeeName} isAdmin={false}/>
        ) : (
          <p>Loading chart...</p>
        )}
      </div>
      <div>

      </div>
      </div>

      {/* Announcements */}
      <div className="announcements">
    <h2>📢 Announcements</h2>
    {announcements.length > 0 ? (
      announcements.map((announcement, index) => (
        <div key={index} className="announcement-item">
          <p>{announcement.message}</p>
          <span>{new Date(announcement.date).toLocaleDateString()}</span>
        </div>
      ))
    ) : (
      <p>No announcements today.</p>
    )}
  </div>
    </div>
  );
};

export default Home;
