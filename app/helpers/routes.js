'use strict';

const Joi = require('joi');
const Handlers = require('../lib/handlers.js');


const resultHTTPStatus = {
    '200': {
        'description': 'Success'
    },
    '400': {
        'description': 'Bad Request'
    },
    '404': {
        'description': 'Profile not found'
    },
    '500': {
        'description': 'Internal Server Error'
    }
};

// router.route('/users')
//   .post(createUser)
//   .get(getAllUsers);

// router.route('/users/:userId')
//   .get(getOneUser)
//   .put(updateUser)
//   .delete(deleteUser);

// router.param('userId', getByIdUser);

// app.use('/api/v1', router);

// app.listen(3000);
// module.exports = app;
module.exports = [{
        method: 'GET',
        path: '/users',
        config: {
            handler: Handlers.getAllUsers,
            description: 'Get All Users',
            tags: ['api', 'reduced'],
            notes: ['Fetches all the existing users data from mongodb'],
            plugins: {
                'hapi-swagger': {
                    responses: resultHTTPStatus
                }
            }
        }
    }, {
        method: 'POST',
        path: '/users',
        config: {
            handler: Handlers.createUser,
            description: 'Create New Users',
            tags: ['api', 'reduced'],
            notes: ['Create a new users and updates data into MongoDB'],
            plugins: {
                'hapi-swagger': {
                    responses: resultHTTPStatus
                }
            },
            validate: {
                payload: {
                    name: Joi.string().required(),
                    password: Joi.string().required(),
                    admin: Joi.boolean().required()
                }
            }
        }
    }
];