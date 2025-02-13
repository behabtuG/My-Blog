import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import CommentCard from "../components/CommentCard";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recentComments, setRecentComments] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/post/getPosts");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        setPosts(data.posts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchRecentComments = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/comment/getRecentcomments",
          { credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch recent comments");
        const data = await res.json();
        setRecentComments(data.comments);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
    fetchRecentComments();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 py-10">
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to my Blog</h1>
        <p className="text-gray-500 text-xs sm:text-sm">
          Here you'll find a variety of articles and tutorials on topics such as
          web development, software engineering, and programming languages.
        </p>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column: Recent Posts */}
          <div className="w-full lg:w-2/3">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-center">
                Recent Posts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {posts && posts.length > 0 ? (
                  posts.slice(0, 8).map((post) => (
                    <div key={post._id} className="w-full">
                      <PostCard post={post} />
                    </div>
                  ))
                ) : (
                  <p className="text-center w-full">No posts found.</p>
                )}
              </div>
              <Link
                to="/search"
                className="text-lg text-teal-500 hover:underline text-center"
              >
                View all posts
              </Link>
            </div>
          </div>

          {/* Right Column: Recent Comments */}
          <div className="w-full lg:w-1/3">
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-center">
                Recent Comments
              </h2>
              <div className="flex flex-col gap-2">
                {recentComments && recentComments.length > 0 ? (
                  recentComments.map((comment) => (
                    <CommentCard key={comment._id} comment={comment} />
                  ))
                ) : (
                  <p className="text-center w-full">No comments found.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
