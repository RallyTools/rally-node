var should = require('should'),
    rally = require('../lib/main');

describe('RestApi', function () {
    var restApi = new rally.RestApi();

    beforeEach(function() {

    });

    afterEach(function() {

    });

    it('should pass', function(){
        true.should.be.ok;
    });

    it('should fail', function() {
        false.should.be.ok;
    });
})