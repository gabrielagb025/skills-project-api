const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
    userSend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    userReceive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        default: '!Hola! Me gustaría conectar contigo.'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending' 
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

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;