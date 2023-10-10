const Message = require('../models/message.model');

module.exports.createMessage = (req, res, next) => {
    const messageData = {
        ...req.body,
        sender: req.currentUser,
        date: new Date()
    }

    Message.create(messageData)
        .then((message) => {
            res.json(message)
        })
        .catch(next)
}