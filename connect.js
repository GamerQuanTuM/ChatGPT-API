import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const url = process.env.MONGO_URI;

const dbConnect = () => {
  try {
    mongoose.connect(url);
    console.log("Database connection established");
  } catch (error) {
    console.error(error);
  }
};


export default dbConnect;
