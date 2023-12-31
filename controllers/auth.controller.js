const User = require('../models/user.model');
const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { sendValidationEmail } = require('../config/nodemailer.config');

module.exports.register = (req, res, next) => {
    
    const userData = {
        ...req.body,
        avatar: req.file ? req.file.path : undefined
    }

    User.create(userData)
    .then(user => {
        sendValidationEmail(user)
        res.status(StatusCodes.CREATED).json(user)
    })
    .catch(next)
}

module.exports.login = (req, res, next) => {
    const loginError = createError(StatusCodes.UNAUTHORIZED, 'Correo o contraseña inválido.')
    const activeError = createError(StatusCodes.UNAUTHORIZED, 'Cuenta no activada. Revisa tu correo.')
    const { email, password } = req.body;

    if(!email || !password) {
        return next(loginError)
    }

    User.findOne({ email, active: true })
    .then((user) => {
        if(!user) {
            return next(activeError)
        }

        return user.checkPassword(password)
        .then((match) => {
            if(!match) {
                return next(loginError)
            }

            //Emitir y firmar un token con la información del usuario.
            const token = jwt.sign(
                { id: user.id},
                process.env.JWT_SECRET || 'Super secret',
                { expiresIn: '1h'}
            )
        
        res.json({ accessToken: token })
        })
    })
    .catch(next)
}

module.exports.activateUser = (req, res, next) => {
    const { id } = req.params;

    User.findByIdAndUpdate(id, { active: true }, { new: true })
    .then((user) => {
        console.log(user)
        res.json(user)
    })
    .catch(next)
}