import streakModel from "../../database/models/streak";
import userModel from "../../database/models/user";

export default async (user) => {
  const userData = await userModel.findOne({ userId: user.userId }).lean();
  if (userData) {
    return userData;
  } else {
    const createUser = await userModel.create(user);
    if (createUser) {
      await streakModel.create({ user: createUser._id });
    }
    return createUser;
  }
};
