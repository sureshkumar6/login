import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    employeeId: String // Add employeeId field
});

const usersModel = mongoose.model("users", userSchema);
export default usersModel;
