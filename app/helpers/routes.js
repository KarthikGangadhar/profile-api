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

module.exports = [{
        method: 'GET',
        path: '/api/users',
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
    },
    {
        method: 'POST',
        path: '/api/users',
        config: {
            handler: Handlers.createUser,
            description: 'Create New Users',
            tags: ['api', 'reduced'],
            notes: ['Create a new users and updates data'],
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
    },
    {
        method: 'GET',
        path: '/api/users/{userId}',
        config: {
            handler: Handlers.getByIdUser,
            description: 'Get Users By ID',
            tags: ['api', 'reduced'],
            notes: ['Fetches the existing users data by Id'],
            plugins: {
                'hapi-swagger': {
                    responses: resultHTTPStatus
                }
            },
            validate: {
                query: {
                    id: Joi.string().required().description('Id: User Id')
                }
            }
        }
    },
    {
        method: 'PUT',
        path: '/api/users/{userId}',
        config: {
            handler: Handlers.updateUser,
            description: 'Update existing User Data',
            tags: ['api', 'reduced'],
            notes: ['Update a users data by Id'],
            plugins: {
                'hapi-swagger': {
                    responses: resultHTTPStatus
                }
            },
            validate: {
                payload: {
                    name: Joi.string(),
                    password: Joi.string(),
                    admin: Joi.boolean()
                },
                query: {
                    id: Joi.string().required().description('Id: User Id')
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/users/{userId}',
        config: {
            handler: Handlers.deleteUser,
            description: 'Delete a User Data',
            tags: ['api', 'reduced'],
            notes: ['Update a users data by Id'],
            plugins: {
                'hapi-swagger': {
                    responses: resultHTTPStatus
                }
            },
            validate: {
                payload: {
                    _id: Joi.string().required(),
                    name: Joi.string().required(),
                    password: Joi.string()
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/authenticate',
        config: {
            handler: Handlers.authenticateUser,
            description: 'Authenticate Users',
            tags: ['api', 'reduced'],
            notes: ['Create a new users and updates data'],
            plugins: {
                'hapi-swagger': {
                    responses: resultHTTPStatus
                }
            },
            validate: {
                payload: {
                    name: Joi.string().required(),
                    password: Joi.string().required(),
                }
            }
        }
    },
    {
        method: 'POST',
        path: '/api/validateToken',
        config: {
            handler: Handlers.verifyUserToken,
            description: 'Validate Users',
            tags: ['api', 'reduced'],
            notes: ['verify user token'],
            plugins: {
                'hapi-swagger': {
                    responses: resultHTTPStatus
                }
            },
            validate: {
                query: {
                    token: Joi.string().required()
                }
            }
        }
    }
];