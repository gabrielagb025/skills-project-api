const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    userSend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userReceive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String
    },
    active: {
        type: Boolean,
        default: false
    }
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
});

const Match = mongoose.model('Match', matchSchema);

module.exports = Match;