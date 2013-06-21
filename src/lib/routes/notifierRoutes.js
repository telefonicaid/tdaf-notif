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

var notifiers = require("../notifiers/notifierLogic"),
    async = require("async");

/**
 * Checks whether the notifier meets all the requirements to be created or not.
 *
 * @param body Notifier object to be checked.
 * @param callback Called with the found error in case it exists, with null otherwise.
 */
function checkNotifierBody(body, callback) {
    if (!body.service|| !body.cert || !body.key) {
      console.log(body);
        callback({
            message: "Missing parameters in call",
            code: 400
        });
    } else {
        notifiers.get(body.service, function (err, notifier) {
            if (notifier) {
                callback({
                    code: 400,
                    message: "There already exists a notifier for that service"
                });
            } else {
                callback(null);
            }
        });
    }
}

/**
 * Notifier creation endpoint. Checks the correction of the notifier body before invoking the notifierLogic service.
 *
 * @param request
 * @param response
 */
function createNotifier(request, response) {

    async.series([
        async.apply(checkNotifierBody, request.body),
        async.apply(notifiers.create, request.body)
    ], function (error, res) {
        if (error) {
            response.send(error.code, error);
        } else {
            response.send(200, res[1]);
        }
    });
}

/**
 * Notifier listing endpoint.
 *
 * @param request
 * @param response
 */
function listNotifiers(request, response) {
    notifiers.list(function (error, res) {
        if (error) {
            response.send(error.code, error);
        } else {
            response.send(200, res);
        }
    });
}

/**
 * Notifier information retrieval endpoint.
 *
 * @param request
 * @param response
 */
function getNotifier(request, response) {
    notifiers.get(request.params.name, function (error, res) {
        if (error) {
            response.send(error.code, error);
        } else {
            response.send(200, res);
        }
    });
}

/**
 * Notifier removal endpoint.
 *
 * @param request
 * @param response
 */
function removeNotifier(request, response) {
    notifiers.remove(request.params.name, function (error, res) {
        if (error) {
            response.send(error.code, error);
        } else {
            response.send(200, {
                name: request.params.name
            });
        }
    });
}

exports.create = createNotifier;
exports.list = listNotifiers;
exports.get = getNotifier;
exports.remove = removeNotifier;
