import mongoose from "mongoose";

const dailyActivitySchema = new mongoose.Schema({
  email: { type: String, required: true },
  employeeName: { type: String, required: true },
  date: { type: String, required: true },
  work: { type: String, required: true },
  subWorkType: { type: String, required: true },
  sheekLink: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: null },
});

export default mongoose.model("DailyActivity", dailyActivitySchema);
