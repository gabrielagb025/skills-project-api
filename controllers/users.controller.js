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

module.exports.editUser = (req, res, next) => {
    User.findByIdAndUpdate(req.currentUser, req.body, { new:true })
    .then((currentUser) => {
        if(!currentUser) {
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
        .populate('teachSkills learnSkills')
        .then((currentUser) => {
            if (!currentUser) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const teachCategories = currentUser.teachSkills.map((skill) => skill.category);
            const learnCategories = currentUser.learnSkills.map((skill) => skill.category);

            return User.find({
                $or: [
                    { 'learnSkills.category': { $in: teachCategories } }, // Usuarios que pueden enseñar lo que el usuario actual quiere aprender
                    { 'teachSkills.category': { $in: learnCategories } }, // Usuarios que quieren aprender lo que el usuario actual puede enseñar
                ],
                _id: { $ne: currentUser._id }, // Excluye al usuario actual de los resultados
            })
            .populate('teachSkills learnSkills'); // Popula las habilidades de los usuarios coincidentes
        })
        .then((matchedUsers) => {
            console.log(matchedUsers)
            res.status(200).json({ matchedUsers });
        })
        .catch((error) => {
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
