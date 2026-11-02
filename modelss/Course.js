const mongoose = require('mongoose');
const courseSchema = new mongoose.Schema(
    {
        course_name: {
            type: String,
            required: true,
            trim: true
        },
        course_code: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            uppercase: true
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        department: {
            type: String,
            required: true,
            trim: true
        },
        semester: {
            type: Number,
            required: true,
        }
    }, { timestamps: true }
)
module.exports= mongoose.model('Course',courseSchema);