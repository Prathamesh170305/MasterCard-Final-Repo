import mongoose from "mongoose";

const clerkSchema = new mongoose.Schema({
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

    clerkId: { type: Number, unique: true, required: true }, // numeric ID
    department: { type: String } // optional
}, { timestamps: true });

const clerkModel = mongoose.models.clerk || mongoose.model("clerk", clerkSchema);

export default clerkModel;
