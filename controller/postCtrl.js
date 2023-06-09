const AsyncHandler = require("express-async-handler");
const User = require("../model/user");
const Post = require("../model/post");

// CREATE POST
exports.createPostCtrl = AsyncHandler(async (req, res) => {
  const { title, content, imageUrl } = req.body;
  const post = new Post({
    title,
    content,
    imageUrl,
    creator: req.userId,
  });
  const result = await post.save();
  res.status(201).json({ message: "Post created", post: result });
});

// GET ALL POSTS
exports.getAllPostCtrl = AsyncHandler(async (req, res) => {
  const posts = await Post.find().populate("creator","username").populate("likes","username").populate("comments.creator","username");
  res.status(200).json({ posts });
});

// GET SPECIFIC POST BY IT'S ID
exports.getPostByIdCtrl = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id).populate("creator","username").populate("likes","username").populate("comments.creator","username");
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  res.status(200).json({ post });
});

// UPDATE POST MEANS IT'S CONTENT
exports.updatePostByIdCtrl = AsyncHandler(async (req, res) => {
  const { title, content, imageUrl } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (post.creator.toString() !== req.userId) {
    return res.status(401).json({ message: "Not authorized" });
  }
  post.title = title;
  post.content = content;
  post.imageUrl = imageUrl;
  const result = await post.save();
  res.status(200).json({ message: "Post updated", post: result });
});

// DELETE POST
exports.deletePostByIdCtrl = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (post.creator.toString() !== req.userId) {
    return res.status(401).json({ message: "Not authorized" });
  }
  // await post.remove();
  await Post.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Post deleted" });
});

// LIKE POST
exports.likePostByIdCtrl = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (post.likes.includes(req.userId)) {
    return res.status(400).json({ message: "Post already liked" });
  }
  post.likes.push(req.userId);
  const result = await post.save();
  res.status(200).json({ message: "Post liked", post: result });
});

// UNLIKE POST
exports.unlikePostByIdCtrl = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  if (!post.likes.includes(req.userId)) {
    return res.status(400).json({ message: "Post not liked" });
  }
  post.likes = post.likes.filter((like) => like.toString() !== req.userId);
  const result = await post.save();
  res.status(200).json({ message: "Post unliked", post: result });
});

// COMMENT ON POST
exports.commentPostByIdCtrl = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  const comment = {
    content: req.body.content,
    creator: req.userId,
  };
  post.comments.push(comment);
  const result = await post.save();
  res.status(200).json({ message: "Comment added", post: result });
});

// DELETE COMMENT
exports.deleteCommentPostByIdCtrl = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }
  const comment = post.comments.find(
    (comment) => comment._id.toString() === req.params.commentId
  );
  if (!comment) {
    return res.status(404).json({ message: "Comment not found" });
  }
  if (comment.creator.toString() !== req.userId) {
    return res.status(401).json({ message: "User not authorized" });
  }
  post.comments = post.comments.filter(
    (comment) => comment._id.toString() !== req.params.commentId
  );
  const result = await post.save();
  res.status(200).json({ message: "Comment deleted", post: result });
});

// COUNT LIKES ON PARTICULAR POST
exports.countLikesOnPostCtrl = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const noOfLikes = post.likes.length;

  res.status(200).json({
    message: `Number of likes on this post are ${noOfLikes}`,
    noOfLikes,
  });
});

// COUNT COMMENTS ON PARTICULAR POST
exports.countCommentsOnPostCtrl = AsyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.postId);
  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const noOfComments = post.comments.length;

  res.status(200).json({
    message: `Number of comments on given post are ${noOfComments}`,
    noOfComments,
  });
});


// 641a1027a5509ab3dcd18504
// 641a1027a5509ab3dcd18504