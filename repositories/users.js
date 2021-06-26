const User = require("../model/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email });
};
const findByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken });
};

const createUser = async (body) => {
  const user = new User(body);

  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateVerifyToken = async (id, verify, verifyToken) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken });
};

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar });
};
module.exports = {
  findById,
  findByEmail,
  findByVerifyToken,
  createUser,
  updateToken,
  updateVerifyToken,
  updateAvatar,
};
