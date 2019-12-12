const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const moment = require('moment');

const jwtHelper = require('../auth/jwt-helper');
const User = require('../models/user');
const emailService = require('./email/emailService');

function registerUser(req, res, next) {
    if (req.body) {
        bcrypt.hash(req.body.password, 10)
        .then(success => {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: success,
                activationToken: uuidv4(),
                activationTokenExpiry: moment.utc().add(1, 'w').valueOf()
            });
            return newUser.save();
        })
        .then(document => {
            emailService.sendUserRegistrationEmail(document);
            res.status(201).json({
                'message': 'User created successfully',
                'user': {
                    name: document.name,
                    email: document.email
                }
            });
        })
        .catch(err => {
            console.error(err);
            res.status(400).json({
                'message': 'Failed to register',
                'error': err
            });
        })
    }
    else {
        res.status(400).json({
            'message': 'Failed to register',
        });
    }
}

function authenticateUser(req, res, next) {
    let user = null;
    User.findOne({email: req.body.email})
        .then(document => {
            if (! document) {
                return res.status(400).json({
                    'message': 'Incorrect email or password'
                });
            }
                
            user = document;
            // validate password
            return bcrypt.compare(req.body.password, document.password);
        })
        .then(result => {
            if (! result) {
                return res.status(401).json({
                    'message': 'Failed to authenticate'
                });
            }

            if (! user.isActivated) {
                return res.status(400).json({
                    'message': 'Account is not activated'
                })
            }

            const jwtToken = jwtHelper.sign({email: user.email, id: user._id});
            res.status(200).json({
                'message': 'Authenticate successfully',
                'token': jwtToken,
                'user': {
                    id: user._id,
                    name: user.name
                }
            })
        })
        .catch(err => {
            res.status(400).json({
                'message': 'Failed to authenticate',
                'error': err
            });
        })
}

function verifyActivationToken(req, res, next) {
    User.findOne({activationToken: req.body.token})
        .then(document => {
            if (document && moment(document.activationTokenExpiry) >= moment.utc() ) {
                res.status(200).json({
                    'message': 'Verify token successfully',
                    'result': true
                });
            } else {
                res.status(400).json({
                    'message': 'Failed to verify',
                });
            }
        }, error => {
            res.status(400).json({
                'message': 'Failed to verify',
                'error': err
            });
        })
}


function activateUser(req, res, next) {
    let user = null
    User.findOne({activationToken: req.body.token})
    .then(document => {
        if (! document) {
            return res.status(400).json({
                'message': 'Failed to activate'
            });
        }
        user = document;
        // validate password
        return bcrypt.compare(req.body.password, document.password);
    })
    .then(result => {
        if (! result) {
            return res.status(401).json({
                'message': 'Failed to activate'
            });
        }

        // update user
        user.activationToken = null;
        user.activationTokenExpiry = null;
        user.isActivated = true;

        return User.update({activationToken: req.body.token}, user);
    })
    .then(result => {
        if (result.nModified === 1) {
            res.status(200).json({
                'message': 'Activate successfully',
                'result': true
            });
        }
    })
    .catch(err => {
        res.status(400).json({
            'message': 'Failed to authenticate',
            'error': err
        });
    })
}

module.exports = {
    registerUser,
    authenticateUser,
    verifyActivationToken,
    activateUser
}