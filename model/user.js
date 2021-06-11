const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { subscription } = require("../helpers/constans");
const SALT_WORK_FACTOR = 8;
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      default: "Guest",
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: [subscription.STARTER, subscription.PRO, subscription.BUSINESS],
      default: subscription.STARTER,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model("user", userSchema);

module.exports = User;
