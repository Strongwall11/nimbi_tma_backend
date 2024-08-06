import { Schema, model } from "mongoose";
import { imgs } from "../../lib/rank";

export const userLvlprice = [
  { rank: 1, value: 0 },
  { rank: 2, value: 5000000 },
  { rank: 3, value: 10000000 },
  { rank: 4, value: 500000000 },
  { rank: 5, value: 1000000000 },
];

// Define the user schema
const userSchema = new Schema({
  userId: { type: String },
  friends: [{ type: String }],
  firstName: { type: String },
  lastName: { type: String },
  balance: { type: Number, default: 0 },
  boost: {
    used: { type: Number, default: 500 },
    total: { type: Number, default: 500 },
    lvl: { type: Number, default: 1 },
  },
  tap: { type: Number, default: 1 },
  social: {
    x: { type: Boolean, default: false },
    tg: { type: Boolean, default: false },
    yt: { type: Boolean, default: false },
    discord: { type: Boolean, default: false },
    insta: { type: Boolean, default: false },
    red: { type: Boolean, default: false },
  },
  mine: {
    profit: { type: Number, default: 0 },
    accumulatedProfit: { type: Number, default: 0 }, // New field to accumulate profit
    cards: {
      type: [
        {
          type: { type: String, default: "Caubvick" },
          lvl: { type: Number, default: 0 },
        },
        {
          type: { type: String, default: "Kosciuszko" },
          lvl: { type: Number, default: 0 },
        },
        {
          type: { type: String, default: "Musala" },
          lvl: { type: Number, default: 0 },
        },
        {
          type: { type: String, default: "Mount Etna" },
          lvl: { type: Number, default: 0 },
        },
        {
          type: { type: String, default: "Nyiragongo" },
          lvl: { type: Number, default: 0 },
        },
        {
          type: { type: String, default: "Aoraki" },
          lvl: { type: Number, default: 0 },
        },
        {
          type: { type: String, default: "Mount Kinabalu" },
          lvl: { type: Number, default: 0 },
        },
        {
          type: { type: String, default: "Matterhorn" },
          lvl: { type: Number, default: 0 },
        },
      ],
      default: [
        { type: "Caubvick", lvl: 0 },
        { type: "Kosciuszko", lvl: 0 },
        { type: "Musala", lvl: 0 },
        { type: "Mount Etna", lvl: 0 },
        { type: "Nyiragongo", lvl: 0 },
        { type: "Aoraki", lvl: 0 },
        { type: "Mount Kinabalu", lvl: 0 },
        { type: "Matterhorn", lvl: 0 },
      ],
    },
  },
  ranking: {
    rank: { type: Number, default: 1 },
    less: {
      type: Number,
      default: 0,
    },
    greater: {
      type: Number,
      default: 4999999,
    },
  },
});

// Create the user model
const userModel = model("users", userSchema);

// Function to update boost used
const updateBoostUsed = async () => {
  try {
    await userModel.updateMany(
      { $expr: { $lt: ["$boost.used", "$boost.total"] } },
      { $inc: { "boost.used": 1 } }
    );
    // console.log("Boost used updated for eligible users");
  } catch (error) {
    console.error("Error updating boost used:", error);
  }
};

const baseIncrementInterval = 10; // Base update interval in seconds
const profitUpdateInterval = 3600; // Total interval in seconds (1 hour)

// Function to update user balance based on mine profit incrementally
const updateUserBalanceIncrementally = async () => {
  try {
    // Fetch users with positive mine profit
    const users = await userModel.find({ "mine.profit": { $gt: 0 } });

    for (const user of users) {
      const profitPerInterval =
        user.mine.profit / (profitUpdateInterval / baseIncrementInterval);

      // Accumulate the profit
      const newAccumulatedProfit =
        user.mine.accumulatedProfit + profitPerInterval;

      // Calculate the profit to add to the balance (rounded down)
      const profitToAddToBalance = Math.floor(newAccumulatedProfit);
      let ranking: any = user?.ranking;

      // Calculate the remaining accumulated profit
      const remainingAccumulatedProfit =
        newAccumulatedProfit - profitToAddToBalance;

      const balance = user.balance + profitToAddToBalance;
      console.log(balance,"balla");
      
      if (user.ranking.rank < 5 && balance > user.ranking.greater) {
        ranking = {
          rank: user.ranking.rank + 1,
          less: 0,
          greater: imgs.find((item) => item.rank === user.ranking.rank+1)
            ?.greater,
        };
      }
      // Update the user's balance and accumulated profit
      await userModel.updateOne(
        { userId: user.userId },
        {
          $inc: { balance: profitToAddToBalance },
          $set: { "mine.accumulatedProfit": remainingAccumulatedProfit },
          ranking,
        }
      );

      console.log(
        profitPerInterval,
        "User balance updated based on mine profit incrementally",
        user.firstName
      );
    }
  } catch (error) {
    console.error("Error updating user balance incrementally:", error);
  }
};
//updateBoost
setInterval(updateBoostUsed, 1000);

// Set the interval to call updateUserBalanceIncrementally every baseIncrementInterval seconds
setInterval(updateUserBalanceIncrementally, baseIncrementInterval * 1000);

// Initial call to updateUserBalanceIncrementally
updateUserBalanceIncrementally();

export default userModel;
