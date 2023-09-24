const router = require('express').Router();
const upload = require('../config/storage.config')
const authController = require('../controllers/auth.controller')

// misc
router.get('/', (req, res, next) => {
    res.json({ message: "Welcome to the Skills Api"})
})

/* AUTH */
router.post('/register', upload.single('avatar'), authController.register)

module.exports = router;