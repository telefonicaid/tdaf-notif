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

var messageLogic = require("../messages/messageLogic"),
    async = require('async');

/**
 * Message sending endpoint. Checks the correction of the message body.
 *
 * @param request
 * @param response
 */
function sendMessage(request, response) {

  async.series([
    async.apply(messageLogic.check, request.body),
    async.apply(messageLogic.send, request.body)
  ], function (error, res) {
    if (error) {
      response.send(error.code, error);
    } else {
      response.send(200, res[1]);
    }
  });
}

exports.send = sendMessage;