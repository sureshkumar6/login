import mongoose from "mongoose";


const timelogSchema = new mongoose.Schema({
  date: String,
  employeeName: String,
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
  totalLoginHours: String, // Stores total login hours
  breakDuration: String,   // Stores break duration
  actualLoginHours: String, // Stores actual login hours after breaks
  adminLoginHours: String
});

const Timelog = mongoose.model("Timelog", timelogSchema);
export default Timelog;


// const timelogSchema = new mongoose.Schema({
//   date: String,
//   employeeName: String,
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
// });

// const Timelog = mongoose.model("Timelog", timelogSchema);
// export default Timelog;