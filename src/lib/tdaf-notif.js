/*
 * Copyright 2013 Telefonica Investigación y Desarrollo, S.A.U
 *
 * This file is part of tdaf-notif
 *
 * tdaf-notif is free software: you can redistribute it and/or
 * modify it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the License,
 * or (at your option) any later version.
 *
 * tdaf-notif is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public
 * License along with tdaf-notif.
 * If not, seehttp://www.gnu.org/licenses/.
 *
 * For those usages not covered by the GNU Affero General Public License
 * please contact with::[contacto@tid.es]
 */

'use strict';


var notifiers = require("./routes/notifierRoutes"),
    //messages = require("./routes/messageRoutes"),
    express = require('express'),
    express = require('express'),
    config = require('./../config'),
    http = require('http'),
    path = require('path');


function createRoutes(app) {
    app.post('/notifier', notifiers.create);
    app.get('/notifier', notifiers.list);
    app.get('/notifier/:name', notifiers.get);
    app.delete('/notifier/:name', notifiers.remove);
    //app.post('/message', messages.send);
}

function startServer(callback) {
    var app = express(),
        server;

    app.configure(function () {
        app.set('port', config.endpoint.port);
        app.use(express.favicon());
        app.use(express.logger('dev'));
        app.use(express.bodyParser());
        app.use(express.methodOverride());
        app.use(app.router);
        app.use(express.static(path.join(__dirname, 'public')));
    });

    app.configure('development', function () {
        app.use(express.errorHandler());
        app.use(express.logger('dev'));
    });

    createRoutes(app);

    server = http.createServer(app).listen(app.get('port'), function () {
        callback(null, server);
    });

    return server;
}

function stopServer(server, callback) {
    server.close(callback);
}

exports.start = startServer;
exports.stop = stopServer;


