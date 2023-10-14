const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    title: {
        type: String,
        required: true
    },
    dateStart: {
        type: Date,
        default: Date.now(),
        required: true
    },
    dateEnd: {
        type: Date,
        default: Date.now(),
        required: true
    },
},
{
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = doc.id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
})

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
