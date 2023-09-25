const mongoose = require('mongoose');
const CATEGORIES = require('../misc/enum')

const skillSchema = new mongoose.Schema(
   {
        name: {
            type: String
        },
        description: {
            type: String,
        },
        category: {
            type: String,
            enum: CATEGORIES
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
    }
)

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;

