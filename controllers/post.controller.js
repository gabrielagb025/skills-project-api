const Post = require('../models/post.model');
const User = require('../models/user.model');
const Skill = require('../models/skill.model')

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
            console.log('post borrado')
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
    console.log(postData)

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

            console.log(teachSkillCategories)
            console.log(learnSkillCategories)

            // Utiliza Promise.all para esperar a que ambas consultas se completen
            Promise.all([
                Skill.find({ 'category': { $in: teachSkillCategories } }),
                Skill.find({ 'category': { $in: learnSkillCategories} })
            ])
                .then(([skillsToLearn, skillsToTeach]) => {
                    console.log(skillsToLearn)
                    console.log(skillsToTeach)
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
                    console.log(matchedUsers)
                    matchedUsers.push(currentUser)
                    const matchedUsersIds = matchedUsers.map((user) => user._id);
                    console.log(matchedUsersIds);
                    
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

