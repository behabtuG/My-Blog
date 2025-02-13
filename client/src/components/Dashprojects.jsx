import { Modal, Table, Button } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineExclamationCircle } from "react-icons/hi";
const API_BASE_URL = import.meta.env.VITE_REACT_APP_BACKEND_BASEURL;

export default function DashProjects() {
  const { currentUser } = useSelector((state) => state.user);
  const [userProjects, setUserProjects] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState("");

  // Fetch projects for the current user
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/project/getprojects?userId=${currentUser._id}`,
          {
            credentials: "include", // Include cookies
          }
        );
        const data = await res.json();
        if (res.ok) {
          const projects = data.projects || []; // Set default empty array if data.projects is undefined
          setUserProjects(projects);
          if (projects.length < 11) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchProjects();
    }
  }, [currentUser._id]);

  // Load more projects
  const handleShowMore = async () => {
    const startIndex = userProjects.length;
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/project/getprojects?userId=${currentUser._id}&startIndex=${startIndex}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        const newProjects = data.projects || []; // Ensure it's an array
        setUserProjects((prev) => [...prev, ...newProjects]);
        if (newProjects.length < 11) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Delete a project
  const handleDeleteProject = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/project/deleteproject/${projectIdToDelete}/${currentUser._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const data = await res.json();
      console.log("deleted project", data);
      if (!res.ok) {
        console.log(data.message);
      } else {
        setUserProjects((prev) =>
          prev.filter((project) => project._id !== projectIdToDelete)
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userProjects.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Project image</Table.HeadCell>
              <Table.HeadCell>Project title</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            {userProjects.map((project) => (
              <Table.Body key={project._id} className="divide-y">
                <Table.Row
                  key={project._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    {new Date(project.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/update-project/${project._id}`}>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/update-project/${project._id}`}
                    >
                      {project.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/update-project/${project._id}`}
                    >
                      {project.description}
                    </Link>
                  </Table.Cell>

                  <Table.Cell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setProjectIdToDelete(project._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-project/${project._id}`}
                    >
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={handleShowMore}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no projects yet!</p>
      )}

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this project?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeleteProject}>
                Yes, I'm sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
