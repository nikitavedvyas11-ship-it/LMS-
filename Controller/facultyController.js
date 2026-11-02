const Faculty = require("../modelss/Faculty");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
//Get all faculty
exports.getAllFaculty = async (req, res) => {
    try{
        const allFaculty=await Faculty.find().select("-password");
        if(!allFaculty||allFaculty.length===0){
            return res.status(404).json({
                message:"Faculty not found"
            });
        }
        res.status(200).json({
            message:"All faculty",
            allFaculty
        });
    }catch(error){
        res.status(500).json({
            message:"Internal server error"
        })
    }
};
// Get faculty by MongoDB ID
exports.getFacultyById = async (req, res) => {
    try{
        const facultyMember=await Faculty.findById(req.params.id).select("-password");
        if(!facultyMember){
            return res.status(404).json({
                message:"Faculty not found"
            });
        }
        res.status(200).json({
            message:"Faculty found successfully",
            facultyMember
        });
    }catch(error){
        console.log(error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
};
//Create faculty account
//This route must be protected for Admin only 
exports.createFaculty = async (req, res) => {
    try{
        const {name,email,password,employee_id,specialization,department,experience}=req.body;
        if (!name || !email || !password || !employee_id || !specialization || !department || experience === undefined) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const existingFaculty=await Faculty.findOne({
            $or:[{email:normalizedEmail}, {employee_id:employee_id.trim()}] //Ye MongoDB ka query operator hai. $or ka matlab hai koi bhi ek condition true ho, toh match mil sakta hai
        });
        if (existingFaculty) {
            return res.status(409).json({
                message: "Email or employee ID already exists"
            });
        }
        const hashedPassword=await bcrypt.hash(password,10); //await-hashing complete hone ka wait karta hai. 10-hashing mein kitni computational cost use karni hai, uska parameter hai.
        const newFaculty=new Faculty({
            name:name.trim(),
            email:normalizedEmail,
            password:hashedPassword,
            employee_id:employee_id.trim(),
            specialization:specialization.trim(),
            department:department.trim(),
            experience,
            role:"faculty"
        });
        await newFaculty.save();
        return res.status(201).json({
            message:"Faculty created successfully",
            faculty: {
                id: newFaculty._id,
                name: newFaculty.name,
                email: newFaculty.email,
                employee_id: newFaculty.employee_id,
                role: newFaculty.role
            }
        });
    }catch(error){
        res.status(500).json({
            message:"Failed to create faculty"
        })
    }
}
// Faculty/Admin login
exports.loginFaculty=async(req,res)=>{
    console.log("FACULTY LOGIN ROUTE HIT");
    try{
        const{email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({
                message:"Email and password are required"
            });
        }
        const facultyMember=await Faculty.findOne({
            email:email.trim().toLowerCase()
        });
        if(!facultyMember){
            return res.status(401).json({
                message:"Invalid email or password"
            });
        }
        const isPasswordCorrect=await bcrypt.compare(password,facultyMember.password)
        console.log(isPasswordCorrect);
        if(!isPasswordCorrect){
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }
        const token=jwt.sign(
            {
                id:facultyMember._id,
                role:facultyMember.role
            },
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        );
        return res.status(200).json({
            message:"Login Successful",
            token,
            user:{
                id:facultyMember._id,
                name:facultyMember.name,
                email:facultyMember.email,
                role:facultyMember.role
            }
        });
    }catch(error){
        return res.status(500).json({
            message:"Login failed"
        });
    }
};
// Update faculty
// Protect this route with Admin authorization
exports.updateFaculty = async (req, res) => {
    try{
        const {name,email,specialization,department,experience}=req.body;
        const updatedFaculty=await Faculty.findByIdAndUpdate(req.param.id,{name,email,specialization,department,experience}, { new: true , runValidators:true}).select("-password");
        if(!updatedFaculty){
            return res.status(404).json({
                message:"Faculty not found"
            });
        }
        return res.status(200).json({
            message:"Faculty updated",
            faculty : updatedFaculty
        });
    }catch(error){
        return res.status(500).json({
            message:"Failed to update faculty"
        });
    }
};
//Delete faculty
// Protect this route with Admin authorization
exports.deleteFaculty = async (req, res) => {
    try{
        const deletedFaculty=await Faculty.findByIdAndDelete(req.param.id);
        if(!deletedFaculty){
            return res.status(404).json({
                message:"Faculty not found"
            });
        }
        return res.status(200).json({
            message:"Faculty deleted",
            faculty : deletedFaculty
        });
    }catch(error){
        return res.status(500).json({
            message:"Failed to delete faculty"
        });
    }
};