import express from "express";
import {
  getprojects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createProject);
router.get("/getprojects", getprojects);
router.get("/getproject/:projectId", getProjectById);
router.put("/updateproject/:projectId/:userId", verifyToken, updateProject);
router.delete("/deleteproject/:projectId/:userId", verifyToken, deleteProject);

export default router;
