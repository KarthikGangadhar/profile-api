const mongoose = require('mongoose');
const config = require('../../config');
const User = require('../models/user');
const Authenticate = require('../helpers/authentication_helper');

mongoose.connect(config.database);

const CreateUser = (request, reply) => {
    var user = new User(request.payload);

    user.save((err) => {
        if (err) {
            reply({
                success: false,
                message: err
            })
        } else {
            reply(user);
        }
    });
};

const UpdateUser = (request, reply) => {
    if (!request.query && !request.query.token) {
        reply(config.Authentication_messages.token_required)
    } else {
        Authenticate.validateToken(request.query.token).then((response) => {
            User.findByIdAndUpdate(request.query.id, request.payload, {
                new: true
            }, (err, user) => {
                if (err) {
                    reply({
                        success: false,
                        message: err
                    });
                } else {
                    reply(user);
                }
            });
        }).catch((error) => {
            reply(error);
        })
    }
};

const DeleteUser = (request, reply) => {
    if (!request.query && !request.query.token) {
        reply(config.Authentication_messages.token_required)
    } else {
        Authenticate.validateToken(request.query.token).then((response) => {
            User.remove(request.payload, (err, data) => {
                if (err) {
                    reply({
                        success: false,
                        message: err.message
                    });
                } else {
                    if (data && !!data.n) {
                        reply(config.Authentication_messages.delete_success);
                    } else {
                        reply(config.Authentication_messages.profile_not_exist);
                    }

                }
            });
        }).catch((error) => {
            reply(error);
        })
    }
};

const GetAllUsers = (request, reply) => {
    if (!request.query && !request.query.token) {
        reply(config.Authentication_messages.token_required)
    } else {
        Authenticate.validateToken(request.query.token).then((response) => {
            User.find({}, {
                password: 0,
                __v: 0
            }, (err, users) => {
                if (err) {
                    reply({
                        success: false,
                        message: err
                    });
                } else {
                    reply(users);
                }
            });
        }).catch((error) => {
            reply(error);
        })
    }
};

const GetOneUser = (request, reply) => {
    reply(request.user);
};

const GetByIdUser = (request, reply) => {
    if (!request.query && !request.query.token) {
        reply(config.Authentication_messages.token_required)
    } else {
        Authenticate.validateToken(request.query.token).then((response) => {
            let id = request.query.id;
            User.findOne({
                _id: id
            }, {
                __v: 0
            }, (err, user) => {
                if (err) {
                    reply({
                        success: false,
                        message: err
                    });
                } else {
                    reply(user);
                }
            });
        }).catch((error) => {
            reply(error);
        });
    }
};

const AuthenticateUser = (request, reply) => {
    Authenticate.generateToken(request.payload).then((response) => {
        reply(response);
    }).catch((error) => {
        reply(error);
    });
};

const VerifyUserToken = (request, reply) => {
    // check header or url parameters or post parameters for token
    var token = request.query.token || request.headers['x-access-token'];

    if (token) {
        Authenticate.validateToken(token).then((response) => {
            return reply(response);
        }).catch((error) => {
            return reply(error);
        })
    } else {
        // if there is no token
        // return an error
        return reply({
            success: false,
            message: 'token is required.'
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