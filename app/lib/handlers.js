const mongoose = require('mongoose');
const config = require('../../config');
const User = require('../models/user');
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

mongoose.connect(config.database);

const CreateUser = (request, reply) => {
    var user = new User(request.payload);

    user.save((err) => {
        if (err) {
            reply({
                "err": err
            })
        } else {
            reply(user);
        }
    });
};

const UpdateUser = (request, reply) => {
    User.findByIdAndUpdate(request.query.id, request.payload, {
        new: true
    }, (err, user) => {
        if (err) {
            reply({
                err: err
            });
        } else {
            reply(user);
        }
    });
};

const DeleteUser = (request, reply) => {
    User.remove(request.payload, (err, data) => {
        if (err) {
            reply({
                err: err
            });
        } else {
            reply({
                message: "success"
            });
        }
    });
};

const GetAllUsers = (request, reply) => {
    User.find((err, users) => {
        if (err) {
            reply({
                'err': err
            });
        } else {
            reply(users);
        }
    });
};

const GetOneUser = (request, reply) => {
    reply(request.user);
};

const GetByIdUser = (request, reply) => {
    let id = request.query.id;
    User.findOne({
        _id: id
    }, (err, user) => {
        if (err) {
            reply({
                err: err
            });
        } else {
            reply(user);
        }
    });
};

const AuthenticateUser = (request, reply) => {
    // find the user
    User.findOne({
        name: request.payload.name
    }, function (err, user) {

        if (err) throw err;

        if (!user) {
            reply({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            // check if password matches
            if (user.password != request.payload.password) {
                reply({
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
                reply({
                    success: true,
                    message: 'your token will expire in 24 hours',
                    token: token
                });
            }

        }

    });
};

const VerifyUserToken = (request, reply) => {
    // check header or url parameters or post parameters for token
    var token = request.query.token || request.headers['x-access-token'];

    // decode token
    if (token) {

        // verifies secret and checks exp
        jwt.verify(token, config.secret, function (err, decoded) {
            if (err) {
                return res.json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                request.decoded = decoded;
                return reply({
                    success: true,
                    message: "expires in " + decoded.expiresInMinutes + " minutes"
                });
            }
        });

    } else {

        // if there is no token
        // return an error
        return reply({
            success: false,
            message: 'token not valid.'
        });

    }
}

module.exports = {
    getAllUsers: GetAllUsers,
    createUser: CreateUser,
    updateUser: UpdateUser,
    deleteUser: DeleteUser,
    getOneUser: GetOneUser,
    getByIdUser: GetByIdUser,
    authenticateUser: AuthenticateUser,
    verifyUserToken: VerifyUserToken
}