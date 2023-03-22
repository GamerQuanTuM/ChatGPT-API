import express from "express";
import { openai } from "./index.js";
import Chatgpt from "./schema.js";

const router = express.Router();

router.get("/history", async (_, res) => {
  try {
    const chats = await Chatgpt.find({}).sort({ createdAt: -1 });
    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.post("/turbo-3.5", async (req, res) => {
  const { content } = req.body;
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: content }],
    });
    const { choices } = response.data;
    const messageContent = choices[0].message.content;

    console.log(choices[0].message.content);

    const chatResponse = new Chatgpt({
      query: content,
      response: messageContent,
    });
    const savedChatResponse = await chatResponse.save();
    const chat = savedChatResponse;

    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

router.delete("/turbo-3.5/delete/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await Chatgpt.deleteOne({ _id: id });
    res.status(200).json({ response: `Document with ${id} has been deleted` });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});
router.delete("/turbo-3.5/delete", async (_, res) => {
  try {
    await Chatgpt.deleteMany();
    res
      .status(200)
      .json({ response: `Everything in the database are cleared` });
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
});

export default router;
