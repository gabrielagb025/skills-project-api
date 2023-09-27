const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');

module.exports.getCurrentUser = (req, res, next) => {
    User.findById(req.currentUser)
        .populate('teachSkills learnSkills')
        .then((user) => {
            if(!user) {
                next(createHttpError(StatusCodes.NOT_FOUND, 'Usuario no encontrado'))
            } else {
                res.json(user)
            }
        })
    .catch(next)
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
    
}

module.exports.getUserDetail = (req, res, next) => {
    const { id } = req.params;

    User.findById(id)
    .populate('teachSkills learnSkills')
    .then((user) => {
        res.json(user)
    })
    .catch(next)
}
