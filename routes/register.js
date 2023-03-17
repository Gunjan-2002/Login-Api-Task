const express = require("express");
const User = require("../model/user");
const router = express.Router();

router.post("/api/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if(!username || !email || !password){
      return res.status(400).json({ Error: 'Please enter details' });
    }

    User.findOne({ email }).then(async user => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      }

      const newUser = await User.create({
        username,
        email,
        password,
      });
  
      await newUser.save();
      res.status(201).json({
        status:"Registered Succesfully",
        data:newUser,
      });
    }); 
  } catch (error) {
    res.status(400).json({
      status:"Something went wrong"
    });
  }
});

module.exports = router;

