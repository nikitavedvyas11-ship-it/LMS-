const router = require("express").Router();
const {getAllStudents,getStudentById,createStudent,updateStudent,deleteStudent}=require('../Controller/studentController');
const { authMiddleware,authorizeRoles } = require("../middleware/authMiddleware");
//Faculty token+faculty role required Only authenticated Faculty can register students
router.post("/",authMiddleware,authorizeRoles("faculty","admin"),createStudent);
//  Student Routes
router.get('/',getAllStudents); // - GET /students — Get all students.
router.get('/:id',getStudentById); // - GET /students/:id — Get a student by ID.
// Update student - Student can update own personal details
router.put("/me",authMiddleware,authorizeRoles("student"),updateStudent);
// Update student - Faculty and Admin can update academic details
router.put("/:id",authMiddleware,authorizeRoles("faculty", "admin"),updateStudent);
router.delete('/:id',[authMiddleware,authorizeRoles('admin',('faculty'))],deleteStudent); // - DELETE /students/:id — Delete a student.
module.exports=router;