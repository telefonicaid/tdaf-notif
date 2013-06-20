"use strict";

var
    mongoose = require('mongoose'),
    config = require('../../config'),
    defaultDb;
/**
 * This module sets up the connection with the mongodb through mongoose. This connection will be used
 * in mongoose schemas to persist objects.
 */

/**
 * Creates a new connection to the Mongo DB.
 *
 * @returns {*}
 *
 * @private
 */
function createConn() {
    var db = mongoose.createConnection(config.mongo.host, config.mongo.db);
    db.db.serverConfig.options.auto_reconnect = true;
    db.on('error', console.error.bind(console, 'connection error:'));

    return db;
}

exports.createConn = createConn;
exports.db = function () {
    if (!defaultDb) {
        defaultDb = createConn();
    }

    return defaultDb;
};