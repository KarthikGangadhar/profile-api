'use strict';
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const Pack = require('./package');
const Routes = require('./app/helpers/routes');

const  server = new Hapi.Server();
server.connection({
    host: (process.env.HOST || 'localhost'),
    port: (process.env.PORT || 8080),
    routes: { cors: true }
});


// setup swagger options
const swaggerOptions = {
    info: {
        version: Pack.version,
        title: 'Profile API Documentation',
        description: 'This is a REST API create using hapi and mangoose to maintains developers profiles.'
    },
    tags: [{
        'name': 'index',
        'description': 'working with maths',
        'externalDocs': {
            'description': 'Find out more',
            'url': 'localhost:8080/'
        }
    }, {
        'name': 'store',
        'description': 'storing your sums for later use',
        'externalDocs': {
            'description': 'Find out more',
            'url': 'http://example.org'
        }
    }]
};

// register plug-ins
server.register([
    Inert,
    Vision,
    {
        register: require('hapi-swagger'),
        options: swaggerOptions
    }
    ], function (err) {
        server.start(function(){
            console.log('Server running at:', server.info.uri);
        });
    });


// add routes
server.route(Routes);