require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user.model');
const USERS = require('../data/users.json');
const Skill = require('../models/skill.model');
const SKILLS = require('../data/skills.json');

require('../config/db.config');

mongoose.connection.once('open', () => {
    mongoose.connection.db
    .dropDatabase()
    .then(() => {
        console.log('Database dropped.')
        return Skill.create(SKILLS)
    })
    .then((createdSkills) => {
        createdSkills.forEach((skill) => {
            console.log(`Skill ${skill.name} has been created.`)
        })
        
        const userPromises = USERS.map((user) => {

            const teachIds = user.teachSkills.map((skillName) => {
                const skill = createdSkills.find((s) => s.name === skillName)
                return skill._id
            })

            const learnIds = user.learnSkills.map((skillName) => {
                const skill = createdSkills.find((s) => s.name === skillName)
                return skill._id
            })

            const modifiedUser = {
                ...user,
                teachSkills: teachIds,
                learnSkills: learnIds
            }

            console.log(modifiedUser)

            return User.create(modifiedUser)
        })

        return Promise.all(userPromises)
    })
    .then((createdUsers) => {
        createdUsers.forEach((user) => {
            console.log(`The user ${user.name} has been created.`)
        })
        return mongoose.connection.close();
    })
    .then(() => {
        console.log('Connection closed.')
    })
    .catch((err) => {
        console.log(err)
    })
})
