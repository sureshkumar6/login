import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  lastName: String,
  email: String,
  password: String,
  employeeId: String, // Add employeeId field
  isAdmin: Boolean,
});

const usersModel = mongoose.model("users", userSchema);
export default usersModel;
