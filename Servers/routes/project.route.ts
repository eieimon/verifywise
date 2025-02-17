import express from "express";
const router = express.Router();

import {
  createProject,
  deleteProjectById,
  getAllProjects,
  getProjectById,
  saveControls,
  updateProjectById,
} from "../controllers/project.ctrl";

import authenticateJWT from "../middleware/auth.middleware";

// GET requests
router.get("/", /*authenticateJWT,*/ getAllProjects);
router.get("/:id", /*authenticateJWT,*/ getProjectById);

// POSTs
router.post("/", /*authenticateJWT,*/ createProject);
router.post("/saveControls", /*authenticateJWT,*/ saveControls);

// PUTs
router.put("/:id", /*authenticateJWT,*/ updateProjectById);

// DELETEs
router.delete("/:id", /*authenticateJWT,*/ deleteProjectById);

export default router;
