const Message = require('../models/message.model');
const Chat = require('../models/chat.model');

module.exports.createMessage = (req, res, next) => {
    const messageData = {
        ...req.body,
        sender: req.currentUser,
        chat: req.params.id,
        date: new Date()
    }

    Message.create(messageData)
        .then((message) => {
            // Actualizar el chat para incluir el ID del nuevo mensaje y el método then
            return Chat.findByIdAndUpdate(message.chat, { $push: { messages: message._id } }, { new: true })
        })
        .then((updatedChat) => {
            // Enviar la respuesta como JSON con el mensaje creado y el chat actualizado
            res.json(updatedChat);
        })
        .catch((error) => {
            // Pasar cualquier error a la función de manejo de errores
            next(error);
        });
}