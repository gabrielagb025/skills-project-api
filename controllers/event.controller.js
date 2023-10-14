const Event = require('../models/event.model')

module.exports.createEvent = (req, res, next) => {
    const eventData = {
        ...req.body,
        users: [req.currentUser, req.params.id],
    }

    Event.create(eventData)
        .then((event) => {
            res.json(event)
        })
        .catch(next)
};

module.exports.getCurrentUserEvents = (req, res, next) => {
    Event.find({ users: req.currentUser })
        .populate('users')
        .then((events) => {
            res.json(events)
        })
        .catch(next)
};

module.exports.deleteEvent = (req, res, next) => {
    const { id } = req.params;

    Event.findByIdAndDelete(id)
        .then((event) => {
            res.status(204).json({ status: "ok" })
        })
        .catch(next)
}