const nodemailer = require('nodemailer');
const emailWelcome = require('../misc/mail')

const email = process.env.EMAIL_ACCOUNT;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: email,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports.sendValidationEmail = (user) => {

    const activationLink = `${process.env.APPFRONT_HOST}/activate/${user.id}`;

    const userName = user.name;

    transporter.sendMail({
        from: `SkillSync <${email}>`,
        to: user.email,
        subject: 'Te damos la bienvenida a SkillSync',
        html: emailWelcome(userName, activationLink)
    })
    .then(() => {
        console.log(`Email sent to ${user.id}`)
    })
    .catch(err => {
        console.error(err)
    })
};
