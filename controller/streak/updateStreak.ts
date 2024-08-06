import streakModel from "../../database/models/streak";

export default async (input) => {
  const streak = await streakModel.findOneAndUpdate({ _id: input._id }, input, {
    new: true,
  });
  return streak;
};
