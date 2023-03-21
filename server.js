require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require("./routes/usersRouter");
const postRouter = require("./routes/postRouter");
postRouter
require('./config/dbConnect');


const app = express();

app.use(bodyParser.json());
app.use('/api/v1/user' , userRouter);
app.use('/api/v1/post' , postRouter);


const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
