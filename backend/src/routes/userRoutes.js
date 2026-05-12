const express = require('express');
const { getProfile, updateProfile, getUsers, deleteUser, updateUserRole } = require('../controllers/userController');
const { verifyToken, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/me', verifyToken, getProfile);
router.put('/me', verifyToken, updateProfile);
router.get('/', verifyToken, authorize(['Administrateur']), getUsers);
router.delete('/:id', verifyToken, authorize(['Administrateur']), deleteUser);
router.put('/:id/role', verifyToken, authorize(['Administrateur']), updateUserRole);

module.exports = router;
