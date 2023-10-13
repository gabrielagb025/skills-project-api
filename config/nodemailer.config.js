const nodemailer = require('nodemailer');

const email = process.env.EMAIL_ACCOUNT;

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: email,
        pass: process.env.EMAIL_PASSWORD
    }
});

module.exports.sendValidationEmail = (user) => {

    const activationLink = `${process.env.APP_HOST}/activate/${user.id}`;

    const userData = {
        name: user.name 
    };

    transporter.sendMail({
        from: `SkillSync <${email}>`,
        to: user.email,
        subject: 'Te damos la bienvenida a SkillSync',
        html: `
            <h1>Hola ${userData.name}</h1>
            <p>Gracias por registrarte en SkillSync. Para activar tu cuenta, haz click en el siguiente enlace:</p>
            <a href="${activationLink}">Activar cuenta</a>
        `
    })
    .then(() => {
        console.log(`Email sent to ${user.id}`)
    })
    .catch(err => {
        console.error(err)
    })
};
