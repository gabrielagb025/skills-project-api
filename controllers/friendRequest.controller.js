const FriendRequest = require('../models/friendRequest.model');
const User = require('../models/user.model');

module.exports.sendFriendRequest = (req, res, next) => {
    const friendRequestData = {
        userSend: req.currentUser,
        userReceive: req.params.id,
        ...req.body
    }

    FriendRequest.create(friendRequestData)
        .then((friendRequest) => {
            res.json(friendRequest)
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ error: 'Error al enviar la solicitud de amistad' });  
        })
}

module.exports.getFriendRequests = (req, res, next) => {
    const userId = req.currentUser;

    FriendRequest.find({userReceive: userId, status: 'pending'})
    .populate('userSend')
    .then((friendRequests) => {
        res.json(friendRequests)
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({ error: 'Error al recibir las solicitudes de amistad' });  
    })
}

module.exports.respondToFriendRequest = (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    console.log(req.body)

    FriendRequest.findByIdAndUpdate(id, { status }, { new: true })
    .then((updatedRequest) => {
        console.log('actualizado!')
        res.json(updatedRequest)
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({ error: 'Error al actualizar la solicitud de amistad' });
    })
}

module.exports.getFriends = (req, res, next) => {
    FriendRequest.find({ $or: [{ userSend: req.currentUser }, { userReceive: req.currentUser }], status: 'accepted' })
    .then((friendRequests) => {
        const friendIds = friendRequests.reduce((ids, request) => {
            if (request.userSend.toString() === req.currentUser) {
                ids.push(request.userReceive);
            } else {
                ids.push(request.userSend);
            }
            return ids;
        }, []);

        return User.find({_id: { $in: friendIds } })
        .then((friends) => {
            res.json(friends)
        })
    })
    .catch((err) => {
        console.log(err)
        res.status(500).json({ error: 'Error al obtener los usuarios.' });
    })
    
}