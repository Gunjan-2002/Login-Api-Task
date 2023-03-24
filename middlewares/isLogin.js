const User = require("../model/user");
const verifyToken = require("../utils/verifyToken");

const isLogin = async (req, res, next) => {
  const headerObj = req.headers;
  const token = headerObj.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Authorization token is required" });
  }

  const verifiedToken = verifyToken(token);

  if (verifiedToken) {
    const user = await User.findOne({
      _id: verifiedToken.id,
      tokens: {
        $elemMatch: { token: token },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Please login first to do this operation" });
    }

    req.userToken = token;
    req.userId = verifiedToken.id;
    next();
  } else {
    return res.status(400).json({ message: "Token expired/invalid" });
  }
};

module.exports = isLogin;