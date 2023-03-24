const AsyncHandler = require("express-async-handler");
const User = require("../model/user");
const generateToken = require("../utils/generateToken");
const verifyToken = require("../utils/verifyToken");
const transporter = require("../utils/mailSender");
const jwt = require("jsonwebtoken");

// REGISTER USER ON SERVER
exports.registerUserCtrl = AsyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ Error: "Please enter details" });
  }

  User.findOne({ email }).then(async (user) => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    }

    const newUser = await User.create({
      username,
      email,
      password,
    });

    await newUser.save();
    res.status(201).json({
      status: "Registered Succesfully",
      data: newUser,
    });
  });
});

// USER LOGIN ON SERVER
exports.loginUserCtrl = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ Error: "Please enter email & password" });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  if (user && (await user.verifyPassword(password))) {
    const token = generateToken(user._id);

    user.tokens.push({ token });

    await user.save();

    return res.json({ data: token, user });
  } else {
    return res.json({ message: "Invalid login credentials" });
  }
});

// FORGET PASSWORD
exports.forgetUserCtrl = AsyncHandler(async (req, res) => {
  const { email } = req.body;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ email: "Email not found" });
    }

    const token = jwt.sign({ _id: user._id }, "forgetpasswordtokenkey", {
      expiresIn: "10m",
    });

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: "Password Reset Link",
      html: `<p>Click the following link to reset your password:</p><p><a href="${process.env.CLIENT_URL}/reset-password/${token}">${process.env.CLIENT_URL}/reset-password/${token}</a></p>`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Error sending email" });
      } else {
        console.log(`Email sent: ${info.response}`);
        return res.json({
          message: "Email sent with password reset instructions",
        });
      }
    });
  });
});

exports.logoutUserCtrl = AsyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.userId,
    { $pull: { tokens: { token: req.userToken } } },
    { new: true }
  );

  res.status(200).json({ message: "User logged out successfully" });
});
