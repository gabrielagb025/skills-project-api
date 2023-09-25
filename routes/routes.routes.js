const router = require('express').Router();
const upload = require('../config/storage.config')
const authController = require('../controllers/auth.controller')
const usersController = require('../controllers/users.controller')
const authMiddleware = require('../middlewares/auth.middleware')

/* MISC */
router.get('/', (req, res, next) => {
    res.json({ message: "Welcome to the Skills Api"})
})

/* AUTH */
router.post('/register', upload.single('avatar'), authController.register)
router.post('/login', authController.login);

/* USERS */
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser)

module.exports = router;