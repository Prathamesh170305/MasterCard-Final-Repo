import express from "express";
import { deleteUser, uploadStudentExcel } from "../controllers/user.controller.js";
import authorizeRoles from "../middlewares/authorizeRoles.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" }); // Temporary storage for uploaded files

// Delete user profile (admin and clerk)
router.delete("/users/:id", authorizeRoles(["admin", "clerk"]), deleteUser);

// Upload Excel sheet for student updates (admin and clerk)
router.post("/students/upload", authorizeRoles(["admin", "clerk"]), upload.single("file"), uploadStudentExcel);

export default router;