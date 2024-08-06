import userModel from "../../database/models/user";

export default async (input) => {
  const user = await userModel.findById({ _id: input._id }).lean();

  if (user.balance < input.price) {
    return {
      message: "You don't have enough balance",
    };
  } else {
    const updateduser = await userModel.findByIdAndUpdate(
      { _id: input._id },
      {
        balance: user.balance - input.price,
        tap: user.tap + 1,
      },
      { new: true }
    );
    return {
      user: updateduser,
    };
  }
};
