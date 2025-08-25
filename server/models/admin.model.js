import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

    adminId: { type: Number, unique: true, required: true }, // numeric ID
    designation: { type: String } // e.g. "Super Admin"
}, { timestamps: true });

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
