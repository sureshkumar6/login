// import mongoose from "mongoose";

// const employeeDetailsSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   employeeId: { type: String, required: true, unique: true },
//   email: { type: String, required: true, unique: true },
//   dob: { type: String },
//   gender: { type: String },
//   maritalStatus: { type: String },
// });

// const EmployeeDetails = mongoose.model("EmployeeDetails", employeeDetailsSchema);

// export default EmployeeDetails;
import mongoose from "mongoose";

const employeeDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  employeeId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  dob: { type: String },
  gender: { type: String },
  maritalStatus: { type: String },
  profilePicture: { type: String }, // ✅ Store image URL
  isAdmin: { type: Boolean, default: false },  // ✅ Added isAdmin field
});

const EmployeeDetails = mongoose.model("EmployeeDetails", employeeDetailsSchema);

export default EmployeeDetails;
