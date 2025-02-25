import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Timelog from "./db/timelog.js"; // Import your model
import usersModel from "./db/user.js";
import dotenv from "dotenv";
dotenv.config();


const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Connect to MongoDBcoMPASS
// mongoose.connect("mongodb://127.0.0.1:27017/timelogger", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect(process.env.MONGO_URI, {
  authSource: "admin"
});


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



// app.post("/logs", async (req, res) => {
//   try {
//     const { date, comment, ...logTimes } = req.body;
//     const userEmail = req.headers["user-email"];

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
//       logEntry = new Timelog({ date, employeeName, comment });

//       for (const [key, value] of Object.entries(logTimes)) {
//         logEntry[fieldMap[key]] = value;
//       }
//     }

//     // 🔹 Function to Calculate Hours Difference (Only Counts If > 5 min)
//     const calculateHours = (start, end) => {
//       if (!start || !end) return 0;

//       const startTime = new Date(`2023-01-01T${start}`);
//       let endTime = new Date(`2023-01-01T${end}`);

//       if (endTime < startTime) {
//         endTime.setDate(endTime.getDate() + 1);
//       }

//       const diff = (endTime - startTime) / (1000 * 60); // Convert ms to minutes
//       return diff > 5 ? diff / 60 : 0; // Only count if > 5 minutes
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

//     // ✅ Store in MongoDB in HH:MM Format
//     logEntry.totalLoginHours = convertDecimalToHHMM(totalLoginHours);
//     logEntry.breakDuration = convertDecimalToHHMM(breakDuration);
//     logEntry.actualLoginHours = actualLoginHoursFormatted;

//     await logEntry.save();
//     res.json({ message: "Time log submitted successfully!" });
//   } catch (error) {
//     console.error("Error submitting log:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.post("/logs", async (req, res) => {
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
      logEntry = new Timelog({ date, employeeName, comment });

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





app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔹 Check if the email already exists
    const existingUser = await usersModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // 🔹 Create a new user if email is not found
    let user = new usersModel({ name, email, password });
    let result = await user.save();
    res.json(result);
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

  
app.post('/login', async (req, resp) => {
  // let user = await usersModel.findOne(req.body).select("-password")
  if (req.body.email && req.body.password) {
      let user = await usersModel.findOne(req.body).select("-password")
      if (user) {
          resp.send(user)
      } else {
          resp.send({ result: "user not found" })
      }
  } else {
      resp.send({ result: "outside user not found" })
  }

})
app.listen(6060, () => {
  console.log("Server running on port 6060");
});
