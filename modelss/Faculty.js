const mongoose = require("mongoose");
const facultySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    employee_id: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    specialization: {
        type: String,
        required: true,
        trim: true
    },

    department: {
        type: String,
        required: true,
        trim: true
    },

    experience: {
        type: Number,
        required: true,
        min: 0
    },

    role: {
        type: String,
        enum: ["faculty", "admin"],
        default: "faculty"
    }

}, { timestamps: true });
module.exports = mongoose.model("Faculty", facultySchema);