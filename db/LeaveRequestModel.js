import mongoose from "mongoose";

// Leave Request Schema
const leaveRequestSchema = new mongoose.Schema({
  email: { type: String, required: true }, // Store user's email instead of employeeName
  requestDate: { type: String, required: true },
  requestTime: { type: String, required: true },
  leaveType: { type: String, required: true },
  fromDate: { 
    type: String, 
    required: function() { return this.leaveType === "Full Day Off" || this.leaveType === "Multiple Days Off"; } 
  },
  toDate: { 
    type: String, 
    required: function() { return this.leaveType === "Full Day Off" || this.leaveType === "Multiple Days Off"; } 
  },
  specificTime: { 
    type: String, 
    required: function() { return this.leaveType === "Arriving Late" || this.leaveType === "Leaving Early"; } 
  },
  leaveReason: { type: String, required: true },
  compensationOption: { type: String, required: true },
  status: { type: String, default: "Pending" }, // Default status is Pending
});

// Export the Model
const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);
export default LeaveRequest;
