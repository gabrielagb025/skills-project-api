const Description = require('../models/description.model');

module.exports.createDescription = (req, res, next) => {
    const data = {
        ...req.body,
        images: req.files ? req.files.map(file => file.path) : undefined,
        user: req.currentUser,
    }

    Description.create(data)
        .then((description) => {
            res.json(description)
        })
        .catch(next)
}

module.exports.currentUserDescription = (req, res, next) => {
    const user = req.currentUser
    Description.findOne({ user: user })
        .then((description) => {
            res.json(description)
        })
        .catch(next)
}

module.exports.getUserDescription = (req, res, next) => {
    const { id } = req.params;
    Description.findOne({ user: id })
        .then((description) => {
            res.json(description)
        })
        .catch(next)
}

module.exports.editDescription = (req, res, next) => {
    const { id } = req.params;

    const data = {
        ...req.body,
        images: req.files ? req.files.map(file => file.path) : undefined,
        user: req.currentUser,
    }

    console.log(data)

    Description.findByIdAndUpdate(id, data, { new: true })
        .then((description) => {
            res.json(description)
        })
        .catch(next)
}