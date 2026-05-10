const express = require('express');
const { getUsers, deleteUser, updateUserRole } = require('../controllers/userController');
const { verifyToken, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/', verifyToken, authorize(['Administrateur']), getUsers);
router.delete('/:id', verifyToken, authorize(['Administrateur']), deleteUser);
router.put('/:id/role', verifyToken, authorize(['Administrateur']), updateUserRole);

module.exports = router;