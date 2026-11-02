const router = require("express").Router();
const {authMiddleware,authorizeRoles} = require("../middleware/authMiddleware");
const {getAllFaculty,getFacultyById,createFaculty,updateFaculty,deleteFaculty,loginFaculty}=require('../Controller/facultyController');
//  Faculty Routes
router.post("/login", loginFaculty);

router.get('/',getAllFaculty);// - GET /faculty — Get all faculty members.
router.get('/:id',getFacultyById); // - GET /faculty/:id — Get a faculty member by ID.
router.post('/',authMiddleware,[authorizeRoles('admin','faculty')],createFaculty); // - POST /faculty — Create a new faculty member.
router.put('/:id',authMiddleware,[authorizeRoles('admin','faculty')],updateFaculty); // - PUT /faculty/:id — Update faculty details.
router.delete('/:id',authMiddleware,[authorizeRoles('admin')],deleteFaculty); // - DELETE /faculty/:id — Delete a faculty member.
module.exports = router;