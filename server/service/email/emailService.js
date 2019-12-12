// sendgrid email service

const fs = require('fs');
const path = require('path');
const User = require('../../models/user');
require('dotenv').config()

const BASE_TEMPLATE_PATH = path.join(__dirname, 'templates');
const emailType = {
    USER_REGISTRATION: 'UserRegistration.html'
}

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.sendgrid_api_key);

function sendUserRegistrationEmail(userData) {
    getEmailTemplate(emailType.USER_REGISTRATION)
    .then(template => {
        const lookup = {
            '{{name}}': userData.name,
            '{{activationURL}}': `${process.env.webui_base_url}/activate/${userData.activationToken}`
        }
        template = template.replace(/{{name}}|{{activationURL}}/gi, (matched) => { return lookup[matched] });

        const msg = {
            to: userData.email,
            from: 'manhtue.truong@gmail.com',
            subject: 'Welcome to TueRecords',
            html: template,
        };
        sgMail.send(msg);

    }, error => {
        console.error(error);
    })
    
}

function getEmailTemplate(type) {
    let templatePath = '';
    switch(type) {
        case emailType.USER_REGISTRATION:
            templatePath = path.join(BASE_TEMPLATE_PATH, emailType.USER_REGISTRATION);
            break;
    }

    return new Promise(function (resolve, reject) {
        fs.readFile(templatePath, "utf8", (err, data) => {
            if (err)
                reject(err)
            else    
                resolve(data)
        })
    })
}

module.exports = {
    sendUserRegistrationEmail
}