const User = require("../model/user");

const findById = async (id) => {
  return await User.findById(id);
};

const findByEmail = async (email) => {
  return await User.findOne({ email: email });
};

const createUser = async (body) => {
  const user = new User(body);

  return await user.save();
};

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token });
};

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar });
};
module.exports = {
  findById,
  findByEmail,
  createUser,
  updateToken,
  updateAvatar,
};
