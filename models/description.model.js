const mongoose = require('mongoose');

const descriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        required: true
    },
    // images: [{
    //     type: String
    // }],
    urls: [{
        type: String
    }]
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

const Description = mongoose.model('Description', descriptionSchema);

module.exports = Description;