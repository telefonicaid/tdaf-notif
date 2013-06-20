"use strict";

var Notifier = require("../lib/db/notifierObj");

function cleanDb(callback) {
    Notifier.remove(function (error) {
        callback(null);
    });
}

exports.clean = cleanDb;