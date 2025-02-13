import React, { useEffect, useState } from "react";
import CallToAction from "../components/CallToAction";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch projects data from the backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/project/getprojects"
        );
        if (!res.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await res.json();
        if (Array.isArray(data.projects)) {
          // Check if 'projects' is an array
          setProjects(data.projects);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center mb-4">Projects</h1>
      <p className="text-md text-gray-500 text-center mb-8">
        Build fun and engaging projects while learning HTML, CSS, and
        JavaScript!
      </p>

      {/* Call-to-Action Section */}
      <div className="mb-12">
        <CallToAction />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}
