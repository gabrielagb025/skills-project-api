const router = require('express').Router();
const upload = require('../config/storage.config');
const authController = require('../controllers/auth.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const usersController = require('../controllers/users.controller');
const skillController = require('../controllers/skill.controller');
const ratingController = require('../controllers/rating.controller');
const postController = require('../controllers/post.controller');
const friendRequestController = require('../controllers/friendRequest.controller');
const messageController = require('../controllers/message.controller');

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

/* POSTS */
router.get('/post/list', authMiddleware.isAuthenticated, postController.getCurrentUserPosts);
router.get('/post/timeline/foryou', authMiddleware.isAuthenticated, postController.getTimelinePosts);
router.post('/post/create', authMiddleware.isAuthenticated, upload.array('multimedia'), postController.createPost);
router.patch('/post/edit/:id', authMiddleware.isAuthenticated, upload.array('multimedia'), postController.editPost);
router.delete('/post/delete/:id', authMiddleware.isAuthenticated, postController.deletePost);
router.get('/post/timeline/friends', authMiddleware.isAuthenticated, postController.getFriendPosts);

/* FRIEND REQUESTS */
router.get('/friend-requests', authMiddleware.isAuthenticated, friendRequestController.getFriendRequests);
router.patch('/friend-request/edit/:id', authMiddleware.isAuthenticated, friendRequestController.respondToFriendRequest);
router.get('/friends', authMiddleware.isAuthenticated, friendRequestController.getFriends);
router.get('/friend-requests/pending', authMiddleware.isAuthenticated, friendRequestController.getPendingFriendRequests);
router.delete('/friend-request/delete/:id', authMiddleware.isAuthenticated, friendRequestController.cancelFriendRequest);
router.post('/friend-request/:id', authMiddleware.isAuthenticated, friendRequestController.sendFriendRequest);
router.get('/friend-request/accepted/:id', authMiddleware.isAuthenticated, friendRequestController.getAcceptedFriendRequest);

/* MESSAGES */
router.post('/message/create', authMiddleware.isAuthenticated, messageController.createMessage);

module.exports = router;