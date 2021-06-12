const jwt = require("jsonwebtoken");
const User = require("../repositories/users");
const { httpCode } = require("../helpers/constans");

require("dotenv").config();
const secret = process.env.SECRET;

const signup = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);

    if (user) {
      return res.status(httpCode.CONFLICT).json({
        status: "conflict",
        code: httpCode.CONFLICT,
        message: "Email in use",
      });
    }

    const { email, subscription } = await User.createUser(req.body);

    return res.status(httpCode.CREATED).json({
      status: "success",
      code: httpCode.CREATED,
      data: { email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);

    if (!user || !isValidPassword) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: "error",
        code: httpCode.UNAUTHORIZED,
        message: "Invalid credentials",
      });
    }

    const id = user.id;
    const payload = { id };
    const token = jwt.sign(payload, secret, { expiresIn: "2h" });
    await User.updateToken(id, token);
    return res.status(httpCode.OK).json({
      status: "success",
      code: httpCode.OK,
      data: { token },
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    const id = req.user.id;

    await User.updateToken(id, null);
    return res.status(httpCode.NO_CONTENT).json({});
  } catch (e) {
    next(e);
  }
};

const current = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(httpCode.UNAUTHORIZED).json({
        status: "error",
        code: httpCode.UNAUTHORIZED,
        message: "Not authorized.",
      });
    }

    const { email, subscription } = req.user;

    return res.status(httpCode.OK).json({
      status: "success",
      code: httpCode.OK,
      data: { email, subscription },
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { signup, login, logout, current };
