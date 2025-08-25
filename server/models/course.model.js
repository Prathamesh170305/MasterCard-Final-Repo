import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    duration: { type: String }, // e.g. "6 months"
    // startDate: { type: Date },
    // endDate: { type: Date },
}, { timestamps: true });

const courseModel = mongoose.models.course || mongoose.model("course", courseSchema);

export default courseModel;
