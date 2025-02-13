import Project from "../models/project.model.js";
import { errorHandler } from "../utils/errorHandler.js";

// Create a new project
export const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      image,
      demoLink,
      sourceCodeLink,
      purchaseLink,
    } = req.body;

    // Ensure all required fields are present
    if (
      !title ||
      !description ||
      !image ||
      !demoLink ||
      !purchaseLink ||
      !sourceCodeLink
    ) {
      return next(errorHandler(400, "Please provide all required fields"));
    }

    const newProject = new Project({
      ...req.body, // Spread req.body first
      postedBy: req.user.id, // Explicitly set postedBy
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject); // Send back the saved project
  } catch (error) {
    console.error("Error creating project:", error); // Debug log
    if (error.name === "ValidationError") {
      return next(errorHandler(400, error.message));
    }
    next(error);
  }
};

export const getprojects = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const projects = await Project.find({
      ...(req.query.userId && { postedBy: req.query.userId }),
      ...(req.query.title && {
        title: { $regex: req.query.title, $options: "i" },
      }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.projectId && { _id: req.query.projectId }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalProjects = await Project.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthProjects = await Project.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      projects,
      totalProjects,
      lastMonthProjects,
    });
  } catch (error) {
    next(error);
  }
};

// Get all projects
export const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// Get a single project by ID
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.projectId).populate(
      "postedBy"
    );
    if (!project) {
      return next(errorHandler(404, "Project not found"));
    }
    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// Update a project
export const updateProject = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to update this project")
    );
  }
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.projectId,
      {
        $set: {
          title: req.body.title,
          description: req.body.description,
          image: req.body.image,
          category: req.body.category,
          demoLink: req.body.demoLink,
          sourceCodeLink: req.body.sourceCodeLink,
          purchaseLink: req.body.purchaseLink,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedProject);
  } catch (error) {
    next(error);
  }
};

// Delete a project
export const deleteProject = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    const deletedProject = await Project.findByIdAndDelete(
      req.params.projectId
    );
    if (!deletedProject) {
      return next(errorHandler(404, "Project not found"));
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};
