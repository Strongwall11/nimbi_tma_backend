import express from "express";
import getUserStreak from "../controller/streak/getUserStreak";
import updateStreak from "../controller/streak/updateStreak";
const streakRouter = express.Router();

streakRouter.get("/userStreak", async (req, res) => {
  const { _id } = req.query;
  const streakData = await getUserStreak(_id);
  res.json(streakData);
});

//updateStreak
streakRouter.post("/updateStreak", async (req, res) => {
  const input = req.body;
  const output = await updateStreak(input);
  res.json(output);
});
export default streakRouter;
