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

module.exports = {
    getAllUsers: GetAllUsers,
    createUser: CreateUser,
    updateUser: UpdateUser,
    deleteUser: DeleteUser,
    getOneUser: GetOneUser,
    getByIdUser: GetByIdUser,
}