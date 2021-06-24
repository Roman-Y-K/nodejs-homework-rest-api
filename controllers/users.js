const jwt = require("jsonwebtoken");
const User = require("../repositories/users");
const { httpCode } = require("../helpers/constans");
const UploadAvatarService = require("../services/local-uploud");
const EmailService = require("../services/email");
const CreateSenderNodemailer = require("../services/email-sender");

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

    const { email, name, subscription, avatar, verifyToken } =
      await User.createUser(req.body);

    try {
      const emailService = new EmailService(
        process.env.NODE_ENV,
        new CreateSenderNodemailer()
      );

      await emailService.sendVerifyEmail(verifyToken, email, name);
    } catch (error) {
      console.log(error.message);
    }

    return res.status(httpCode.CREATED).json({
      status: "success",
      code: httpCode.CREATED,
      data: { email, subscription, avatar },
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    const isValidPassword = await user?.isValidPassword(req.body.password);

    if (!user || !isValidPassword || !user.verify) {
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

    const { email, subscription, avatar } = req.user;

    return res.status(httpCode.OK).json({
      status: "success",
      code: httpCode.OK,
      data: { email, subscription, avatar },
    });
  } catch (e) {
    next(e);
  }
};

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id;
    const uploads = new UploadAvatarService(process.env.AVATAR_OF_USERS);
    const avatarUrl = await uploads.saveAvatar({ idUser: id, file: req.file });
    await User.updateAvatar(id, avatarUrl);
    res.json({ status: "success", code: 200, data: { avatarUrl } });
  } catch (e) {}
};

module.exports = { signup, login, logout, current, avatars };
