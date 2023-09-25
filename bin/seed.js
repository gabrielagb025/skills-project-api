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
        return User.create(USERS)
    })
    .then((createdUsers) => {
        createdUsers.forEach((user) => {
            console.log(`The user ${user.name} has been created`)
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
