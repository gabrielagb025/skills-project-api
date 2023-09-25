const createHttpError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/user.model');

module.exports.getCurrentUser = (req, res, next) => {
    User.findById(req.currentUser)
        .then((user) => {
            if(!user) {
                next(createHttpError(StatusCodes.NOT_FOUND, 'Usuario no encontrado'))
            } else {
                res.json(user)
            }
        })
    .catch(next)
}