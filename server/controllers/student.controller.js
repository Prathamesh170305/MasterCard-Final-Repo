import userModel from "../models/user.model.js";

// Update student information
export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        const updatedStudent = await userModel.findOneAndUpdate(
            { _id: id, role: "student" },
            updates,
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

// Delete student account
export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent = await userModel.findOneAndDelete({ _id: id, role: "student" });

        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        res.status(200).json({ message: "Student account deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
