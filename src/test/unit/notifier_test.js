'use strict';

var tdafNotif = require('../../'),
    config = require('../../config'),
    request = require('request'),
    tools = require('../testTools'),
    async = require('async'),
    server,
    listOptions,
    createOptions,
    getOptions,
    removeOptions;

describe('Notifier Management', function () {
  beforeEach(function (done) {
    server = tdafNotif.start(function (error) {
      tools.clean(done);
    });
  });

  afterEach(function (done) {
    tdafNotif.stop(server, function (error) {
      tools.clean(done);
    });
  });

  describe('When there is a request to create a new notifier', function () {

    beforeEach(function (done) {
      createOptions = {
        url: 'http://localhost:' + config.endpoint.port + '/notifier',
        method: 'POST',
        json: {
          service: 'newService',
          cert: 'C',
          key: 'K'
        }
      };

      done();
    });


    it('should fail if the service is not given', function (done) {
      delete createOptions.json.service;

      request(createOptions, function (error, response, body) {
        should.not.exist(error);
        response.statusCode.should.equal(400);
        done();
      });
    });

    it('should fail if the key is not given', function (done) {
      delete createOptions.json.key;

      request(createOptions, function (error, response, body) {
        should.not.exist(error);
        response.statusCode.should.equal(400);
        done();
      });
    });

    it('should fail if the cert is not given', function (done) {
      delete createOptions.json.cert;

      request(createOptions, function (error, response, body) {
        should.not.exist(error);
        response.statusCode.should.equal(400);
        done();
      });
    });

    it('should fail if the service is repeated', function (done) {
      request(createOptions, function (error, response, body) {
        request(createOptions, function (error, response, body) {
          should.not.exist(error);
          response.statusCode.should.equal(400);
          done();
        });
      });
    });

    it('should return a full description of the notifier if correct', function (done) {
      request(createOptions, function (error, response, body) {
        should.not.exist(error);
        response.statusCode.should.equal(200);
        should.exist(body);
        body.service.should.equal('newService');
        body.key.should.equal('K');
        body.cert.should.equal('C');
        done();
      });
    });
  });

  describe('When a request for the notifiers list arrives', function () {
    beforeEach(function (done) {
      listOptions = {
        url: 'http://localhost:' + config.endpoint.port + '/notifier',
        method: 'GET',
        json: {}
      };

      createOptions.json.service = 'newService1';

      request(createOptions, function (error, response, body) {
        createOptions.json.service = 'newService2';

        request(createOptions, function (error, response, body) {
          done();
        });
      });
    });

    it('should return the list of all the created notifiers', function (done) {
      request(listOptions, function (error, response, body) {
        should.not.exist(error);
        response.statusCode.should.equal(200);
        should.exist(body);
        body.length.should.equal(2);
        body[0].service.should.equal('newService1');
        body[1].service.should.equal('newService2');
        done();
      });
    });
  });

  describe('When a request for the service info arrives', function () {
    beforeEach(function (done) {
      getOptions = {
        url: 'missing',
        method: 'GET',
        json: {}
      };

      createOptions.json.service = 'newService';
      request(createOptions, function (error, response, body) {
        getOptions.url = 'http://localhost:' + config.endpoint.port + '/notifier/newService';
        done();
      });
    });

    it('should return a Not Found error if the notifier is not found', function (done) {
      getOptions.url = 'http://localhost:' + config.endpoint.port + '/notifier/falseNotifier';

      request(getOptions, function (error, response, body) {
        should.not.exist(error);
        response.statusCode.should.equal(404);
        done();
      });
    });

    it('should return the full description of the notifier', function (done) {
      request(getOptions, function (error, response, body) {
        should.not.exist(error);
        response.statusCode.should.equal(200);
        should.exist(body);
        body.service.should.equal('newService');
        body.key.should.equal('K');
        body.cert.should.equal('C');
        done();
      });
    });
  });

  describe('When a request for a notifier removal arrives', function () {
    beforeEach(function (done) {
      removeOptions = {
        url: 'missing',
        method: 'DELETE',
        json: {}
      };

      createOptions.json.service = 'newService1';

      request(createOptions, function (error, response, body) {
        createOptions.json.service = 'newService2';

        request(createOptions, function (error, response, body) {
          removeOptions.url = 'http://localhost:' + config.endpoint.port + '/notifier/newService1',
              done();
        });
      });
    });

    it('should return a Not Found error if the notifier does not exist', function (done) {
      removeOptions.url = 'http://localhost:' + config.endpoint.port + '/notifier/falseNotifier';
      request(removeOptions, function (error1, response1, body1) {
        should.not.exist(error1);
        response1.statusCode.should.equal(404);
        done();
      });
    });

    it('should remove the notifier from the notifier list', function (done) {
      request(removeOptions, function (error1, response1, body1) {
        should.not.exist(error1);
        response1.statusCode.should.equal(200);

        request(listOptions, function (error2, response2, body2) {
          body2.length.should.equal(1);
          done();
        });
      });
    });
  });
});
