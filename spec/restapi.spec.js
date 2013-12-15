var should = require('should'),
    RestApi = require('../lib/restapi'),
    request = require('../lib/request'),
    sinon = require('sinon');

describe('RestApi', function() {

    beforeEach(function() {
        this.get = sinon.stub(request.Request.prototype, 'get');
        this.put = sinon.stub(request.Request.prototype, 'put');
        this.post = sinon.stub(request.Request.prototype, 'post');
        this.delete = sinon.stub(request.Request.prototype, 'delete');
    });

    afterEach(function() {
        this.get.restore();
        this.put.restore();
        this.post.restore();
        this.delete.restore();
    });

    describe('#constructor', function() {

        beforeEach(function() {
            sinon.spy(request, 'init');
        });

        afterEach(function() {
            request.init.restore();
        });

        it('initializes request with default server and api version', function() {
            var restApi = new RestApi();
            var initArgs = request.init.firstCall.args[0];
            initArgs.server.should.eql('https://rally1.rallydev.com');
            initArgs.apiVersion.should.eql('v2.0');
            restApi.request.should.be.exactly(request.init.firstCall.returnValue);
        });

        it('initializes request with specified server and api version', function() {
            var restApi = new RestApi({
                server: 'http://www.google.com',
                apiVersion: 5
            });
            var initArgs = request.init.firstCall.args[0];
            initArgs.server.should.eql('http://www.google.com');
            initArgs.apiVersion.should.eql(5);
            restApi.request.should.be.exactly(request.init.firstCall.returnValue);
        });

        it('initializes request with default auth options', function() {
            process.env.RALLY_USERNAME = 'user';
            process.env.RALLY_PASSWORD = 'pass';
            var restApi = new RestApi();
            var requestOptions = request.init.firstCall.args[0].requestOptions;
            requestOptions.jar.should.eql(true);
            requestOptions.auth.user.should.eql('user');
            requestOptions.auth.pass.should.eql('pass');
            restApi.request.should.be.exactly(request.init.firstCall.returnValue);
        });

        it('initializes request with specified auth options', function() {
            var restApi = new RestApi({
                requestOptions: {
                    auth: {
                        user: 'user1',
                        pass: 'pass1'
                    }
                }
            });
            var requestOptions = request.init.firstCall.args[0].requestOptions;
            requestOptions.jar.should.eql(true);
            requestOptions.auth.user.should.eql('user1');
            requestOptions.auth.pass.should.eql('pass1');
            restApi.request.should.be.exactly(request.init.firstCall.returnValue);
        });

        it('initializes request with correct integration headers', function() {
            var restApi = new RestApi();
            var initArgs = request.init.firstCall.args[0];
            initArgs.requestOptions.headers.should.eql({
                'X-RallyIntegrationLibrary': 'Rally REST Toolkit for Node.js v0.0.0',
                'X-RallyIntegrationName': 'Rally REST Toolkit for Node.js',
                'X-RallyIntegrationVendor': 'Rally Software, Inc.',
                'X-RallyIntegrationVersion': '0.0.0'
            });
            restApi.request.should.be.exactly(request.init.firstCall.returnValue);
        });
    });

    describe('#create', function() {

    });

    describe('#update', function() {

    });

    describe('#get', function() {

    });

    describe('#delete', function() {

    });

    describe('#query', function() {

    });
});