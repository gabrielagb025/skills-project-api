const Post = require('../models/post.model');
const User = require('../models/user.model');
const Skill = require('../models/skill.model');
const FriendRequest = require('../models/friendRequest.model')

module.exports.createPost = (req, res, next) => {
    const postData = {
        ...req.body,
        multimedia: req.files ? req.files.map(file => file.path) : undefined,
        user: req.currentUser,
        date: new Date()
    }

    Post.create(postData)
        .then((post) => {
            res.json(post)
        })
        .catch(next)
}

module.exports.deletePost = (req, res, next) => {
    const { id } = req.params;

    Post.findByIdAndDelete(id)
        .then((rating) => {
            res.status(204).json({ status: "ok" })
        })
        .catch(next)
}

module.exports.getCurrentUserPosts = (req, res, next) => {
    const user = req.currentUser
    Post.find({ user: user })
        .then((posts) => {
            res.json(posts)
        })
        .catch(next)
}

module.exports.editPost = (req, res, next) => {
    const { id } = req.params;

    const postData = {
        ...req.body,
        multimedia: req.files ? req.files.map(file => file.path) : undefined,
        user: req.currentUser,
        date: new Date()
    }

    Post.findByIdAndUpdate(id, postData)
        .then((post) => {
            res.json(post)
        })
        .catch(next)
};

module.exports.getTimelinePosts = (req, res, next) => {
    User.findById(req.currentUser)
        .populate('teachSkills')
        .populate('learnSkills')
        .lean()
        .then((currentUser) => {
            if (!currentUser) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const teachSkillCategories = currentUser.teachSkills.map(skill => skill.category);
            const learnSkillCategories = currentUser.learnSkills.map(skill => skill.category);

            // Utiliza Promise.all para esperar a que ambas consultas se completen
            Promise.all([
                Skill.find({ 'category': { $in: teachSkillCategories } }),
                Skill.find({ 'category': { $in: learnSkillCategories} })
            ])
                .then(([skillsToLearn, skillsToTeach]) => {
                    return User.find({
                        $or: [
                            { 'learnSkills': { $in: skillsToLearn.map(skill => skill._id) } },
                            { 'teachSkills': { $in: skillsToTeach.map(skill => skill._id) } },
                        ],
                        _id: { $ne: currentUser.id },
                    })
                    .populate('teachSkills learnSkills posts');
                })
                .then((matchedUsers) => {
                    matchedUsers.push(currentUser)
                    const matchedUsersIds = matchedUsers.map((user) => user._id);
                    
                    return Post.find({ user: { $in: matchedUsersIds } })
                        .populate('user')
                        .lean()
                        .then((posts) => {
                            res.json(posts)
                        })
                })
                .catch((error) => {
                    console.log(error);
                    next(error);
                });
        })
        .catch((error) => {
            console.log(error);
            next(error);
        });
};

module.exports.getFriendPosts = (req, res, next) => {
    FriendRequest.find({ $or: [{ userSend: req.currentUser }, { userReceive: req.currentUser }], status: 'accepted' })
        .then((friendRequests) => {
            const friendIds = friendRequests.reduce((ids, request) => {
                if (request.userSend.toString() === req.currentUser) {
                    ids.push(request.userReceive);
                } else {
                    ids.push(request.userSend);
                }
                return ids;
            }, []);

            return Post.find({ user: { $in: friendIds } })
                .populate('user')
                .then((posts) => {
                    res.json(posts)
                })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ error: 'Error al obtener los posts de amigos.' });
        })
}

