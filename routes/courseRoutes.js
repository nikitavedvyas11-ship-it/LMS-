const router = require("express").Router();
const { authMiddleware, authorizeRoles } = require("../middleware/authMiddleware");
const {getAllCourses,getCourseById,createCourse,updateCourse,deleteCourse}=require('../Controller/courseController');
//  Course Routes
router.get('/',getAllCourses); // - GET /courses — Get all courses.
router.get('/:id',getCourseById); // - GET /courses/:id — Get a course by ID.
router.post('/',[authMiddleware,authorizeRoles('admin','faculty')],createCourse); // - POST /courses — Create a new course.
router.put('/:id',[authMiddleware,authorizeRoles('admin','faculty')],updateCourse);// - PUT /courses/:id — Update course details.
router.delete('/:id',[authMiddleware,authorizeRoles('admin','faculty')],deleteCourse); // - DELETE course by ID
module.exports = router;