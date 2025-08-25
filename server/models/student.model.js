import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    verifyOtp: { type: String, default: '' },
    verifyOtpExpiredAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpiredAt: { type: Number, default: 0 },

    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true
    },
    isActive: { type: Boolean, default: true },

    studentId: { type: Number, unique: true, required: true }, // numeric ID
    linkedinId: { type: String }, // optional

    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" } // student enrolled course
}, { timestamps: true });

const studentModel = mongoose.models.student || mongoose.model("student", studentSchema);

export default studentModel;
