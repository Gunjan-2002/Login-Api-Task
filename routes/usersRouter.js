const express = require("express");

const { registerUserCtrl , loginUserCtrl , forgetUserCtrl } = require("../controller/userCtrl");
const isLogin = require("../middlewares/isLogin");



const userRouter = express.Router();

userRouter.post("/register" , registerUserCtrl );

userRouter.post("/login" , loginUserCtrl);

userRouter.post("/forget" ,forgetUserCtrl );


module.exports = userRouter;