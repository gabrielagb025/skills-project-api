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
            res.json({ message: 'Rating deleted'})
        })
        .catch((err) => {
            console.log(err)
        })
}
