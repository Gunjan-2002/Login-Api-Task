const express = require("express");

const {
  registerUserCtrl,
  loginUserCtrl,
  forgetUserCtrl,
  logoutUserCtrl,
} = require("../controller/userCtrl");

const isLogin = require("../middlewares/isLogin");

const userRouter = express.Router();

userRouter.post("/register", registerUserCtrl);

userRouter.post("/login", loginUserCtrl);

userRouter.post("/forget", forgetUserCtrl);

userRouter.delete("/logout", isLogin, logoutUserCtrl);

module.exports = userRouter;
