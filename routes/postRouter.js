const express = require("express");

const {
  createPostCtrl,
  getAllPostCtrl,
  getPostByIdCtrl,
  updatePostByIdCtrl,
  deletePostByIdCtrl,
  likePostByIdCtrl,
  unlikePostByIdCtrl,
  commentPostByIdCtrl,
  deleteCommentPostByIdCtrl,
  countLikesOnPostCtrl,
  countCommentsOnPostCtrl,
} = require("../controller/postCtrl");

const isLogin = require("../middlewares/isLogin");

const postRouter = express.Router();

postRouter.post("/creatpost", isLogin, createPostCtrl);

postRouter.get("/getallpost", getAllPostCtrl);

postRouter.get("/getpostbyid/:id", getPostByIdCtrl);

postRouter.put("/updatepost/:id", isLogin, updatePostByIdCtrl);

postRouter.delete("/deletepost/:id", isLogin, deletePostByIdCtrl);

postRouter.post("/likepost/:id", isLogin, likePostByIdCtrl);

postRouter.delete("/unlikepost/:id", isLogin, unlikePostByIdCtrl);

postRouter.post("/commentpost/:id", isLogin, commentPostByIdCtrl);

postRouter.delete("/deletecomment/:postId/:commentId", isLogin, deleteCommentPostByIdCtrl);

postRouter.get("/noOfLikesOnPost/:postId", countLikesOnPostCtrl);

postRouter.get("/noOfCommentsOnPost/:postId", countCommentsOnPostCtrl);

module.exports = postRouter;
