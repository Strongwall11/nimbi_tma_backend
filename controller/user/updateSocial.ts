import userModel from "../../database/models/user";

export default async (input) => {
  const user = await userModel.findById({ _id: input._id }).lean();

  const updatedUser = await userModel.findByIdAndUpdate(
    { _id: input._id },
    { social: input.social, balance: user.balance + 25000 },
    { new: true }
  );
  return updatedUser;
};
