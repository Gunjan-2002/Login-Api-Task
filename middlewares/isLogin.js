const verifyToken = require("../utils/verifyToken");

const isLogin = async (req, res, next) => {
  const headerObj = req.headers;
  const token = headerObj.authorization.split(" ")[1];
  //   console.log(token);

  const verifiedToken = verifyToken(token);

  if (verifiedToken) {
    req.userId = verifiedToken.id;
    // return verifiedToken;
    next();
  } else {
    const err = new Error("Token expired/invalid");
    next(err);
  }
};

module.exports = isLogin;
