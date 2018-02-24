const mongoose = require('mongoose');
const config = require('../../config');
const User = require('../models/user');

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

const UpdateUser = (request, reply, next) => {
    User.findByIdAndUpdate(request.body._id, request.body, {
        new: true
    }, (err, user) => {
        if (err) {
            next(err);
        } else {
            reply(user);
        }
    });
};

const DeleteUser = (request, reply, next) => {
    request.user.remove((err) => {
        if (err) {
            next(err);
        } else {
            reply(request.user);
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

const GetByIdUser = (request, reply, next, id) => {
    User.findOne({
        _id: id
    }, (err, user) => {
        if (err) {
            next(err);
        } else {
            request.user = user;
            next();
        }
    });
};

module.exports = {
    getAllUsers: GetAllUsers,
    createUser: CreateUser,
    updateUser: UpdateUser,
    deleteUser: DeleteUser,
    getOneUser: GetOneUser,
    getByIdUser: GetByIdUser,
}