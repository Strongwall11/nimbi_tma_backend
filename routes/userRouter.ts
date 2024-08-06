import express from "express";
import createUser from "../controller/user/createUser";
import userInfo from "../controller/user/userInfo";
import updateUser from "../controller/user/updateUser";
import increaseTap from "../controller/user/increaseTap";
import userModel from "../database/models/user";
import increaseEnergy from "../controller/user/increaseEnergy";
import updateSocial from "../controller/user/updateSocial";
import updateMine from "../controller/user/updateMine";
const TelegramBot = require("node-telegram-bot-api");
const userRouter = express.Router();

//userInfo
userRouter.get("/userInfo", async (req, res) => {
  const { userId } = req.query;
  const user = await userInfo(userId);
  res.json(user);
});
//userFriends
userRouter.get("/userFriend", async (req, res) => {
  const { userId } = req.query;
  const userInfo = await userModel.findOne({ userId: userId }).lean();
  const friends = await Promise.all(
    userInfo.friends.map(async (friend) => {
      return await userModel.findOne({ userId: friend }).lean();
    })
  );

  res.json(friends);
});

//create user

userRouter.post("/createUser", async (req, res) => {
  const input = req.body;
  const user = await createUser(input);
  res.json(user);
});

//updateUser
userRouter.post("/updateUser", async (req, res) => {
  const input = req.body;
  const user = await updateUser(input);
  res.json(user);
});

//increase tap
userRouter.post("/increaseTap", async (req, res) => {
  const input = req.body;
  const user = await increaseTap(input);
  res.json(user);
});
//increase energy
userRouter.post("/increaseEnergy", async (req, res) => {
  const input = req.body;
  const user = await increaseEnergy(input);
  res.json(user);
});

//update social
userRouter.post("/updateSocial", async (req, res) => {
  const input = req.body;
  const user = await updateSocial(input);
  res.json(user);
});

//
userRouter.post("/updateMine", async (req, res) => {
  const input = req.body;
  const user = await updateMine(input);
  res.json(user);
});
export default userRouter;
