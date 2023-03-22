import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema(
  {
    query: { type: String },
    response: { type: String },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model.ChatgptResponse ||
  mongoose.model("ChatgptResponse", ChatSchema);
