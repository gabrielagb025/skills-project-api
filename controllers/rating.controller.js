const Rating = require('../models/rating.model');
const createError = require('http-errors');

// Crear el rating
module.exports.createRating = (req, res, next) => {
    const data = {
        ...req.body,
        currentUser: req.currentUser,
        user: req.params.id,
        date: new Date()
    }

    Rating.create(data)
        .then((rating) => {
            res.json(rating)
        })
        .catch(next)
}

// Borrar el rating
module.exports.deleteRating = (req, res, next) => {
    const { id } = req.params;
    Rating.findByIdAndDelete(id)
        .then((rating) => {
            console.log('rating borrado')
            res.status(204).json({status: "ok"})
        })
        .catch(next)
}

module.exports.listRatings = (req, res, next) => {
    const { id } = req.params;
    Rating.find({user: id})
    .populate('currentUser')
        .then((ratings) => {
            res.json(ratings)
        })
        .catch(next)
}

module.exports.getCurrentUserRatings = (req, res, next) => {

    Rating.find({user: req.currentUser})
    .populate('currentUser')
        .then((ratings) => {
            res.json(ratings)
        })
        .catch(next)
}
