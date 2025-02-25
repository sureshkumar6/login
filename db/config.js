import mongoose from "mongoose";
// mongoose.set('strictQuery', false)


// const mongoURI = "mongodb://127.0.0.1:27017/timeLogger"; // Use 127.0.0.1 instead of localhost
const mongoURI = "mongodb+srv://scorpio420421:TkvF7Xud7uJYmSNY@cluster0.xxxxx.mongodb.net/timelogger?retryWrites=true&w=majority";


mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB ✅"))
  .catch((err) => console.error("MongoDB connection error ❌", err));

export default mongoose;
