const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    currentUser: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
        required: [true, 'El comentario es requerido.'],
    },
    date: {
        type: Date,
        default: Date.now,
    },
    score: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
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
})

const Rating = mongoose.model('Rating', ratingSchema)

module.exports = Rating;