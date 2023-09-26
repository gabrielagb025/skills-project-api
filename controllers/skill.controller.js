const Skill = require('../models/skill.model');

module.exports.getSkills = (req, res, next) => {
    Skill.find()
    .then((skills) => {
        res.json(skills)
    })
    .catch((err) => {
        next(err)
    })
}