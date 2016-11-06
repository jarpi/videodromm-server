﻿'use strict'

var express = require('express'),
	app = express(),
	//nodemon = require('nodemon'),
	//winston = require('winston'),
	http = require('http').Server(app),
	uuid = require('uuid'),
	WebSocketServer = require('ws').Server,
	wss = new WebSocketServer({ port: process.env.port });

app.use(express.static('src/www'));

wss.on('connection', function (socket) {
	socket.id = uuid.v4();
	console.log('a user connected');
	socket.on('disconnect', function () {
		console.log('user disconnected');
	});
	socket.on('message', function (msg) {
		console.log('Message received');
		wss.broadcast(msg, socket.id);
	});
});

// TODO: REFACTOR
wss.broadcast = function (msg, sender) {
	wss.clients.forEach(function (client) {
		if (client.id !== sender) client.send(msg) & console.log('Message sent!');// & winston.info('Message sent!');
	});
}

http.listen(process.env.port || 8080, function () {
	//winston.info('Application server running!');
	console.log('Application server running!');
});
