import React, { useEffect, useState } from "react";
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
  }
];

const Home = ({ user }) => {
  const [shloka, setShloka] = useState({});
  const [employeeStatus, setEmployeeStatus] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    // Pick a random shloka
    setShloka(translations[Math.floor(Math.random() * translations.length)]);

    // Fetch real-time employee status
    fetchEmployeeStatus();

    // Fetch announcements
    fetchAnnouncements();
  }, []);

  const fetchEmployeeStatus = async () => {
    try {
      const response = await fetch("http://localhost:6060/daily-activity");
      const data = await response.json();

      // Process data to get employees' current status
      const statusMap = {};
      const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD

      data.forEach((entry) => {
        if (entry.date === today) {
          statusMap[entry.email] = {
            name: entry.email.split("@")[0], // Extract name from email
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
      const response = await fetch("http://localhost:6060/announcements");
      const data = await response.json();
      setAnnouncements(data);
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  return (
    <div className="home-container">
      <h1>Hello, {user?.name} 👋</h1>

      {/* Bhagavad Gita Shloka */}
      <div className="shloka-box">
        <h2>📖 Bhagavad Gita Thought of the Day</h2>
        <p><strong>Hindi:</strong> {shloka.hindi}</p>
        <p><strong>English:</strong> {shloka.english}</p>
      </div>

      {/* Real-time Employee Status */}
      <div className="status-section">
        <h2>👥 Employee Status</h2>
        {employeeStatus.length > 0 ? (
          employeeStatus.map((emp, index) => (
            <div key={index} className={`employee-status ${emp.status.toLowerCase()}`}>
              <p><strong>{emp.name}</strong> - {emp.status} ({emp.work})</p>
            </div>
          ))
        ) : (
          <p>No employees working today.</p>
        )}
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
