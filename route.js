import express from "express";
import { openai } from "./index.js";
import Chatgpt from "./schema.js";
import Dalle from "./dalle.js";

const router = express.Router();

router.get("/history", async (req, res) => {
  try {
    const excludeId = req.query.exclude;
    let chats = await Chatgpt.find({}).sort({ createdAt: -1 });
    if (excludeId) {
      chats = chats.filter((chat) => chat._id.toString() !== excludeId);
    }
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

router.post("/dalle", async (req, res) => {
  const image = req.body.image;
  try {
    const response = await openai.createImage({
      prompt: image,
      n: 1,
      size: "1024x1024",
    });

    const { url } = response.data.data[0];
    const chatResponse = new Dalle({
      image: image,
      response: url,
    });
    const savedChatResponse = await chatResponse.save();
    const chat = savedChatResponse;
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: "Error" });
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
