import userModel from "../../database/models/user";

export default async (input) => {
  const user = await userModel.findById({ _id: input._id }).lean();

  if (user.balance < input.price) {
    return {
      message: "You don't have enough balance",
    };
  } else {
    const updatedUser = await userModel.findByIdAndUpdate(
      { _id: input._id },
      {
        $set: {
          balance: user.balance - input.price,
          "boost.lvl": user.boost.lvl + 1,
          "boost.total": user.boost.total + input.energy,
          "boost.used": user.boost.used + input.energy,
        },
      },
      { new: true }
    );

    return {
      user: updatedUser,
    };
  }
};
