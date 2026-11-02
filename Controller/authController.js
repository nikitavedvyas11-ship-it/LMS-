const Student = require("../modelss/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
exports.registerStudent = async (req, res) => {
    try {
        //Get data from request body
        const { name, email, password, phone, dob, gender, address, enrollment_number, department, semester, admission_date } = req.body;
        // Check all required fields
        if (!name || !email || !password || !phone ||!dob || !gender || !address ||!enrollment_number || !department ||semester === undefined || !admission_date) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }
        // Validate basic field types
        if (typeof name !== "string" || typeof email !== "string" || typeof password !== "string" || typeof phone !== "string" || typeof enrollment_number !== "string" || typeof department !== "string") {
            return res.status(400).json({
                message: "Invalid field types"
            });
        }
        if (name.trim().length === 0) {
            return res.status(400).json({
                message: "Name cannot be empty"
            });
        }
        if (typeof password != "string" || password.length < 8) {
            return res.status(400).json({
                message: "password must be at least 8 characters long"
            });
        }
        if (!["male", "female", "other"].includes(gender)) {
            return res.status(400).json({
                message: "Gender must be male, female, or other"
            });
        }
        if (!address || typeof address !== "object" || Array.isArray(address) || !address.street?.trim() || !address.city?.trim() || !address.state?.trim() || !address.country?.trim()) {
            return res.status(400).json({
                message: "Complete address is required"
            });
        }
        const semesterNumber = Number(semester);
        if (!Number.isInteger(semesterNumber) || semesterNumber < 1 || semesterNumber > 12) {
            return res.status(400).json({
                message: "Semester must be a valid positive number"
            });
        }
        // Validate dates
        const birthDate = new Date(dob);
        const admissionDate = new Date(admission_date);
        if (
            Number.isNaN(birthDate.getTime()) ||
            Number.isNaN(admissionDate.getTime())
        ) {
            return res.status(400).json({
                message: "Invalid date format"
            });
        }

        if (birthDate >= new Date()) {
            return res.status(400).json({
                message: "Date of birth must be in the past"
            });
        }
        //Normalize email
        const normalizedEmail = email.trim().toLowerCase();
        //Check whether student already exists
        const existingStudent = await Student.findOne({
            email: normalizedEmail
        });
        if (existingStudent) {
            return res.status(409).json({
                message: "Email already exists"
            })
        }
        //Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        //Save student in database
        const student = await Student.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            phone: phone.trim(),
            dob: birthDate,
            gender,
            address: {
                street: address.street.trim(),
                city: address.city.trim(),
                state: address.state.trim(),
                country: address.country.trim()
            },
            enrollment_number: enrollment_number.trim(),
            department: department.trim(),
            semester: semesterNumber,
            admission_date: admissionDate
        });
        //send sucess response
        return res.status(201).json({
            message: "Student reegistered Successfully",
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                phone: student.phone,
                dob: student.dob,
                gender: student.gender,
                address: student.address,
                enrollment_number: student.enrollment_number,
                department: student.department,
                semester: student.semester,
                admission_date: student.admission_date,
                status: student.status,
                role: student.role
            }
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({
            message: "Failed to register the student",
        });
    }
};
exports.loginStudent = async (req, res) => {
    try {
        //Get email and password
        const { email, password } = req.body;
        //Check required fields
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        if (typeof email != "string" || !email.trim()) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }
        if (typeof password != "string" || password.length < 8) {
            return res.status(400).json({
                message: "password must be at least 8 characters long"
            });
        }
        //Find student by email
        const student = await Student.findOne({
            email: email.trim().toLowerCase()
        }).select("+password");
        if (!student) {
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
        //compare entered password with saved hash 
        const isMatch = await bcrypt.compare(password, student.password);
        if (!isMatch) {
            return res.status(401).json({
                message: "Inavlid email or password"
            });
        }
        //Check JWT secret
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: "Server configuration error"
            });
        }
        //Generate JWT token
        const token = jwt.sign({ id: student._id,role: student.role}, process.env.JWT_SECRET, { expiresIn: "25d" });
        //send response 
        return res.status(200).json({
            message: "Student logged in successfully",
            token: token,
            student: {
                id: student._id,
                name: student.name,
                email: student.email
            }
        });
    }
    catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({
            message: "Failed to log in the student",
        });
    }
};
exports.getCurrentUser = async (req, res) => {
    try {
        //Get Current User Logic
        const student = await Student.findById(req.user.id).select("-password");
        if (!student) {
            return res.status(404).json({
                message: "Student not found",
            });
        }
        res.status(200).json({
            message: "Current user fetched successfully",
            user: student
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Failed to fetch current user",
        });
    }
};