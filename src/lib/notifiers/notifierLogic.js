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

"use strict";

var config = require("../../config"),
    uuid = require("node-uuid"),
    Notifier = require("../db/notifierObj");

/**
 * Create a new notifier in the system. No restrictions are imposed on the notifier contents.
 * Generates a unique ID for the notifier.
 *
 * @param notifier Body of the notifier to be created.
 * @param callback If no error is returned, it will be invoked with the stored notifier.
 */
function createNotifier(notifier, callback) {
    var id = uuid.v4(),
        notif = new Notifier();

    notif.id = id;
    notif.service = notifier.service;
    notif.pushType = notifier.pushType;
    notif.credentials = notifier.credentials;

    notif.save(function (error, res) {
        if (error) {
            callback(error);
        } else {
            callback(null, res);
        }
    });
}

/**
 * List all the system notifiers.
 *
 * @param callback If no error occurred, will be invoked with the list of stored notifiers.
 */
function listNotifiers(callback) {
    Notifier.find(callback);
}

/**
 * Get all the information about the notifier with the given name.
 *
 * @param name  Name of the notifier to retrieve.
 * @param callback If there are no errors, will be called with the retrieved notifier object.
 */
function getNotifier(id, callback) {
    Notifier.findOne({id: id}, function (error, res) {
        if (error) {
            callback({
                code: 500,
                message: error
            });
        } else if (res == null) {
            callback({
                code: 404,
                message: "Notifier not found"
            });
        } else {
            callback(null, res);
        }
    });
}

/**
 * Remove the selected notifier with the given name from the DB.
 *
 * @param id ID of the notifier to be removed.
 * @param callback If there is no error, it will be called without parameters.
 */
function removeNotifier(id, callback) {
    Notifier.remove({id: id}, function (error, res) {
        if (error) {
            callback({
                code: 500,
                message: error
            });
        } else if (res == 0) {
            callback({
                code: 404,
                message: "Notifier not found"
            });
        } else {
            callback(null);
        }
    });
}

exports.create = createNotifier;
exports.list = listNotifiers;
exports.get = getNotifier;
exports.remove = removeNotifier;