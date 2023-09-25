const mongoose = require('mongoose');

const userSkillSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        skillId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Skill'
        },
        type: {
            type: String,
            enum: ['learn', 'teach']
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

const UserSkill = mongoose.model('UserSkill', userSkillSchema);

module.exports = UserSkill;