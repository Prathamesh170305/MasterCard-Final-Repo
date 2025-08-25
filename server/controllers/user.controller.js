import userModel from "../models/user.model.js";
import xlsx from "xlsx";

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Allow admin to delete clerks
        if (user.role === "clerk" && req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can delete clerks" });
        }

        await userModel.findByIdAndDelete(id);

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

        const workbook = xlsx.read(file.buffer, { type: "buffer" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const students = xlsx.utils.sheet_to_json(sheet);

        const studentPromises = students.map(async (student) => {
            const newStudent = new userModel({ ...student, role: "student" });
            return newStudent.save();
        });

        await Promise.all(studentPromises);

        res.status(201).json({ message: "Students uploaded successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        let user;

        user = new userModel({ name, email, password, role });

        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const admin = new userModel({ name, email, password, role: "admin" });

        await admin.save();
        res.status(201).json({ message: "Admin created successfully", admin });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
