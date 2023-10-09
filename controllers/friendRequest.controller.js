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

    FriendRequest.find({ userReceive: userId, status: 'pending' })
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

            return User.find({ _id: { $in: friendIds } })
                .populate('teachSkills learnSkills')
                .then((friends) => {
                    res.json(friends)
                })
        })
        .catch((err) => {
            console.log(err)
            res.status(500).json({ error: 'Error al obtener los usuarios.' });
        })
}

module.exports.getPendingFriendRequests = (req, res, next) => {
    FriendRequest.find({
        $or: [
            { userSend: req.currentUser },
            { userReceive: req.currentUser }
        ],
        status: 'pending'
    })
        .then((pendingRequests) => {
            res.json(pendingRequests)
        })
        .catch((err) => {
            res.status(500).json({ error: 'Error al obtener las solicitudes pendientes.' });
        })
}

module.exports.cancelFriendRequest = (req, res, next) => {
    const { id } = req.params;

    FriendRequest.findByIdAndDelete(id)
        .then((friendRequest) => {
            res.status(204).json({ status: "ok" })
        })
        .catch((err) => {
            res.status(500).json({ error: 'Error al cancelar la conexión.' });
        })
}

module.exports.getAcceptedFriendRequest = (req, res, next) => {
    const currentUser = req.currentUser;
    const userDetail = req.params.id;
    FriendRequest.findOne({
        $or: [
            { $and: [{ userSend: currentUser }, { userReceive: userDetail }] },
            { $and: [{ userSend: userDetail }, { userReceive: currentUser }] }
        ],
        status: 'accepted'
    })
        .then((acceptedRequest) => {
            res.json(acceptedRequest)
        })
        .catch((err) => {
            res.status(500).json({ error: 'Error al obtener la solicitud aceptada.' });
        })
}

