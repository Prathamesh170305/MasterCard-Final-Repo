import studentModel from "../models/student.model.js";
import clerkModel from "../models/clerk.model.js";
import adminModel from "../models/admin.model.js";
import xlsx from "xlsx";

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await clerkModel.findById(id) || await studentModel.findById(id) || await adminModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Allow admin to delete clerks
        if (user.role.name === "clerk" && req.user.role.name !== "admin") {
            return res.status(403).json({ message: "Only admins can delete clerks" });
        }

        if (user.role.name === "clerk") {
            await clerkModel.findByIdAndDelete(id);
        } else if (user.role.name === "student") {
            await studentModel.findByIdAndDelete(id);
        } else if (user.role.name === "admin") {
            await adminModel.findByIdAndDelete(id);
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const uploadStudentExcel = async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const workbook = xlsx.readFile(file.path);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        for (const row of data) {
            const { studentId, linkedinId } = row;
            await studentModel.findOneAndUpdate(
                { studentId },
                { linkedinId },
                { new: true, upsert: true }
            );
        }

        res.status(200).json({ message: "Student information updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user;

        if (role === "student") {
            user = new studentModel({ name, email, password });
        } else if (role === "clerk") {
            user = new clerkModel({ name, email, password });
        } else {
            return res.status(400).json({ message: "Invalid role specified" });
        }

        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const admin = new adminModel({ name, email, password });

        await admin.save();
        res.status(201).json({ message: "Admin created successfully", admin });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
