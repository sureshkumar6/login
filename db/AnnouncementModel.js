import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema({
  message: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model("Announcement", AnnouncementSchema);
