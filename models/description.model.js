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
    images: [{
        type: String
    }],
    urls: [{
        type: String
    }]
})

const Description = mongoose.model('Description', descriptionSchema);

module.exports = Description;