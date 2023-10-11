const User = require('../models/user.model');
const { StatusCodes } = require('http-status-codes');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const sendValidationEmail = require('../config/nodemailer.config');

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
    const { email, password } = req.body;

    if(!email || !password) {
        return next(loginError)
    }

    User.findOne({ email })
    .then((user) => {
        if(!user) {
            return next(loginError)
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