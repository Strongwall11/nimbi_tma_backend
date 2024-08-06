import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import initiateMongoServer from "./database";
import bodyParser from "body-parser";
import userRouter from "./routes/userRouter";
import cors from "cors";
import streakRouter from "./routes/streakRouter";
import streakModel from "./database/models/streak";
import userModel from "./database/models/user";
const TelegramBot = require("node-telegram-bot-api");
const token = "7418211632:AAEGDALwI7WgJ1m_lQzrxjLkscALCEUlwaY"; // Replace with your bot token
const bot = new TelegramBot(token, { polling: true });
const userFriends = {};
const referrals = {};
bot.onText(/\/start (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const referrerId = match[1]; // Extract referrer ID from the start parameter
  const user = await userModel.findOne({ userId: referrerId }).lean();
  const refUser = await userModel.findOne({ userId: chatId }).lean();
  // Handle new user joining via referral link
  if (!refUser) {
    const newUser = await userModel.create({
      userId: msg.chat.id,
      firstName: msg.chat.first_name,
      lastName: msg.chat.last_name,
    });
    await streakModel.create({ user: newUser._id });

    if (referrerId) {
      await userModel.findOneAndUpdate(
        { userId: referrerId },
        { $push: { friends: chatId }, $inc: { balance: 5000 } }
      ),
        await userModel.findOneAndUpdate(
          { userId: chatId },
          {
            $push: { friends: referrerId },
            $inc: { balance: 5000 },
          },
          { new: true }
        );
      bot.sendMessage(referrerId, `You have a new referral: ${chatId}`);
      bot.sendMessage(
        chatId,
        `Welcome! You were referred by user ${user.firstName}.`
      );
    } else {
      bot.sendMessage(chatId, "Welcome to the xda bot");
    }
  }
});
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});
app.use(cors());
app.use(bodyParser.json());
app.use("/tma", userRouter);
app.use("/tma", streakRouter);

app.listen(port, async () => {
  await initiateMongoServer();
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
