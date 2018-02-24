const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
const User = require('../models/user');
const config = require('../../config');
const util = require('util');

const GenerateToken = (request) => {
    return new Promise((resolve, reject) => {
        User.findOne({
            name: request.name
        }, function (err, user) {

            if (err) {
                return reject({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            };
            if (!user) {
                reject({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {

                // check if password matches
                if (user.password != request.password) {
                    reject({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {

                    // if user is found and password is right
                    // create a token with only our given payload
                    // we don't want to pass in the entire user since that has the password
                    const payload = {
                        admin: user.admin,
                        expiresInMinutes: 1440
                    };
                    var token = jwt.sign(payload, config.secret, {});

                    // return the information including token as JSON
                    resolve({
                        success: true,
                        message: 'your token will expire in 24 hours',
                        token: token
                    });
                }

            }

        });
    })

}

const ValidateToken = (token) => {
    return new Promise((resolve, reject) => {
        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return reject({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                let message = util.format(config.token_message, decoded.expiresInMinutes)
                return resolve({
                    success: true,
                    message: message
                });
            }
        });
    })

}

module.exports = {
    generateToken: GenerateToken,
    validateToken: ValidateToken
}