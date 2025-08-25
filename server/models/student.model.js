import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

    studentId: { type: Number, unique: true, required: true }, // numeric ID
    linkedinId: { type: String }, // optional

    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" } // student enrolled course
}, { timestamps: true });

const studentModel = mongoose.models.student || mongoose.model("student", studentSchema);

export default studentModel;
