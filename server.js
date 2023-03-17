require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const login = require('./routes/login');
const register = require('./routes/register');
const forgetPass = require('./routes/forgetPassword');
require('./config/dbConnect');


const app = express();

app.use(bodyParser.json());
app.use(login);
app.use(register);
app.use(forgetPass)

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
