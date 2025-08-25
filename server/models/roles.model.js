import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['student', 'admin', 'clerk'], // limit roles
        required: true,
        unique: true
    },
    description: { type: String }
}, { timestamps: true });

const roleModel = mongoose.models.role || mongoose.model('role', roleSchema);

export default roleModel;
