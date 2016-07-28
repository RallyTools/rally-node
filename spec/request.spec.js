import should from 'should';
import Request from '../lib/request';
import request from 'request';
import sinon from 'sinon';
import _ from 'lodash';

describe('Request', () => {
  let del, get, post, put;

  beforeEach(() => {
    get = sinon.stub(request, 'get');
    put = sinon.stub(request, 'put');
    post = sinon.stub(request, 'post');
    del = sinon.stub(request, 'del');
  });

  afterEach(() => {
    get.restore();
    put.restore();
    post.restore();
    del.restore();
  });

  const createRequest = (options) => {
    return new Request(_.extend({
      server: 'https://rally1.rallydev.com',
      apiVersion: 'v2.0'
    }, options));
  };

  describe('#constructor', () => {

    it('should initialize the wsapi url correctly', () => {
      createRequest({
        server: 'http://www.acme.com',
        apiVersion: 'v3.0'
      }).wsapiUrl.should.eql('http://www.acme.com/slm/webservice/v3.0');
    });

    it('should pass request options through', () => {
      const defaults = sinon.spy(request, 'defaults');
      const requestOptions = {
        foo: 'bar'
      };
      createRequest({
        requestOptions: requestOptions
      }).httpRequest.should.be.exactly(defaults.firstCall.returnValue);
      defaults.calledWith({ jar: request.jar(), ...requestOptions }).should.eql(true);
      defaults.restore();
    });
  });

  describe('#doRequest', () => {

    it('calls the correct request method', () => {
      const rr = createRequest();
      rr.doRequest('get', {foo: 'bar', url: '/someUrl'});
      get.calledOnce.should.eql(true);
      const args = get.firstCall.args[0];
      args.url.should.eql(rr.wsapiUrl + '/someUrl');
      args.foo.should.eql('bar');
    });

    it('calls back with an error', (done) => {
      const rr = createRequest();
      const error = 'Error!';
      get.yieldsAsync(error);
      rr.doRequest('get', {url: '/someUrl'}, (err, body) => {
        err.errors.should.eql([error]);
        should.not.exist(body);
        done();
      });
    });

    it('rejects the promise with an error', async (done) => {
      const rr = createRequest();
      const error = 'Error!';
      get.yieldsAsync(error);
      try {
        await rr.doRequest('get', {url: '/someUrl'});
        fail('expected promise to be rejected');
      } catch (err) {
        err.errors.should.eql([error]);
        done();
      }
    });

    it('calls back with error with an empty response', (done) => {
        const rr = createRequest();
        get.yieldsAsync(null, null);
        rr.doRequest('get', {url: '/someUrl'}, (err, body) => {
          err.errors.should.eql(['Unable to connect to server: ' + rr.wsapiUrl]);
          should.not.exist(body);
          done();
        });
      });

    it('rejects the promise with an empty response', async (done) => {
      const rr = createRequest();
      get.yieldsAsync(null, null);
      try {
        await rr.doRequest('get', {url: '/someUrl'});
        fail('expected promise to be rejected');
      } catch (err) {
        err.errors.should.eql(['Unable to connect to server: ' + rr.wsapiUrl]);
        done();
      }
    });

    it('calls back with error with a non json response', (done) => {
      const rr = createRequest();
      get.yieldsAsync(null, {statusCode: 404}, 'not found!');
      rr.doRequest('get', {url: '/someUrl'}, (err, body) => {
        err.errors.should.eql(['/someUrl: 404! body=not found!']);
        should.not.exist(body);
        done();
      });
    });

    it('rejects the promise with a non json response', async (done) => {
      const rr = createRequest();
      get.yieldsAsync(null, {statusCode: 404}, 'not found!');
      try {
        await rr.doRequest('get', {url: '/someUrl'});
        fail('expected promise to be rejected');
      } catch (err) {
        err.errors.should.eql(['/someUrl: 404! body=not found!']);
        done();
      }
    });

    it('rejects the promise with an error on a successful response', async (done) => {
      const rr = createRequest();
      const error = 'Error!';
      const responseBody = {Result: {foo: 'bar', Errors: [error], Warnings: []}};
      get.yieldsAsync(null, {}, responseBody);
      try {
        await rr.doRequest('get', {url: '/someUrl'});
        fail('expected promise to be rejected');
      } catch (err) {
        err.errors.should.eql([error]);
        done();
      }
    });

    it('calls back with a success', (done) => {
      const rr = createRequest();
      const responseBody = {Result: {foo: 'bar', Errors: [], Warnings: []}};
      get.yieldsAsync(null, {}, responseBody);
      rr.doRequest('get', {url: '/someUrl'}, (err, body) => {
        should.not.exist(err);
        body.should.eql(responseBody.Result);
        done();
      });
    });

    it('resolves the promise with a success', async (done) => {
      const rr = createRequest();
      const responseBody = {Result: {foo: 'bar', Errors: [], Warnings: []}};
      get.yieldsAsync(null, {}, responseBody);
      const result = await rr.doRequest('get', {url: '/someUrl'});
      result.should.eql(responseBody.Result);
      done();
    });
  });

  describe('#doSecuredRequest', () => {

    it('does not request a security token if api key specified', () => {
      const rr = createRequest({
        requestOptions: {
          headers: {
            zsessionid: '!#$%!@#$@!#'
          }
        }
      });
      rr.doSecuredRequest('put', {foo: 'bar'});
      get.callCount.should.eql(0);
    });

    it('requests a security token', () => {
      const rr = createRequest();
      rr.doSecuredRequest('put', {foo: 'bar'});
      get.callCount.should.eql(1);
      get.firstCall.args[0].url.should.eql(rr.wsapiUrl + '/security/authorize');
    });

    it('passes along the security token to doRequest and calls back on success', (done) => {
      const rr = createRequest();
      const token = 'a secret token';
      const putResponseBody = {OperationResult: {Errors: [], Warnings: [], Object: {}}};
      get.yieldsAsync(null, {}, {OperationResult: {Errors: [], Warnings: [], SecurityToken: token}});
      put.yieldsAsync(null, {}, putResponseBody);
      rr.doSecuredRequest('put', {foo: 'bar'}, (error, result) => {
        put.callCount.should.eql(1);
        put.firstCall.args[0].foo.should.eql('bar');
        put.firstCall.args[0].qs.key.should.eql(token);
        putResponseBody.OperationResult.should.eql(result);
        should.not.exist(error);
        done();
      });
    });

    it('passes along the security token to doRequest and resolves the promise on success', async (done) => {
      const rr = createRequest();
      const token = 'a secret token';
      const putResponseBody = {OperationResult: {Errors: [], Warnings: [], Object: {}}};
      get.yieldsAsync(null, {}, {OperationResult: {Errors: [], Warnings: [], SecurityToken: token}});
      put.yieldsAsync(null, {}, putResponseBody);
      const result = await rr.doSecuredRequest('put', {foo: 'bar'});
      put.callCount.should.eql(1);
      put.firstCall.args[0].foo.should.eql('bar');
      put.firstCall.args[0].qs.key.should.eql(token);
      putResponseBody.OperationResult.should.eql(result);
      done();
    });

    it('calls back with error on security token failure', function(done) {
      const rr = createRequest();
      const error = 'Some key error';
      get.yieldsAsync(null, {}, {OperationResult: {Errors: [error]}});
      rr.doSecuredRequest('put', {}, function(err, result) {
        err.errors.should.eql([error]);
        should.not.exist(result);
        done();
      });
    });

    it('rejects the promise on security token failure', async (done) => {
      const rr = createRequest();
      const error = 'Some key error';
      get.yieldsAsync(null, {}, {OperationResult: {Errors: [error]}});
      try {
        await rr.doSecuredRequest('put', {});
      } catch (err) {
        err.errors.should.eql([error]);
        done();
      }
    });

    it('rejects the promise on request failure', async (done) => {
      const rr = createRequest();
      const error = 'An error';
      const putResponseBody = {OperationResult: {Errors: [error]}};
      get.yieldsAsync(null, {}, {OperationResult: {Errors: [], Warnings: [], SecurityToken: 'foo'}});
      put.yieldsAsync(null, {}, putResponseBody);
      try {
        await rr.doSecuredRequest('put', {});
        fail('promise should be rejected');
      } catch (err) {
        err.errors.should.eql([error]);
      }
      done();
    });

    it('calls back with error on request failure after getting security token', function(done) {
      const rr = createRequest();
      const error = 'An error';
      const putResponseBody = {OperationResult: {Errors: [error]}};
      get.yieldsAsync(null, {}, {OperationResult: {Errors: [], Warnings: [], SecurityToken: 'foo'}});
      put.yieldsAsync(null, {}, putResponseBody);
      rr.doSecuredRequest('put', {}, function(err, result) {
        err.errors.should.eql([error]);
        should.not.exist(result);
        done();
      });
    });
  });

  describe('#httpMethods', () => {
    let doRequest, doSecuredRequest;

    beforeEach(() => {
      doRequest = sinon.spy(Request.prototype, 'doRequest');
      doSecuredRequest = sinon.spy(Request.prototype, 'doSecuredRequest');
    });

    afterEach(() => {
      doRequest.restore();
      doSecuredRequest.restore();
    });

    it('should get with callback', function() {
      const rr = createRequest();

      const options = {foo: 'bar'};
      const callback = sinon.stub();
      rr.get(options, callback);

      doRequest.callCount.should.eql(1);
      doRequest.firstCall.args.should.eql(['get', options, callback]);
      doSecuredRequest.callCount.should.eql(0);
    });

    it('should get with promise', () => {
      const rr = createRequest();

      const options = {foo: 'bar'};
      const returnValue = rr.get(options);

      doRequest.callCount.should.eql(1);
      doRequest.firstCall.args.should.eql(['get', options, undefined]);
      doRequest.firstCall.returnValue.should.be.exactly(returnValue);
      doSecuredRequest.callCount.should.eql(0);
    });

    it('should post with callback', function() {
      const rr = createRequest();

      const options = {foo: 'bar'};
      const callback = sinon.stub();
      rr.post(options, callback);

      doSecuredRequest.callCount.should.eql(1);
      doSecuredRequest.firstCall.args.should.eql(['post', options, callback]);
    });

    it('should post with promise', () => {
      const rr = createRequest();

      const options = {foo: 'bar'};
      const returnValue = rr.post(options);

      doSecuredRequest.callCount.should.eql(1);
      doSecuredRequest.firstCall.args.should.eql(['post', options, undefined]);
      doSecuredRequest.firstCall.returnValue.should.be.exactly(returnValue);
    });

    it('should put with callback', function() {
      const rr = createRequest();

      const options = {foo: 'bar'};
      const callback = sinon.stub();
      rr.put(options, callback);

      doSecuredRequest.callCount.should.eql(1);
      doSecuredRequest.firstCall.args.should.eql(['put', options, callback]);
    });

    it('should put with promise', () => {
      const rr = createRequest();

      const options = {foo: 'bar'};
      const returnValue = rr.put(options);

      doSecuredRequest.callCount.should.eql(1);
      doSecuredRequest.firstCall.args.should.eql(['put', options, undefined]);
      doSecuredRequest.firstCall.returnValue.should.be.exactly(returnValue);
    });

    it('should delete with callback', function() {
      const rr = createRequest();

      const options = {foo: 'bar'};
      const callback = sinon.stub();
      rr.del(options, callback);

      doSecuredRequest.callCount.should.eql(1);
      doSecuredRequest.firstCall.args.should.eql(['del', options, callback]);
    });

    it('should delete with promise', () => {
      const rr = createRequest();

      const options = {foo: 'bar'};
      const returnValue = rr.del(options);

      doSecuredRequest.callCount.should.eql(1);
      doSecuredRequest.firstCall.args.should.eql(['del', options, undefined]);
      doSecuredRequest.firstCall.returnValue.should.be.exactly(returnValue);
    });
  });
});
