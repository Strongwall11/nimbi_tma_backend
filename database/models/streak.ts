import { model, Schema } from "mongoose";

const streakSchema = new Schema(
  {
    day: {
      type: Number,
      default: 0,
    },
    user: {
      type: String,
      ref: "users",
    },
    upcoming: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

const streakModel = model("streaks", streakSchema);

const resetStreaks = async () => {
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  try {
    await streakModel.updateMany(
      { updatedAt: { $lt: twentyFourHoursAgo } },
      { day: 0, upcoming: 1 }
    );
    console.log("Streaks reset for eligible records");
  } catch (error) {
    console.error("Error resetting streaks:", error);
  }
};

// Set the interval to call resetStreaks every hour (3600000 milliseconds)
setInterval(resetStreaks, 3600000);

export default streakModel;
