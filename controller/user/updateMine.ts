import userModel from "../../database/models/user";

export default async (input) => {
  try {
    const user = await userModel.findById(input._id).lean();

    if (!user) {
      throw new Error("User not found");
    }
    if (user.balance < input.balance) {
      return {
        message: "You don't have enough balance",
      };
    } else {
      const updateUser = await userModel
        .findOneAndUpdate(
          { _id: input._id, "mine.cards.type": input.type },
          {
            $set: {
              "mine.profit": user.mine.profit + input.profit,
              "mine.cards.$.lvl": input.level,
            },

            balance: user.balance - input.balance,
          },
          {
            new: true,
          }
        )
        .lean();

      return { user: updateUser };
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
