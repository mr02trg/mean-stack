var bcrypt = require('bcrypt');

const jwtHelper = require('../auth/jwt-helper');
const User = require('../models/user');

function registerUser(req, res, next) {
    if (req.body) {
        bcrypt.hash(req.body.password, 10)
        .then(success => {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: success
            });
            return newUser.save();
        })
        .then(document => {
            res.status(201).json({
                'message': 'User created successfully',
                'user': {
                    name: document.name,
                    email: document.email
                }
            });
        })
        .catch(err => {
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
    if (req.body) {
        // retrieve user data
        let user = null;
        User.findOne({email: req.body.email})
            .then(document => {
                if (! document) {
                    return res.status(400).json({
                        'message': 'Failed to authenticate'
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
    else {
        res.status(400).json({
            'message': 'Failed to authenticate',
        });
    }
}

module.exports = {
    registerUser,
    authenticateUser
}