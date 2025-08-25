import express from "express";
import { createAdmin, deleteAdmin } from "../controllers/admin.controller.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";

const router = express.Router();

// Create a new admin
router.post("/", authorizeRoles(["admin"]), createAdmin);

// Delete an admin
router.delete("/:id", authorizeRoles(["admin"]), deleteAdmin);

export default router;