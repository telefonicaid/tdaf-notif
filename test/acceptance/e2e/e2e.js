var should = require('should');
var superagent = require('superagent');
var settings = require('./settings');

var tdafNotif = require('../../../src'),
		config = require('../../../src/config'),
		request = require('request'),
		async = require('async'),
		server,
		sendOptions;

var HOST = settings.notifServer.hostname;
var PORT = settings.notifServer.port;
var ENDPOINT = settings.externalEndpoint;
var TIMEOUT = settings.timeout;


describe('ACCEPTANCE TESTS: TDAF-NOTIF as a Service ', function () {
	//Start the app only if the server is localhost
	if (!settings.awsEndpoint) {
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
	}



	describe('\nScenario 1: Notify a Message ', function () {
					beforeEach(function (done) {
						sendOptions = {
							url: 'http://' + HOST + ':' + PORT + '/message',
							method: 'POST',
							json: {
								content: 'Acceptance TEST basic for TDAF-NOTIF'
							}
						};
						done();
					});

					it('should be accepted ', function (done) {
						request(sendOptions, function (error, response, body) {
							should.not.exist(error);
							response.statusCode.should.equal(200);
							done();
						});
					});
				});


	describe('\nScenario 2: API Checks', function(){

	describe('Sending request to NOTIF service /MESSAGE', function () {
		var agent = superagent.agent();

		/*
		 TO CHECK ACCEPTANCE
		 /message
		 POST */


		it('should accept requests using / POST', function (done) {
			agent
					.post('http://' + HOST + ':' + PORT+ '/message' )
					.send({
						content: 'TEST acceptance basic for TDAF-NOTIF'
					})
					.end(onResponse);

			function onResponse(err, res) {
				//console.log(res);
				should.not.exist(err);
				should.exist(res);
				res.headers['content-type'].should.eql('text/html; charset=utf-8');
				res.should.have.status(200);
				res.text.should.include('Message has been sent');
				return done();
			}
		});

		it('should accept requests sending contents using / POST', function (done) {
			agent
					.post('http://' + HOST + ':' + PORT+ '/message' )
					.set('X-relayer-host', ENDPOINT)
					.send({
						notif1: 'TEST acceptance basic for TDAF-NOTIF',
						notif2: 'NOTIF2'
					})
					.end(onResponse);

			function onResponse(err, res) {
				//console.log(res);
				should.not.exist(err);
				should.exist(res);
				res.headers['content-type'].should.eql('text/html; charset=utf-8');
				res.should.have.status(200);
				res.text.should.include('Message has been sent');
				return done();
			}
		});

	});

	describe('Sending request to NOTIF service /NOTIFIER', function () {
		var agent = superagent.agent();

		/*
		TO CHECK ACCEPTANCE
     /notifier
		GET, POST, PUT, DELETE
		*/


		it('should accept requests using / POST', function (done) {
			var date = new Date().toISOString()
			agent
					.post('http://' + HOST + ':' + PORT+ '/notifier' )
					.set('X-relayer-host', ENDPOINT)
					.send({
						service: 'newService_1' + date,
						cert: 'C',
						key: 'K'
					})
					.end(onResponse);

			function onResponse(err, res) {
				//console.log(res);
				should.not.exist(err);
				should.exist(res);
				res.headers['content-type'].should.eql('application/json; charset=utf-8');
				res.should.have.status(200);
				res.body.key.should.equal('K');
				res.body.cert.should.eql('C');
				res.body.service.should.eql('newService_1' + date);
				should.exists(res.body._id);
				return done();
			}
		});

		it('should accept requests sending contents using / POST', function (done) {
			var date = new Date().toISOString()
			agent
					.post('http://' + HOST + ':' + PORT+ '/notifier' )
					.set('X-relayer-host', ENDPOINT)
					.send({
						service: 'newService_' + date,
							cert: 'C',
							key: 'K',
						extracontent: 'test'
					})
					.end(onResponse);

			function onResponse(err, res) {
				//console.log(res);
				should.not.exist(err);
				should.exist(res);
				res.headers['content-type'].should.eql('application/json; charset=utf-8');
				res.should.have.status(200);
				res.body.key.should.equal('K');
				res.body.cert.should.eql('C');
				res.body.service.should.eql('newService_' + date);
				should.exists(res.body._id);
				return done();
			}
		});

		it.skip('should accept requests using / GET', function (done) {
			var date = new Date().toISOString()
			agent
					.get('http://' + HOST + ':' + PORT+ '/notifier' )
					.set('X-relayer-host', ENDPOINT)
					.send({
						service: 'newService_' + date,
						cert: 'C',
						key: 'K'
					})
					.end(onResponse);

			function onResponse(err, res) {
				//console.log(res);
				should.not.exist(err);
				should.exist(res);
				res.headers['content-type'].should.eql('application/json; charset=utf-8');
				res.should.have.status(200);
				res.body.key.should.equal('K');
				res.body.cert.should.eql('C');
				res.body.service.should.eql('newService_' + date);
				should.exists(res.body._id);
				return done();
			}
		});

		it.skip('should accept requests using / PUT', function (done) {
			var date = new Date().toISOString()
			agent
					.put('http://' + HOST + ':' + PORT+ '/notifier' )
					.set('X-relayer-host', ENDPOINT)
					.send({
						service: 'newService_' + date,
						cert: 'C',
						key: 'K'
					})
					.end(onResponse);

			function onResponse(err, res) {
				//console.log(res);
				should.not.exist(err);
				should.exist(res);
				res.headers['content-type'].should.eql('application/json; charset=utf-8');
				res.should.have.status(200);
				res.body.key.should.equal('K');
				res.body.cert.should.eql('C');
				res.body.service.should.eql('newService_' + date);
				should.exists(res.body._id);
				return done();
			}
		});

		it.skip('should accept requests using / DELETE', function (done) {
			var date = new Date().toISOString()
			agent
					.del('http://' + HOST + ':' + PORT+ '/notifier' )
					.set('X-relayer-host', ENDPOINT)
					.send({
						service: 'newService_1' + date,
						cert: 'C',
						key: 'K'
					})
					.end(onResponse);

			function onResponse(err, res) {
				//console.log(res);
				should.not.exist(err);
				should.exist(res);
				res.should.have.status(200);
				res.body.key.should.equal('K');
				res.body.cert.should.eql('C');
				res.body.service.should.eql('newService_1' + date);
				should.exists(res.body._id);
				return done();
			}
		});

	});

	describe.skip('Sending request to NOTIF service /CONSUMPTION', function () {
		var agent = superagent.agent();

		/* /consumption      		 GET 	 */


		it('should accept requests using / GET', function (done) {
			agent
					.get('http://' + HOST + ':' + PORT+ '/consumption/newService' )
					.end(onResponse);

			function onResponse(err, res) {
				//console.log(res);
				should.not.exist(err);
				should.exist(res);
//				res.headers['content-type'].should.eql('text/html; charset=utf-8');
				res.should.have.status(200);
				res.text.should.include('Message has been sent');
				return done();
			}
		});

		it.skip('should accept requests sending contents using / GET', function (done) {
			agent
					.get('http://' + HOST + ':' + PORT + '/consumption' )
					.end(onResponse);

			function onResponse(err, res) {
				//console.log(res);
				should.not.exist(err);
				should.exist(res);
//				res.headers['content-type'].should.eql('text/html; charset=utf-8');
				res.should.have.status(200);
				res.text.should.include('Message has been sent');
				return done();
			}
		});

	});

	});

	describe('\nScenario 3: Invalid requests responses', function(){

		describe('Sending request to NOTIF service /MESSAGE', function () {
			var agent = superagent.agent();

			/*
			 TO CHECK ACCEPTANCE
			 /message
			 POST */


			it('should NOT accept requests using / GET', function (done) {
				agent
						.get('http://' + HOST + ':' + PORT+ '/message' )
						.send({
							content: 'TEST acceptance basic for TDAF-NOTIF'
						})
						.end(onResponse);

				function onResponse(err, res) {
					//console.log(res);
					should.not.exist(err);
					should.exist(res);
				  res.should.have.status(404);
					return done();
				}
			});

		});

		describe('Sending request to NOTIF service /NOTIFIER', function () {
			var agent = superagent.agent();

			/*
			 TO CHECK ACCEPTANCE
			 /notifier
			 GET, POST, PUT, DELETE
			 */


			it.skip('should NOT accept requests using / DELETE', function (done) {
				var date = new Date().toISOString()
				agent
						.del('http://' + HOST + ':' + PORT+ '/notifier' )
						.set('X-relayer-host', ENDPOINT)
						.send({
							service: 'newService_1' + date,
							cert: 'C',
							key: 'K'
						})
						.end(onResponse);

				function onResponse(err, res) {
					//console.log(res);
					should.not.exist(err);
					should.exist(res);
					///res.headers['content-type'].should.eql('application/json; charset=utf-8');
					res.should.have.status(200);
					res.body.key.should.equal('K');
					res.body.cert.should.eql('C');
					res.body.service.should.eql('newService_1' + date);
					should.exists(res.body._id);
					return done();
				}
			});

			it('should NOT accept requests sending contents using / POST', function (done) {
				var date = new Date().toISOString()
				agent
						.post('http://' + HOST + ':' + PORT+ '/notifier' )
						.set('X-relayer-host', ENDPOINT)
						.send({
							service: 'newService_' + date,
							cert: 'C',
							key: 'K',
							extracontent: 'test'
						})
						.end(onResponse);

				function onResponse(err, res) {
					//console.log(res);
					should.not.exist(err);
					should.exist(res);
					res.headers['content-type'].should.eql('application/json; charset=utf-8');
					res.should.have.status(200);
					res.body.key.should.equal('K');
					res.body.cert.should.eql('C');
					res.body.service.should.eql('newService_' + date);
					should.exists(res.body._id);
					return done();
				}
			});

			it.skip('should NOT accept requests using / GET', function (done) {
				var date = new Date().toISOString()
				agent
						.get('http://' + HOST + ':' + PORT+ '/notifier' )
						.set('X-relayer-host', ENDPOINT)
						.send({
							service: 'newService_' + date,
							cert: 'C',
							key: 'K'
						})
						.end(onResponse);

				function onResponse(err, res) {
					//console.log(res);
					should.not.exist(err);
					should.exist(res);
					res.headers['content-type'].should.eql('application/json; charset=utf-8');
					res.should.have.status(200);
					res.body.key.should.equal('K');
					res.body.cert.should.eql('C');
					res.body.service.should.eql('newService_' + date);
					should.exists(res.body._id);
					return done();
				}
			});

			it.skip('should NOT accept requests using / PUT', function (done) {
				var date = new Date().toISOString()
				agent
						.put('http://' + HOST + ':' + PORT+ '/notifier' )
						.set('X-relayer-host', ENDPOINT)
						.send({
							service: 'newService_' + date,
							cert: 'C',
							key: 'K'
						})
						.end(onResponse);

				function onResponse(err, res) {
					//console.log(res);
					should.not.exist(err);
					should.exist(res);
					res.headers['content-type'].should.eql('application/json; charset=utf-8');
					res.should.have.status(200);
					res.body.key.should.equal('K');
					res.body.cert.should.eql('C');
					res.body.service.should.eql('newService_' + date);
					should.exists(res.body._id);
					return done();
				}
			});

			it.skip('should NOT accept requests using / DELETE', function (done) {
				var date = new Date().toISOString()
				agent
						.del('http://' + HOST + ':' + PORT+ '/notifier' )
						.set('X-relayer-host', ENDPOINT)
						.send({
							service: 'newService_1' + date,
							cert: 'C',
							key: 'K'
						})
						.end(onResponse);

				function onResponse(err, res) {
					//console.log(res);
					should.not.exist(err);
					should.exist(res);
					res.headers['content-type'].should.eql('application/json; charset=utf-8');
					res.should.have.status(200);
					res.body.key.should.equal('K');
					res.body.cert.should.eql('C');
					res.body.service.should.eql('newService_1' + date);
					should.exists(res.body._id);
					return done();
				}
			});

		});

		describe.skip('Sending request to NOTIF service /CONSUMPTION', function () {
			var agent = superagent.agent();

			/* /consumption      		 GET 	 */


			it('should NOT accept requests using / GET', function (done) {
				agent
						.get('http://' + HOST + ':' + PORT+ '/consumption/newService' )
						.end(onResponse);

				function onResponse(err, res) {
					//console.log(res);
					should.not.exist(err);
					should.exist(res);
//				res.headers['content-type'].should.eql('text/html; charset=utf-8');
					res.should.have.status(200);
					res.text.should.include('Message has been sent');
					return done();
				}
			});

			it.skip('should NOT accept requests sending contents using / GET', function (done) {
				agent
						.get('http://' + HOST + ':' + PORT + '/consumption' )
						.end(onResponse);

				function onResponse(err, res) {
					//console.log(res);
					should.not.exist(err);
					should.exist(res);
//				res.headers['content-type'].should.eql('text/html; charset=utf-8');
					res.should.have.status(200);
					res.text.should.include('Message has been sent');
					return done();
				}
			});

		});

	});


});



