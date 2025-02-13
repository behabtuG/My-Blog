import React from "react";

export default function ProjectCard({ project }) {
  return (
    <div className="border border-gray-200 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-48 object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{project.title}</h2>
        <p className="text-gray-600 mb-4">{project.description}</p>
        <div className="flex gap-4">
          <a
            href={project.demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Live Demo
          </a>
          <a
            href={project.sourceCodeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Source Code
          </a>
        </div>
        <div className="mt-4">
          <a
            href={project.purchaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-teal-500 text-white px-4 py-2 rounded-md hover:bg-teal-600 transition-colors"
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
}
