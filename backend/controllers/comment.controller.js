import Comment from "../models/comment.model.js";

/**
 * @desc    Create a new comment
 * @route   POST /api/comments
 * @access  Private
 */
export const createComment = async (req, res) => {
  try {
    const { movieId, text } = req.body;

    if (!movieId || !text) {
      return res.status(400).json({ message: "movieId and text required" });
    }

    const comment = await Comment.create({
      movieId: String(movieId),
      text,
      userId: req.user._id,
      username: req.user.username,
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * @desc    Get comments by movie ID
 * @route   GET /api/comments/:movieId
 * @access  Public
 */
export const getCommentsByMovie = async (req, res) => {
  try {
    const comments = await Comment.find({
      movieId: String(req.params.movieId),
    }).sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};