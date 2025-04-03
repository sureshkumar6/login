import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinaryConfig.js";
import path from "path";
import cors from "cors";
import Timelog from "./db/timelog.js"; // Import your model
import usersModel from "./db/user.js";
import EmployeeDetails from "./db/employeeDetails.js";
import DailyActivity from "./db/dailyActivity.js";
import LeaveRequest from "./db/LeaveRequestModel.js";
import Announcement from "./db/AnnouncementModel.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());
console.log("Cloudinary Name:", process.env.CLOUDINARY_CLOUD_NAME); 

// 🔹 Connect to MongoDBcoMPASS
mongoose.connect("mongodb://127.0.0.1:27017/timelogger", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// mongoose.connect(process.env.MONGO_URI, {
//   authSource: "admin"
// });


// 🔹 Get logs by employeeName
app.get("/logs", async (req, res) => {
  try {
    const { employeeName } = req.query;

    if (!employeeName) {
      return res.status(400).json({ error: "Employee name is required" });
    }

    const logs = await Timelog.find({ employeeName });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/logs", async (req, res) => {
  // console.log("Received request:", req.body);
  try {
    const { date, comment, ...logTimes } = req.body;
    const userEmail = req.headers["user-email"];

    if (!date || !userEmail || Object.keys(logTimes).length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const user = await usersModel.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const employeeName = user.name;
    let logEntry = await Timelog.findOne({ date, employeeName });

    const fieldMap = {
      "Login Time": "loginTime",
      "Dinner Break - Start Time": "dinnerStartTime",
      "Dinner Break - End Time": "dinnerEndTime",
      "Logout Time": "logoutTime",
      "Short Break 1 Start": "shortBreak1Start",
      "Short Break 1 End": "shortBreak1End",
      "Short Break 2 Start": "shortBreak2Start",
      "Short Break 2 End": "shortBreak2End",
      "Short Break 3 Start": "shortBreak3Start",
      "Short Break 3 End": "shortBreak3End",
    };

    if (logEntry) {
      for (const [key, value] of Object.entries(logTimes)) {
        const field = fieldMap[key];

        if (logEntry[field]) {
          return res.status(400).json({
            error: `Time already entered for ${key}. Please contact admin to update.`,
          });
        }
        logEntry[field] = value;
      }
    } else {
      logEntry = new Timelog({ date, employeeName, email: userEmail, comment });

      for (const [key, value] of Object.entries(logTimes)) {
        logEntry[fieldMap[key]] = value;
      }
    }

    // 🔹 Function to Calculate Hours Difference (Only Counts If > 5 min)
    const calculateHours = (start, end) => {
      if (!start || !end) return 0;

      const startTime = new Date(`2023-01-01T${start}`);
      let endTime = new Date(`2023-01-01T${end}`);

      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
      }

      const diff = (endTime - startTime) / (1000 * 60); // Convert ms to minutes
      return diff > 5 ? diff / 60 : 0; // Only count if > 5 minutes
    };

    // 🔹 Function to Convert Decimal Hours to HH:MM Format
    const convertDecimalToHHMM = (decimalHours) => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    // ✅ Calculate Total Login Hours
    const totalLoginHours = calculateHours(logEntry.loginTime, logEntry.logoutTime);

    // ✅ Calculate Break Duration (Only Including Breaks > 5 min)
    const breakDuration =
      calculateHours(logEntry.dinnerStartTime, logEntry.dinnerEndTime) +
      calculateHours(logEntry.shortBreak1Start, logEntry.shortBreak1End) +
      calculateHours(logEntry.shortBreak2Start, logEntry.shortBreak2End) +
      calculateHours(logEntry.shortBreak3Start, logEntry.shortBreak3End);

    // ✅ Calculate Actual Login Hours
    const actualLoginHoursDecimal = (totalLoginHours - breakDuration).toFixed(2);
    const actualLoginHoursFormatted = convertDecimalToHHMM(actualLoginHoursDecimal);

    // 🔹 Convert Actual Login Hrs to Admin Login Hrs Based on Rounding Rules
    const roundToAdminHours = (decimalHours) => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);

      let roundedMinutes = 0;
      if (minutes >= 8 && minutes <= 22) {
        roundedMinutes = 0.25;
      } else if (minutes >= 23 && minutes <= 37) {
        roundedMinutes = 0.50;
      } else if (minutes >= 38 && minutes <= 52) {
        roundedMinutes = 0.75;
      } else if (minutes >= 53 && minutes <= 59) {
        roundedMinutes = 1.0;
      }

      return (hours + roundedMinutes).toFixed(2);
    };

    const adminLoginHours = roundToAdminHours(parseFloat(actualLoginHoursDecimal));

    // ✅ Store in MongoDB in HH:MM Format
    logEntry.totalLoginHours = convertDecimalToHHMM(totalLoginHours);
    logEntry.breakDuration = convertDecimalToHHMM(breakDuration);
    logEntry.actualLoginHours = actualLoginHoursFormatted;
    logEntry.adminLoginHours = adminLoginHours; // Store new field

    await logEntry.save();
    res.json({ message: "Time log submitted successfully!" });
  } catch (error) {
    console.error("Error submitting log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//new route
// app.post("/logs", async (req, res) => {
//   console.log("Received request:", req.body);
//   try {
//     const { date, comment, ...logTimes } = req.body;
//     const userEmail = req.headers["user-email"]; // 🔹 Get user email from headers

//     if (!date || !userEmail || Object.keys(logTimes).length === 0) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const user = await usersModel.findOne({ email: userEmail });
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const employeeName = user.name;
//     let logEntry = await Timelog.findOne({ date, employeeName });

//     const fieldMap = {
//       "Login Time": "loginTime",
//       "Dinner Break - Start Time": "dinnerStartTime",
//       "Dinner Break - End Time": "dinnerEndTime",
//       "Logout Time": "logoutTime",
//       "Short Break 1 Start": "shortBreak1Start",
//       "Short Break 1 End": "shortBreak1End",
//       "Short Break 2 Start": "shortBreak2Start",
//       "Short Break 2 End": "shortBreak2End",
//       "Short Break 3 Start": "shortBreak3Start",
//       "Short Break 3 End": "shortBreak3End",
//     };

//     if (logEntry) {
//       for (const [key, value] of Object.entries(logTimes)) {
//         const field = fieldMap[key];

//         if (logEntry[field]) {
//           return res.status(400).json({
//             error: `Time already entered for ${key}. Please contact admin to update.`,
//           });
//         }
//         logEntry[field] = value;
//       }
//     } else {
//       logEntry = new Timelog({ date, employeeName, email: userEmail, comment }); // 🔹 Store email

//       for (const [key, value] of Object.entries(logTimes)) {
//         logEntry[fieldMap[key]] = value;
//       }
//     }

//     // ✅ Calculate Hours (same logic as before)
//     const calculateHours = (start, end) => {
//       if (!start || !end) return 0;
//       const startTime = new Date(`2023-01-01T${start}`);
//       let endTime = new Date(`2023-01-01T${end}`);
//       if (endTime < startTime) {
//         endTime.setDate(endTime.getDate() + 1);
//       }
//       const diff = (endTime - startTime) / (1000 * 60);
//       return diff > 5 ? diff / 60 : 0;
//     };

//     const convertDecimalToHHMM = (decimalHours) => {
//       const hours = Math.floor(decimalHours);
//       const minutes = Math.round((decimalHours - hours) * 60);
//       return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
//     };

//     const totalLoginHours = calculateHours(logEntry.loginTime, logEntry.logoutTime);
//     const breakDuration =
//       calculateHours(logEntry.dinnerStartTime, logEntry.dinnerEndTime) +
//       calculateHours(logEntry.shortBreak1Start, logEntry.shortBreak1End) +
//       calculateHours(logEntry.shortBreak2Start, logEntry.shortBreak2End) +
//       calculateHours(logEntry.shortBreak3Start, logEntry.shortBreak3End);

//     const actualLoginHoursDecimal = (totalLoginHours - breakDuration).toFixed(2);
//     const actualLoginHoursFormatted = convertDecimalToHHMM(actualLoginHoursDecimal);

//     const roundToAdminHours = (decimalHours) => {
//       const hours = Math.floor(decimalHours);
//       const minutes = Math.round((decimalHours - hours) * 60);
//       let roundedMinutes = 0;
//       if (minutes >= 8 && minutes <= 22) roundedMinutes = 0.25;
//       else if (minutes >= 23 && minutes <= 37) roundedMinutes = 0.50;
//       else if (minutes >= 38 && minutes <= 52) roundedMinutes = 0.75;
//       else if (minutes >= 53 && minutes <= 59) roundedMinutes = 1.0;
//       return (hours + roundedMinutes).toFixed(2);
//     };

//     const adminLoginHours = roundToAdminHours(parseFloat(actualLoginHoursDecimal));

//     logEntry.totalLoginHours = convertDecimalToHHMM(totalLoginHours);
//     logEntry.breakDuration = convertDecimalToHHMM(breakDuration);
//     logEntry.actualLoginHours = actualLoginHoursFormatted;
//     logEntry.adminLoginHours = adminLoginHours;

//     await logEntry.save();
//     res.json({ message: "Time log submitted successfully!" });
//   } catch (error) {
//     console.error("Error submitting log:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });


//for admin 
// app.put("/logs", async (req, res) => {
//   // console.log("Received request:", req.body);
//   try {
//     const { employeeName, date, logType, ...logTimes } = req.body;

//     if (!employeeName || !date || !logType || Object.keys(logTimes).length === 0) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }

//     const fieldMap = {
//       "Login Time": "loginTime",
//       "Dinner Break - Start Time": "dinnerStartTime",
//       "Dinner Break - End Time": "dinnerEndTime",
//       "Logout Time": "logoutTime",
//       "Short Break 1 Start": "shortBreak1Start",
//       "Short Break 1 End": "shortBreak1End",
//       "Short Break 2 Start": "shortBreak2Start",
//       "Short Break 2 End": "shortBreak2End",
//       "Short Break 3 Start": "shortBreak3Start",
//       "Short Break 3 End": "shortBreak3End",
//     };

//     const fieldToUpdate = fieldMap[logType];
//     if (!fieldToUpdate) {
//       return res.status(400).json({ error: "Invalid log type" });
//     }

//     const logTime = logTimes[fieldToUpdate];
//     if (!logTime) {
//       return res.status(400).json({ error: "Log time is missing" });
//     }

//     let logEntry = await Timelog.findOne({ date, employeeName });

//     if (!logEntry) {
//       return res.status(404).json({ error: "Log entry not found" });
//     }

//     // Update the specific field
//     logEntry[fieldToUpdate] = logTime;

//     // 🔹 Function to Calculate Hours Difference (Only Counts If > 5 min)
//     const calculateHours = (start, end) => {
//       if (!start || !end) return 0;

//       const startTime = new Date(`2023-01-01T${start}`);
//       let endTime = new Date(`2023-01-01T${end}`);

//       if (endTime < startTime) {
//         endTime.setDate(endTime.getDate() + 1);
//       }

//       const diff = (endTime - startTime) / (1000 * 60);
//       return diff > 5 ? diff / 60 : 0;
//     };

//     // 🔹 Function to Convert Decimal Hours to HH:MM Format
//     const convertDecimalToHHMM = (decimalHours) => {
//       const hours = Math.floor(decimalHours);
//       const minutes = Math.round((decimalHours - hours) * 60);
//       return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
//     };

//     // ✅ Calculate Total Login Hours
//     const totalLoginHours = calculateHours(logEntry.loginTime, logEntry.logoutTime);

//     // ✅ Calculate Break Duration (Only Including Breaks > 5 min)
//     const breakDuration =
//       calculateHours(logEntry.dinnerStartTime, logEntry.dinnerEndTime) +
//       calculateHours(logEntry.shortBreak1Start, logEntry.shortBreak1End) +
//       calculateHours(logEntry.shortBreak2Start, logEntry.shortBreak2End) +
//       calculateHours(logEntry.shortBreak3Start, logEntry.shortBreak3End);

//     // ✅ Calculate Actual Login Hours
//     const actualLoginHoursDecimal = (totalLoginHours - breakDuration).toFixed(2);
//     const actualLoginHoursFormatted = convertDecimalToHHMM(actualLoginHoursDecimal);

//     // 🔹 Convert Actual Login Hrs to Admin Login Hrs Based on Rounding Rules
//     const roundToAdminHours = (decimalHours) => {
//       const hours = Math.floor(decimalHours);
//       const minutes = Math.round((decimalHours - hours) * 60);

//       let roundedMinutes = 0;
//       if (minutes >= 8 && minutes <= 22) {
//         roundedMinutes = 0.25;
//       } else if (minutes >= 23 && minutes <= 37) {
//         roundedMinutes = 0.50;
//       } else if (minutes >= 38 && minutes <= 52) {
//         roundedMinutes = 0.75;
//       } else if (minutes >= 53 && minutes <= 59) {
//         roundedMinutes = 1.0;
//       }

//       return (hours + roundedMinutes).toFixed(2);
//     };

//     const adminLoginHours = roundToAdminHours(parseFloat(actualLoginHoursDecimal));

//     // ✅ Store in MongoDB in HH:MM Format
//     logEntry.totalLoginHours = convertDecimalToHHMM(totalLoginHours);
//     logEntry.breakDuration = convertDecimalToHHMM(breakDuration);
//     logEntry.actualLoginHours = actualLoginHoursFormatted;
//     logEntry.adminLoginHours = adminLoginHours; // Store new field

//     await logEntry.save();
//     res.json({ message: "Log updated successfully!" });
//   } catch (error) {
//     console.error("Error updating log:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

//testing
app.put("/logs", async (req, res) => {
  try {
    const { employeeName, date, logType, ...logTimes } = req.body;

    if (!employeeName || !date || !logType || Object.keys(logTimes).length === 0) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const fieldMap = {
      "Login Time": "loginTime",
      "Dinner Break - Start Time": "dinnerStartTime",
      "Dinner Break - End Time": "dinnerEndTime",
      "Logout Time": "logoutTime",
      "Short Break 1 Start": "shortBreak1Start",
      "Short Break 1 End": "shortBreak1End",
      "Short Break 2 Start": "shortBreak2Start",
      "Short Break 2 End": "shortBreak2End",
      "Short Break 3 Start": "shortBreak3Start",
      "Short Break 3 End": "shortBreak3End",
    };

    const fieldToUpdate = fieldMap[logType];
    if (!fieldToUpdate) {
      return res.status(400).json({ error: "Invalid log type" });
    }

    const logTime = logTimes[fieldToUpdate];
    if (!logTime) {
      return res.status(400).json({ error: "Log time is missing" });
    }

    let logEntry = await Timelog.findOne({ date, employeeName });

    if (!logEntry) {
      return res.status(404).json({ error: "Log entry not found" });
    }

    // Store previous time before updating
    const oldTime = logEntry[fieldToUpdate];

    // Append change history
    if (!logEntry.modifications) logEntry.modifications = [];
    logEntry.modifications.push({
      field: logType,
      oldTime: oldTime || "N/A",
      newTime: logTime,
      modifiedAt: new Date(),
    });

    // Update the field
    logEntry[fieldToUpdate] = logTime;

    // 🔹 Function to Calculate Hours Difference (Only Counts If > 5 min)
    const calculateHours = (start, end) => {
      if (!start || !end) return 0;

      const startTime = new Date(`2023-01-01T${start}`);
      let endTime = new Date(`2023-01-01T${end}`);

      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
      }

      const diff = (endTime - startTime) / (1000 * 60);
      return diff > 5 ? diff / 60 : 0;
    };

    // 🔹 Function to Convert Decimal Hours to HH:MM Format
    const convertDecimalToHHMM = (decimalHours) => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    };

    // ✅ Calculate Total Login Hours
    const totalLoginHours = calculateHours(logEntry.loginTime, logEntry.logoutTime);

    // ✅ Calculate Break Duration (Only Including Breaks > 5 min)
    const breakDuration =
      calculateHours(logEntry.dinnerStartTime, logEntry.dinnerEndTime) +
      calculateHours(logEntry.shortBreak1Start, logEntry.shortBreak1End) +
      calculateHours(logEntry.shortBreak2Start, logEntry.shortBreak2End) +
      calculateHours(logEntry.shortBreak3Start, logEntry.shortBreak3End);

    // ✅ Calculate Actual Login Hours
    const actualLoginHoursDecimal = (totalLoginHours - breakDuration).toFixed(2);
    const actualLoginHoursFormatted = convertDecimalToHHMM(actualLoginHoursDecimal);

    // 🔹 Convert Actual Login Hrs to Admin Login Hrs Based on Rounding Rules
    const roundToAdminHours = (decimalHours) => {
      const hours = Math.floor(decimalHours);
      const minutes = Math.round((decimalHours - hours) * 60);

      let roundedMinutes = 0;
      if (minutes >= 8 && minutes <= 22) {
        roundedMinutes = 0.25;
      } else if (minutes >= 23 && minutes <= 37) {
        roundedMinutes = 0.50;
      } else if (minutes >= 38 && minutes <= 52) {
        roundedMinutes = 0.75;
      } else if (minutes >= 53 && minutes <= 59) {
        roundedMinutes = 1.0;
      }

      return (hours + roundedMinutes).toFixed(2);
    };

    const adminLoginHours = roundToAdminHours(parseFloat(actualLoginHoursDecimal));

    // ✅ Store in MongoDB in HH:MM Format
    logEntry.totalLoginHours = convertDecimalToHHMM(totalLoginHours);
    logEntry.breakDuration = convertDecimalToHHMM(breakDuration);
    logEntry.actualLoginHours = actualLoginHoursFormatted;
    logEntry.adminLoginHours = adminLoginHours;

    await logEntry.save();
    res.json({ message: "Log updated successfully!" });
  } catch (error) {
    console.error("Error updating log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// app.get("/employees-logs", async (req, res) => {
//   try {
//     const { employeeName, date } = req.query;

//     // Define search criteria dynamically
//     let query = {};
//     if (employeeName) query.employeeName = employeeName;
//     if (date) query.date = date;

//     const logs = await Timelog.find(query);

//     if (logs.length === 0) {
//       return res.status(404).json({ message: "No logs found" });
//     }

//     res.json(logs);
//   } catch (error) {
//     console.error("Error fetching logs:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
app.get("/employees-logs", async (req, res) => {
  try {
    const { employeeName, date } = req.query;
    let query = {};
    if (employeeName) query.employeeName = employeeName;
    if (date) query.date = date;

    const logs = await Timelog.find(query);

    if (logs.length === 0) {
      return res.status(404).json({ message: "No logs found" });
    }

    res.json(logs.map(log => ({
      ...log._doc,  // Spread original log data
      modifications: log.modifications || [] // Ensure modifications array exists
    })));
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/register", async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const existingUser = await usersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // ✅ Generate Employee ID for both Admins & Non-Admins
    let lastEmployee = await EmployeeDetails.findOne({ employeeId: /^EMP\d+$/ }).sort({ employeeId: -1 });
    let lastEmployeeId = lastEmployee ? parseInt(lastEmployee.employeeId.replace("EMP", ""), 10) : 1000;
    let employeeId = `EMP${lastEmployeeId + 1}`;

    // ✅ Save User
    const user = new usersModel({ 
      name, 
      email, 
      password,  
      employeeId, 
      isAdmin: isAdmin || false, 
    });

    await user.save();

    // ✅ Save Employee Details (Admins also get stored)
    const employeeDetails = new EmployeeDetails({ 
      employeeId, 
      name, 
      email, 
      dob: "", 
      gender: "", 
      maritalStatus: "",
      isAdmin: isAdmin || false,  
    });

    await employeeDetails.save();

    res.json({ 
      message: "User registered successfully!", 
      name, 
      email, 
      employeeId, 
      isAdmin: user.isAdmin 
    });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersModel.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // console.log("User from DB:", user); // Debugging: Check what MongoDB returns

    res.json({
      name: user.name,
      email: user.email,
      employeeId: user.employeeId,
      isAdmin: user.isAdmin, // Correctly getting isAdmin from DB
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



app.put("/change-password", async (req, res) => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const user = await usersModel.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.password !== oldPassword) {
      return res.status(400).json({ error: "Incorrect old password" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: "Password updated successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.get("/employee-details", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const employee = await EmployeeDetails.findOne({ email });
    if (!employee) {
      return res.status(404).json({ error: "Employee details not found" });
    }

    res.json(employee);
  } catch (error) {
    console.error("Error fetching employee details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.put("/employee-details", async (req, res) => {
  try {
    const { email, dob, gender, maritalStatus } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const updatedEmployee = await EmployeeDetails.findOneAndUpdate(
      { email },
      { dob, gender, maritalStatus },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee details not found" });
    }

    res.json({ message: "Employee details updated successfully", updatedEmployee });
  } catch (error) {
    console.error("Error updating employee details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//upload images
// Set up storage engine
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "profile_pictures", // Folder in Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// Image Upload Route
app.post("/upload-profile-picture", upload.single("profilePicture"), async (req, res) => {
  try {
    const { email } = req.body;
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    console.log("File Uploaded:", req.file);
    console.log("Email:", email);

    const imagePath = req.file.path; // Cloudinary should return this

    const updatedEmployee = await EmployeeDetails.findOneAndUpdate(
      { email },
      { profilePicture: imagePath },
      { new: true }
    );

    if (!updatedEmployee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ message: "Profile picture updated", profilePicture: imagePath });
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});


// Serve uploaded images statically
// app.use("/uploads", express.static("uploads"));



app.post("/daily-activity", async (req, res) => {
  try {
    const { email, employeeName, date, work, subWorkType, sheekLink, startTime } = req.body;

    if (!email || !employeeName || !date || !work || !subWorkType || !sheekLink || !startTime) {
      return res.status(400).json({ error: "All fields except End Time are required" });
    }

    const activity = new DailyActivity({ email, employeeName, date, work, subWorkType, sheekLink, startTime, endTime: null });
    await activity.save();

    res.json({ message: "Start time saved successfully!", activity });
  } catch (error) {
    console.error("Error saving activity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// Update only the end time for an existing activity
app.put("/daily-activity/update-end-time", async (req, res) => {
  try {
    const { email, date, endTime } = req.body;
    if (!email || !date || !endTime) {
      return res.status(400).json({ error: "Email, Date, and End Time are required" });
    }

    const updatedActivity = await DailyActivity.findOneAndUpdate(
      { email, date, endTime: null }, // Find entry without an end time
      { $set: { endTime } }, // Update endTime
      { new: true }
    );

    if (!updatedActivity) {
      return res.status(404).json({ error: "No matching record found to update" });
    }

    res.json({ message: "End time updated successfully!", updatedActivity });
  } catch (error) {
    console.error("Error updating end time:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// app.get("/daily-activity", async (req, res) => {
//   try {
//     const { email } = req.query;
//     if (!email) {
//       return res.status(400).json({ error: "Email is required" });
//     }

//     // Retrieve activities sorted by date
//     const activities = await DailyActivity.find({ email }).sort({ date: -1 });
//     res.json(activities);
//   } catch (error) {
//     console.error("Error fetching activities:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });
app.get("/daily-activity", async (req, res) => {
  try {
    const { email } = req.query;
    let activities;

    if (email) {
      activities = await DailyActivity.find({ email }).sort({ date: -1 });
    } else {
      activities = await DailyActivity.find().sort({ date: -1 });
    }

    res.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




app.post("/leave-requests", async (req, res) => {
  try {
    const newLeaveRequest = new LeaveRequest(req.body);
    const savedRequest = await newLeaveRequest.save();
    res.status(201).json(savedRequest); // Return the newly created leave request
  } catch (error) {
    res.status(500).json({ message: "Error creating leave request" });
  }
});

app.get("/leave-requests", async (req, res) => {
  const { email } = req.query; // Get email from request query

  try {
    // If an email is provided, return only that employee's leaves
    if (email) {
      const leaveRequests = await LeaveRequest.find({ email }).sort({ requestDate: -1 });
      return res.status(200).json(leaveRequests);
    }
    
    // Otherwise, return ALL leave requests (for admins)
    const allLeaveRequests = await LeaveRequest.find().sort({ requestDate: -1 });
    res.status(200).json(allLeaveRequests);

  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ error: "Failed to fetch leave requests." });
  }
});




// 👉 API to delete a leave request
app.delete("/leave-requests/:id", async (req, res) => {
  try {
    await LeaveRequest.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Leave request deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete leave request." });
  }
});

// 👉 API to update leave request status (for Super Admin)
app.patch("/leave-requests/:id", async (req, res) => {
  try {
    const { status } = req.body;
    await LeaveRequest.findByIdAndUpdate(req.params.id, { status });
    res.status(200).json({ message: "Leave request status updated!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update status." });
  }
});

// Fetch Announcements
app.get("/announcements", async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: "Error fetching announcements", error });
  }
});

// Add a new Announcement
app.post("/announcements", async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required" });

  try {
    const newAnnouncement = new Announcement({ message, date: new Date() });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (error) {
    res.status(500).json({ message: "Error saving announcement", error });
  }
});
// 📌 Delete an announcement (Optional)
app.delete("/announcements/:id", async (req, res) => {
  try {
    const deletedAnnouncement = await Announcement.findByIdAndDelete(req.params.id);
    if (!deletedAnnouncement) return res.status(404).json({ message: "Announcement not found" });

    res.json({ message: "Announcement deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting announcement", error });
  }
});
///
// 🔹 Fetch all employees
app.get("/employees", async (req, res) => {
  try {
    const employees = await EmployeeDetails.find({ isAdmin: false }, "name profilePicture");
    // const employees = await EmployeeDetails.find({ isAdmin: false });
    res.json(employees);
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// 🔹 Fetch logs of a specific employee
app.get("/employee-logs", async (req, res) => {
  try {
    const { employeeId } = req.query;
    if (!employeeId) {
      return res.status(400).json({ error: "Employee ID is required" });
    }

    const logs = await Timelog.find({ employeeId }).sort({ date: -1 });
    res.json(logs);
  } catch (error) {
    console.error("Error fetching employee logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 🔹 Update an existing time log entry (for Admins)
app.put("/update-logs", async (req, res) => {
  try {
    const { logId, updates } = req.body;
    if (!logId || !updates) {
      return res.status(400).json({ error: "Log ID and update fields are required" });
    }

    const updatedLog = await Timelog.findByIdAndUpdate(logId, updates, { new: true });
    if (!updatedLog) {
      return res.status(404).json({ error: "Log entry not found" });
    }

    res.json({ message: "Log updated successfully!", updatedLog });
  } catch (error) {
    console.error("Error updating log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


app.listen(6060, () => {
  console.log("Server running on port 6060");
});
