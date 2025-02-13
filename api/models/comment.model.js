// models/Comment.js
import mongoose from "mongoose";
const { Schema } = mongoose;

export const CommentSchema = new Schema(
  {
    content: { type: String, required: true },
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    // New field to identify if the comment is a reply:
    parentCommentId: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      default: null,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    numberOfLikes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);
