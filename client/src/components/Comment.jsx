import moment from "moment";
import { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Button, Textarea } from "flowbite-react";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

export default function Comment({
  comment,
  onLike,
  onEdit,
  onDelete,
  onReply,
}) {
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/user/${comment.userId}`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getUser();
  }, [comment.userId]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
  };

  const handleSave = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/comment/editComment/${comment._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: editedContent }),
        }
      );
      if (res.ok) {
        setIsEditing(false);
        onEdit(comment, editedContent);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    if (onReply) {
      onReply(comment._id, replyContent);
      setReplyContent("");
      setShowReplyForm(false);
    }
  };

  return (
    <div className="flex flex-col p-4 border-b dark:border-gray-600 text-sm">
      <div className="flex">
        <div className="flex-shrink-0 mr-3">
          <img
            className="w-10 h-10 rounded-full bg-gray-200"
            src={user.profilePicture}
            alt={user.username}
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center mb-1">
            <span className="font-bold mr-1 text-xs truncate">
              {user ? `@${user.username}` : "anonymous user"}
            </span>
            <span className="text-gray-500 text-xs">
              {moment(comment.createdAt).fromNow()}
            </span>
          </div>
          {isEditing ? (
            <>
              <Textarea
                className="mb-2"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex justify-end gap-2 text-xs">
                <Button
                  type="button"
                  size="sm"
                  gradientDuoTone="purpleToBlue"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  type="button"
                  size="sm"
                  gradientDuoTone="purpleToBlue"
                  outline
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-gray-500 pb-2">{comment.content}</p>
              <div className="flex items-center pt-2 text-xs border-t dark:border-gray-700 max-w-fit gap-2">
                <button
                  type="button"
                  onClick={() => onLike(comment._id)}
                  className={`text-gray-400 hover:text-blue-500 ${
                    currentUser &&
                    comment.likes.includes(currentUser._id) &&
                    "!text-blue-500"
                  }`}
                >
                  <FaThumbsUp className="text-sm" />
                </button>
                <p className="text-gray-400">
                  {comment.numberOfLikes > 0 &&
                    comment.numberOfLikes +
                      " " +
                      (comment.numberOfLikes === 1 ? "like" : "likes")}
                </p>
                {currentUser &&
                  (currentUser._id === comment.userId ||
                    currentUser.isAdmin) && (
                    <>
                      <button
                        type="button"
                        onClick={handleEdit}
                        className="text-gray-400 hover:text-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(comment._id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </>
                  )}
                <button
                  type="button"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-gray-400 hover:text-blue-500"
                >
                  Reply
                </button>
              </div>
            </>
          )}
        </div>
      </div>
      {/* Render nested replies with a vertical line */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 mt-2 relative">
          {/* Arrow */}
          <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-4">
            <span className="text-gray-400">→</span>
          </div>
          {/* Replies */}
          {comment.replies.map((reply) => (
            <Comment
              key={reply._id}
              comment={reply}
              onLike={onLike}
              onEdit={onEdit}
              onDelete={onDelete}
              onReply={onReply}
            />
          ))}
        </div>
      )}

      {/* Reply form */}
      {showReplyForm && (
        <form onSubmit={handleReplySubmit} className="mt-2 ml-12">
          <Textarea
            placeholder="Write your reply..."
            rows="2"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <div className="flex justify-end mt-2 gap-2">
            <Button type="submit" size="xs" gradientDuoTone="purpleToBlue">
              Submit Reply
            </Button>
            <Button
              type="button"
              size="xs"
              outline
              onClick={() => {
                setShowReplyForm(false);
                setReplyContent("");
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
