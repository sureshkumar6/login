import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    employeeId: String, // Add employeeId field
    isAdmin: { type: Boolean, default: false },
});

const usersModel = mongoose.model("users", userSchema);
export default usersModel;
