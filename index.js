const hapi = require('hapi');
const mongoose = require('mongoose');
const Painting = require('./models/Painting');
const fileSystem = require('fs');

mongoose.connect('mongodb://127.0.0.1:27017/?gssapiServiceName=mongodb');

    // Init Server
const server = new hapi.Server({
    port: 8000,
    host: 'localhost'
});

    // Static Routes
server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      return '<h1>My modern API</h1>';
    }
  });

  server.route({
    method: 'GET',
    path: '/Home',
    handler: function (request, h) {
        return '<h1>Welcome Home</h1>';
    }
});

server.route({
    method: 'GET',
    path: '/MonaLisa',
    handler: function (request, h) {
        var img = fileSystem.createReadStream('public/MonaLisa.jpg');
        return img;
    }
});

    // Dynamic Routes
server.route({
    method: 'GET',
    path: '/user/{name}',
    handler: function (request, h) {
      return 'Hello, ' + request.params.name;
    }
  });

server.route({
    method: 'GET',
    path: '/api/v1/paintings',
    config: {
        description: 'Get all the paintings',
        tags: ['api', 'v1', 'painting']
    },
    handler: function (request, h) {
        return Painting.find();
    }
});

server.route({
    method: 'POST',
    path: '/api/v1/paintings',
    config: {
        description: 'POST a Painting',
        tags: ['api', 'v1', 'painting']
    },
    handler: function (request, h) {
        const {name, url, techniques} = request.payload;
        const painting = new Painting({
            name,
            url,
            techniques
        });
        return painting.save();
    }
});

    // Add Server
const init = async () => {
    await server.start((err) => {
    if(err) {
        throw err;
    }
    console.log(`Server started at: ${server.info.uri}`);
});
};

init();