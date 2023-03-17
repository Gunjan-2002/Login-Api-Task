const express = require("express");
const User = require("../model/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if(!email || !password){
      return res.status(400).json({ Error: 'Please enter email & password' });
    }

    User.findOne({ email }).then(async (user) => {
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }

      if (user && (await user.verifyPassword(password))) {
        const payload = { id: user.id, name: user.name };

        jwt.sign(
          payload,
          "logintokenkey",
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
              message: "Login Succesfull",
            });
          }
        );
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

module.exports = router;
