import streakModel from "../../database/models/streak";

export default async (id) => {
  const streak = await streakModel.findOne({ user: id }).lean();
  if (streak) {
    return streak;
  } else {
    return "No data found";
  }
};
