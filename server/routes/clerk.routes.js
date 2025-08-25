import express from "express";
import { createClerk, deleteClerk } from "../controllers/clerk.controller.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = express.Router();

// Create a new clerk
router.post("/", authorizeRoles(["admin"]), createClerk);

// Delete a clerk
router.delete("/:id", authorizeRoles(["admin"]), deleteClerk);

export default router;