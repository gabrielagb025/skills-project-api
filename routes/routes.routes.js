const router = require('express').Router();
const upload = require('../config/storage.config');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const usersController = require('../controllers/users.controller');
const skillController = require('../controllers/skill.controller');
const ratingController = require('../controllers/rating.controller');

/* MISC */
router.get('/', (req, res, next) => {
    res.json({ message: "Welcome to the Skills Api"})
})

/* AUTH */
router.post('/register', upload.single('avatar'), authController.register)
router.post('/login', authController.login);

/* USERS */
router.get('/users/me', authMiddleware.isAuthenticated, usersController.getCurrentUser);
router.patch('/currentUser/edit', authMiddleware.isAuthenticated, upload.single('avatar'), usersController.editUser);
router.get('/users', usersController.getUsers);
router.get('/users/filtered', authMiddleware.isAuthenticated, usersController.getFilteredUsers);
router.get('/user/detail/:id', usersController.getUserDetail);

/* SKILLS */
router.get('/skills', skillController.getSkills)

/* RATINGS */
router.get('/rating/list/:id', authMiddleware.isAuthenticated, ratingController.listRatings);
router.post('/rating/create/:id', authMiddleware.isAuthenticated, ratingController.createRating);
router.delete('/rating/delete/:id', authMiddleware.isAuthenticated, ratingController.deleteRating);



module.exports = router;