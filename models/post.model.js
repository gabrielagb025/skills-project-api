const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    message: {
        type: String,
        required: [true, 'Debes escribir algún mensaje.'],
        maxlength: [300, 'El mensaje no debe tener más de 300 caracteres.']
    },
    multimedia: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now,
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

const Post = mongoose.model('Post', postSchema);

module.exports = Post;