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

const verification = async (req, res, next) => {
  try {
    const user = await User.findByVerifyToken(req.params.verificationToken);

    if (user) {
      await User.updateVerifyToken(user._id, true, null);

      return res.status(httpCode.OK).json({
        status: "success",
        code: httpCode.OK,
        message: "Verification successful",
      });
    }

    return res.status(httpCode.UNAUTHORIZED).json({
      status: "error",
      code: httpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};
const repeatVerification = async (req, res, next) => {
  try {
    const user = await User.findByEmail(req.body.email);
    console.log("jhbhjckxh");
    if (user) {
      const { name, email, verify, verifyToken } = user;
      if (!verify) {
        const emailService = new EmailService(
          process.env.NODE_ENV,
          new CreateSenderNodemailer()
        );
        await emailService.sendVerifyEmail(verifyToken, email, name);
        return res.json({
          status: "success",
          code: 200,
          data: { message: "Verification email sent" },
        });
      }
      return res.status(httpCode.CONFLICT).json({
        status: "error",
        code: httpCode.BAD_REQUEST,
        message: "Verification has already been passed",
      });
    }
    return res.status(httpCode.NOT_FOUND).json({
      status: "error",
      code: httpCode.NOT_FOUND,
      message: "User not found",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  login,
  logout,
  current,
  avatars,
  verification,
  repeatVerification,
};
