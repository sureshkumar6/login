import mongoose from "mongoose";

// const timelogSchema = new mongoose.Schema({
//   date: String,
//   employeeName: String,
//   email: String,  // 🔹 Added email field
//   loginTime: String,
//   dinnerStartTime: String,
//   dinnerEndTime: String,
//   logoutTime: String,
//   shortBreak1Start: String,
//   shortBreak1End: String,
//   shortBreak2Start: String,
//   shortBreak2End: String,
//   shortBreak3Start: String,
//   shortBreak3End: String,
//   comment: String,
//   totalLoginHours: String,
//   breakDuration: String,
//   actualLoginHours: String,
//   adminLoginHours: String
// });

// const Timelog = mongoose.model("Timelog", timelogSchema);
// export default Timelog;
const timelogSchema = new mongoose.Schema({
  date: String,
  employeeName: String,
  email: String,
  loginTime: String,
  dinnerStartTime: String,
  dinnerEndTime: String,
  logoutTime: String,
  shortBreak1Start: String,
  shortBreak1End: String,
  shortBreak2Start: String,
  shortBreak2End: String,
  shortBreak3Start: String,
  shortBreak3End: String,
  comment: String,
  totalLoginHours: String,
  breakDuration: String,
  actualLoginHours: String,
  adminLoginHours: String,

  // ✅ Add Change History Tracking
  modifications: [
    {
      field: String,      // Field that was modified (e.g., "Login Time")
      oldTime: String,    // Previous time
      newTime: String,    // Updated time
      modifiedAt: Date    // Timestamp of modification
    }
  ]
});

const Timelog = mongoose.model("Timelog", timelogSchema);
export default Timelog;
