const Course =require("../modelss/Course");
exports.getAllCourses = async (req, res) => {
    try{
        const courses=await Course.find();
        if(courses.length===0){
            return res.status(404).json({
                message:"No courses found"
            });
        }
        res.status(200).json({
            message:"All courses",
            courses
        });
    }catch(error){
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

exports.getCourseById = async (req, res) => {
    try{
        const { id } = req.params;
        const course=await Course.findById(id);
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            });
        }
        res.status(200).json({
            message:"Course by id",
            course
        });
    }catch(error){
        console.log(error)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

exports.createCourse = async (req, res) => {
    try{
        const { course_name, course_code, description, department, semester } = req.body;
        if(!course_name || !course_code || !description || !department || !semester){
            return res.status(404).json({
                message:"All fields are required"
            });
        }
        const course=await Course.create({ course_name, course_code, description, department, semester });
        if(!course){
            return res.status(404).json({
                message:"Course not created"
            });
        }
        return res.status(200).json({
            message:"Course created",
            course
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

exports.updateCourse = async (req, res) => {
    try{
        const {id} =req.params;
        const {course_name, course_code, description, department, semester} = req.body;
        if(!course_name || !course_code || !description || !department || !semester){
            return res.status(404).json({
                message:"All fields are required"
            });
        }
        const course=await Course.findByIdAndUpdate(id,{course_name, course_code, description, department, semester},{new:true});
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            });
        }
        res.status(200).json({
            message:"Course updated",
            course
        });
    }catch(error){
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

exports.deleteCourse = async (req, res) => {
    try{
        const {id} =req.params;
        const course=await Course.findByIdAndDelete(id);
        if(!course){
            return res.status(404).json({
                message:"Course not found"
            });
        }
        return res.status(200).json({
            message:"Course deleted",
            course
        });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}