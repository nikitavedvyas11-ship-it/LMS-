const Student=require("../modelss/Student");
const bcrypt=require("bcryptjs");
// Get all students
exports.getAllStudents = async (req, res) => {
    try{
        const allStudents=await Student.find().select("-password");
        if(!allStudents||allStudents.length===0){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        return res.status(200).json({
            message:"All students",
            allStudents
        });
    }catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}
// Get student by MongoDB ID
exports.getStudentById = async (req, res) => {
    try{
        const {id}=req.params;
        const student=await Student.findById(id).select("-password");
        if(!student){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        return res.status(200).json({
            message:"Student by id",
            student
        });
    }catch(error){
        return res.status(400).json({
            message:"Internal server error"
        });
    }
};
// Create student — Faculty authorization is checked in the route
exports.createStudent = async (req, res) => {
    try{
        const {name,email,password,phone,dob,gender,address,enrollment_number,department,semester,admission_date,status}=req.body;
        if (!name || !email || !password || !phone ||!dob || !gender || !address ||!enrollment_number || !department ||semester === undefined || !admission_date ){
            return res.status(400).json({
                message: "Please provide all required student fields"
            });
        }
        const normalizedEmail=email.trim().toLowerCase();
        const existingStudent=await Student.findOne({
            email:normalizedEmail,
            enrollment_number:enrollment_number.trim()
        });
        if(existingStudent){
            return res.status(409).json({
                message:"Student already exists"
            });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const newStudent=await Student.create({
            name,
            email:normalizedEmail,
            password:hashedPassword,
            phone,
            dob,
            gender,
            address,
            enrollment_number:enrollment_number.trim(),
            department,
            semester,
            admission_date,
            status
        });
        const safeStudent=newStudent.toObject();
        delete safeStudent.password;
        return res.status(201).json({
            message:"Student created successfully",
            student:safeStudent
        });
    }catch(error){
        console.log(error);
        return res.status(500).json({
            message:"Internal server error"
        });
    }
};
//Update student
exports.updateStudent = async (req, res) => {
    try {
        let updateData = {};
        if (req.user.role === "student") {
            updateData = {
                name: req.body.name,
                phone: req.body.phone,
                dob: req.body.dob,
                gender: req.body.gender,
                address: req.body.address
            };
        }
        else if (req.user.role === "faculty"||req.user.role === "admin") {
            updateData = {
                email: req.body.email,
                enrollment_number: req.body.enrollment_number,
                department: req.body.department,
                semester: req.body.semester,
                admission_date: req.body.admission_date,
                status: req.body.status
            };
        }
        else {
            return res.status(403).json({
                message: "Access denied"
            });
        }
        // Remove fields that were not provided
        Object.keys(updateData).forEach((key) => {
            if (updateData[key] === undefined) {
                delete updateData[key];
            }
        });
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                message: "No fields provided for update"
            });
        }
        const studentId = req.user.role === "student"
            ? req.user.id
            : req.params.id;
        const updatedStudent = await Student.findByIdAndUpdate(studentId,{ $set: updateData }, { new: true, runValidators: true }).select("-password"); //$set MongoDB ka update operator hai. Iska matlab hai database mein kisi field ki value set ya change karna.
        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }
        return res.status(200).json({
            message: "Student updated successfully",
            updatedStudent
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error"
        });
    }
};
//Delete Student 
exports.deleteStudent = async (req, res) => {
    try{
        const {student_id}=req.params;
        const deletedStudent=await Student.findByIdAndDelete(student_id);
        if(!deletedStudent){
            return res.status(404).json({
                message:"Student not found"
            });
        }
        return res.status(200).json({
            message:"Student deleted",
            deletedStudent
        });
    }catch(error){
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}