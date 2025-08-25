import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
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

    adminId: { type: Number, unique: true, required: true }, // numeric ID
    designation: { type: String } // e.g. "Super Admin"
}, { timestamps: true });

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
