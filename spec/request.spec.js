var should = require('should'),
    rallyRequest = require('../lib/request'),
    request = require('request'),
    sinon = require('sinon');

describe('Request', function() {

    beforeEach(function() {
        this.get = sinon.stub(request, 'get');
        this.put = sinon.stub(request, 'put');
        this.post = sinon.stub(request, 'post');
        this.del = sinon.stub(request, 'del');
    });

    afterEach(function() {
        this.get.restore();
        this.put.restore();
        this.post.restore();
        this.del.restore();
    });

    describe('#constructor', function() {

        it('should initialize the wsapi url correctly', function() {
            var rr = rallyRequest({
                server: 'http://www.acme.com',
                apiVersion: 'v3.0'
            });
            rr.wsapiUrl.should.eql('http://www.acme.com/slm/webservice/v3.0')
        });

        it('should pass request options through', function() {
            var defaults = sinon.spy(request, 'defaults');
            var requestOptions = {
                foo: 'bar'
            };
            var rr = rallyRequest({
                requestOptions: requestOptions
            });
            defaults.calledWith(requestOptions).should.eql(true);
            rr.httpRequest.should.be.exactly(defaults.firstCall.returnValue);
            defaults.restore();
        });
    });
});