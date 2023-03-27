import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema(
  {
    image: { type: String },
    response: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.DalleResponse ||
  mongoose.model("DalleResponse", ChatSchema);
