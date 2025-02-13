import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
  HiOutlineBriefcase, // Icon for projects
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [projects, setProjects] = useState([]); // State for projects
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0); // Total projects
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);
  const [lastMonthProjects, setLastMonthProjects] = useState(0); // Last month projects
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/user/getusers?limit=5",
          {
            credentials: "include", // Include cookies for authentication
          }
        );
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log("Error fetching users:", error.message);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/post/getposts?limit=5",
          {
            credentials: "include", // Include cookies
          }
        );
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log("Error fetching posts:", error.message);
      }
    };

    const fetchComments = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/comment/getcomments?limit=5",
          {
            credentials: "include", // Include cookies
          }
        );
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setTotalComments(data.totalComments);
          setLastMonthComments(data.lastMonthComments);
        }
      } catch (error) {
        console.log("Error fetching comments:", error.message);
      }
    };

    const fetchProjects = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/project/getprojects?limit=5",
          {
            credentials: "include", // Include cookies
          }
        );
        const data = await res.json();
        if (res.ok) {
          setProjects(data.projects);
          setTotalProjects(data.totalProjects);
          setLastMonthProjects(data.lastMonthProjects);
        }
      } catch (error) {
        console.log("Error fetching projects:", error.message);
      }
    };

    // Check if currentUser exists and is admin
    if (currentUser && currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
      fetchProjects(); // Fetch projects
    } else {
      console.log("Not authorized to view admin dashboard");
      // Optional: redirect to home page or show error
    }
  }, [currentUser]); // Dependency array ensures effect runs when currentUser changes

  return (
    <div className="p-3 md:mx-auto">
      {/* Top Section: Total Users and Total Comments Cards */}
      <div className="flex-wrap flex gap-4 justify-center">
        {/* Total Users Card */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                <strong>Total Users</strong>
              </h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>

        {/* Total Comments Card */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                <strong>Total Comments</strong>
              </h3>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>
      {/* Bottom Section: Total Posts and Total Projects Cards */}
      <div className="flex-wrap flex gap-4 justify-center">
        {/* Total Posts Card */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                <strong>Total Posts</strong>
              </h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>

        {/* Total Projects Card */}
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h3 className="text-gray-500 text-md uppercase">
                <strong>Total Projects</strong>
              </h3>
              <p className="text-2xl">{totalProjects}</p>
            </div>
            <HiOutlineBriefcase className="bg-purple-600  text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex  gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthProjects}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>

      {/* Middle Section: Recent Users and Recent Comments Tables */}
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        {/* Recent Users Table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={user.profilePicture}
                        alt="user"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* Recent Comments Table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent comments</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=comments"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
            </Table.Head>
            {comments &&
              comments.map((comment) => (
                <Table.Body key={comment._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </Table.Cell>
                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>

      {/* Bottom Section: Recent Posts and Recent Projects Tables */}
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        {/* Recent Posts Table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post Title</Table.HeadCell>
              {/* <Table.HeadCell>Category</Table.HeadCell> */}
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={post.image}
                        alt="user"
                        className="w-14 h-10 rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">{post.title}</Table.Cell>
                    {/* <Table.Cell className="w-5">{post.category}</Table.Cell> */}
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        {/* Recent Projects Table */}
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between  p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent projects</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link to={"/dashboard?tab=projects"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Project image</Table.HeadCell>
              <Table.HeadCell>Project Title</Table.HeadCell>
              {/* <Table.HeadCell>Category</Table.HeadCell> */}
            </Table.Head>
            {projects &&
              projects.map((project) => (
                <Table.Body key={project._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <img
                        src={project.image}
                        alt="project"
                        className="w-14 h-10 rounded-md bg-gray-500"
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">{project.title}</Table.Cell>
                    {/* <Table.Cell className="w-5">{project.category}</Table.Cell> */}
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
