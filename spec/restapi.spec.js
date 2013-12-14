var should = require('should'),
    restApi = require('../lib/restapi'),
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

    });
});