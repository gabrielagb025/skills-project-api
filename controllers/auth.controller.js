const User = require('../models/user.model');
const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');

module.exports.register = (req, res, next) => {
    if (req.file) {
        req.body.avatar = req.file.path;
    }

    User.create(req.body)
    .then(user => res.status(StatusCodes.CREATED).json(user))
    .catch(next)
}