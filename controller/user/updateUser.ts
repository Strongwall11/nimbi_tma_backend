import userModel from "../../database/models/user";

export default async (input) => {
  const user = await userModel.findOneAndUpdate({ userId: input.userId }, input, {
    new: true,
  });
  return user;
};
