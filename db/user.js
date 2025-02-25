import mongoose from "mongoose";
const userScheme =  new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const usersModel = mongoose.model('users', userScheme)
export default usersModel


