const Chat = require('../models/chat.model');   

module.exports.createChat = (req, res, next) => {
    const chatData = {
        ...req.body,
        users: [req.currentUser, req.params.id],
        date: new Date()
    }

    Chat.create(chatData)
        .then((chat) => {
            res.json(chat)
        })
        .catch(next)
}

module.exports.getAllChats = (req, res, next) => {
    Chat.find({ users: req.currentUser })
        .populate('messages')
        .then((chats) => {
            res.json(chats)
        })
        .catch(next)
}

module.exports.getCurrentChat = (req, res, next) => {
    Chat.findById(req.params.id)
        .populate('users')
        .populate('messages')
        .then((chat) => {
            res.json(chat)
        })
        .catch(next)
}