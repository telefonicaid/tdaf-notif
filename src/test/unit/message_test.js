'use strict';

var tdafNotif = require('../../'),
    config = require('../../config'),
    request = require('request'),
    async = require('async'),
    server,
    sendOptions;

describe('Message sending', function () {
  beforeEach(function (done) {
    server = tdafNotif.start(function (error) {
      if(error) throw error;
      done();
    });
  });
  afterEach(function (done) {
    tdafNotif.stop(server, function (error) {
      if(error) throw error;
      done();
    });
  });
  describe('When there is a request to send a message', function () {
    beforeEach(function (done) {
      sendOptions = {
        url: 'http://localhost:' + config.endpoint.port + '/message',
        method: 'POST',
        json: {
          content: 'Hey Carrie Anne, what are you doing?'
       }
      };
      done();
    });
    it('should be sent', function (done) {
      request(sendOptions, function (error, response, body) {
        should.not.exist(error);
        response.statusCode.should.equal(200);
        done();
      });
    });
  });
});
