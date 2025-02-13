import { Link } from "react-router-dom";

export default function CommentCard({ comment }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <p className="text-sm text-gray-600">{comment.content}</p>
      {comment.postId?.slug && (
        <Link
          to={`/post/${comment.postId.slug}`}
          className="text-xs text-teal-500 hover:underline mt-2 block"
        >
          View Post
        </Link>
      )}
    </div>
  );
}
