import Post from "../models/Post.js";
import User from "../models/User.js";
/* CREATE */
export const createPost = async (req, res) => {
  try {
    const { userId, description, picturePath } = req.body;
    const user = await User.findById(userId);
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    //Save post in to DB
    await newPost.save();
    //getting all posts
    const post = await Post.find();
    //Send post to front end
    res.status(201).json(post);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

/* READ  */
export const getFeedPosts = async (req, res) => {
  try {
    //GET all post
    const post = await Post.find();
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

/* UPDATE */

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    // get post
    const post = await Post.findById(id);
    // see if user has liked post
    const isLiked = post.likes.get(userId);

    if (isLiked) {
      //remove if already liked
      post.likes.delete(userId);
    } else {
      //set if has not been liked
      post.likes.set(userId, true);
    }
    // updated post with new list of likes and update the front end
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { likes: post.likes },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
