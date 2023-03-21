const AsyncHandler = require("express-async-handler");
const User = require("../model/user");
const generateToken = require("../utils/generateToken");
const verifyToken = require("../utils/verifyToken");
const transporter = require("../utils/mailSender");
const jwt = require("jsonwebtoken");

// REGISTER USER ON SERVER 
exports.registerUserCtrl = AsyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: "Something went wrong",
    });
  }
});

// USER LOGIN ON SERVER 
exports.loginUserCtrl = AsyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ Error: "Please enter email & password" });
    }

    User.findOne({ email }).then(async (user) => {
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }

      if (user && (await user.verifyPassword(password))) {
        const token = generateToken(user._id);

        if (token) {
          const verify = verifyToken(token);
          console.log(verify);
        }

        return res.json({ data: generateToken(user._id), user });
      } else {
        return res.json({ message: "Invalid login credentials" });
      }
    });
  } catch (error) {
    res.status(400).json({
      status: "Something went wrong",
    });
  }
});

// FORGET PASSWORD 
exports.forgetUserCtrl = AsyncHandler(async (req, res) => {
  try {
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
  } catch (error) {
    res.status(400).json({
      status: "Something went wrong",
    });
  }
});
