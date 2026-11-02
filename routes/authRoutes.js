const router = require('express').Router();
const{registerStudent,loginStudent,getCurrentUser,updateCurrentUser}=require('../Controller/authController');
const {authMiddleware}=require('../middleware/authMiddleware');
// Authentication Routes
router.post('/register',registerStudent);// - POST /auth/register — Register a student account.
router.post('/login',loginStudent);// - POST /auth/login — Log in as a student or faculty member.
router.get('/me',authMiddleware,getCurrentUser);// - GET /auth/me — Get the currently logged-in user's details.
router.put('/me',authMiddleware,updateCurrentUser);// - PUT /auth/me — Update the currently logged-in user's permitted profile details.
module.exports = router;