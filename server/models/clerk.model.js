import mongoose from "mongoose";

const clerkSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },

    clerkId: { type: Number, unique: true, required: true }, // numeric ID
    department: { type: String } // optional
}, { timestamps: true });

const clerkModel = mongoose.models.clerk || mongoose.model("clerk", clerkSchema);

export default clerkModel;
