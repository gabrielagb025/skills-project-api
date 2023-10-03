const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');
const Skill = require('../models/skill.model');

module.exports.getCurrentUser = (req, res, next) => {
    User.findById(req.currentUser)
        .populate('teachSkills learnSkills')
        .then((user) => {
            if (!user) {
                next(createHttpError(StatusCodes.NOT_FOUND, 'Usuario no encontrado'))
            } else {
                res.json(user)
            }
        })
        .catch(next)
}

module.exports.editUser = (req, res, next) => {

    const data = {
        ...req.body,
        avatar: req.file ? req.file.path : undefined,
    };

    User.findByIdAndUpdate(req.currentUser, data, { new: true })
        .then((currentUser) => {
            if (!currentUser) {
                console.log('no encuentro el user')
            }
            res.json(currentUser)
        })
        .catch(err => {
            console.log('error')
            next(err)
        })
}

module.exports.getUsers = (req, res, next) => {
    User.find()
        .populate('teachSkills learnSkills')
        .then((users) => {
            res.json(users)
        })
        .catch(next)
}

module.exports.getFilteredUsers = (req, res, next) => {
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
                        _id: { $ne: currentUser._id },
                    })
                    .populate('teachSkills learnSkills');
                })
                .then((matchedUsers) => {
                    console.log(matchedUsers)
                    res.status(200).json( matchedUsers );
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

module.exports.getUserDetail = (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
        .populate('teachSkills learnSkills')
        .then((user) => {
            res.json(user)
        })
        .catch(next)
}
