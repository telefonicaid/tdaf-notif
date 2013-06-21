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

var config = require("../../config");

/**
 * Checks whether the message meets all the requirements to be sent or not.
 *
 * @param body Message object to be checked.
 * @param callback Called with the found error in case it exists, with null otherwise.
 */
function checkMessageBody(body, callback) {
        callback(null);
 }

/**
 * Send a message
 *
 * @param message Body of the message to be sent.
 * @param callback If no error is returned, it will be invoked with the stored notifier.
 */
function sendMessage(message, callback) {
   console.log('sending ...', message);
  callback(null, "Message has been sent");
}

exports.send = sendMessage;
exports.check = checkMessageBody;
