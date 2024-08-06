import userModel from "../../database/models/user";

export default async (input) => {
  const userInfo = await userModel.findOne({ userId: input }).lean();
  if (userInfo) {
    return userInfo;
  } else {
    return "No data found";
  }
};
