const express = require("express");
const User = require("../model/user");
const router = express.Router();
const jwt = require("jsonwebtoken");
const transporter = require("../utils/mailSender");

router.post("/api/forget", async (req, res) => {
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

module.exports = router;
