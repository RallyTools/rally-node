import should from 'should';
import RestApi from '../lib/restapi';
import * as Request from '../lib/request';
import { where } from '../lib/util/query';
import sinon from 'sinon';
import packageJson from '../package.json';

describe('RestApi', () => {
  let del, get, post, put;

  beforeEach(() => {
    get = sinon.stub(Request.default.prototype, 'get').returns(Promise.resolve({Errors: [], Warnings: [], Results: []}));
    put = sinon.stub(Request.default.prototype, 'put').returns(Promise.resolve({}));
    post = sinon.stub(Request.default.prototype, 'post').returns(Promise.resolve({}));
    del = sinon.stub(Request.default.prototype, 'del').returns(Promise.resolve({}));
  });

  afterEach(() => {
    get.restore();
    put.restore();
    post.restore();
    del.restore();
  });

  describe('#constructor', () => {

    beforeEach(() => {
      sinon.stub(Request, 'default');
    });

    afterEach(() => {
      Request.default.restore();
    });

    it('initializes request with default server and api version', () => {
      const restApi = new RestApi();
      const initArgs = Request.default.firstCall.args[0];
      initArgs.server.should.eql('https://rally1.rallydev.com');
      initArgs.apiVersion.should.eql('v2.0');
      restApi.request.should.be.exactly(Request.default.firstCall.returnValue);
    });

    it('initializes request with specified server and api version', () => {
      const restApi = new RestApi({
        server: 'http://www.google.com',
        apiVersion: 5
      });
      const initArgs = Request.default.firstCall.args[0];
      initArgs.server.should.eql('http://www.google.com');
      initArgs.apiVersion.should.eql(5);
      restApi.request.should.be.exactly(Request.default.firstCall.returnValue);
    });

    it('initializes request with default auth options', () => {
      process.env.RALLY_USERNAME = 'user';
      process.env.RALLY_PASSWORD = 'pass';
      const restApi = new RestApi();
      const requestOptions = Request.default.firstCall.args[0].requestOptions;
      requestOptions.auth.user.should.eql('user');
      requestOptions.auth.pass.should.eql('pass');
      restApi.request.should.be.exactly(Request.default.firstCall.returnValue);
    });

    it('initializes request with specified auth options', () => {
      const restApi = new RestApi({
        user: 'user1',
        pass: 'pass1'
      });
      const requestOptions = Request.default.firstCall.args[0].requestOptions;
      requestOptions.auth.user.should.eql('user1');
      requestOptions.auth.pass.should.eql('pass1');
      restApi.request.should.be.exactly(Request.default.firstCall.returnValue);
    });

    it('initializes request with correct integration headers', () => {
      const restApi = new RestApi();
      const initArgs = Request.default.firstCall.args[0];
      initArgs.requestOptions.headers.should.eql({
        'X-RallyIntegrationLibrary': `Rally REST Toolkit for Node.js v${packageJson.version}`,
        'X-RallyIntegrationName': 'Rally REST Toolkit for Node.js',
        'X-RallyIntegrationVendor': 'Rally Software, Inc.',
        'X-RallyIntegrationVersion': packageJson.version
      });
      restApi.request.should.be.exactly(Request.default.firstCall.returnValue);
    });

    it('initializes request with default api key options', () => {
      const key = '!#$!@#%161345!%1346@#$^#$';
      process.env.RALLY_API_KEY = key;
      const restApi = new RestApi();
      const requestOptions = Request.default.firstCall.args[0].requestOptions;
      requestOptions.headers.zsessionid.should.eql(key);
      requestOptions.jar.should.eql(false);
      restApi.request.should.be.exactly(Request.default.firstCall.returnValue);
    });

    it('initializes request with specified api key options', () => {
      const key = '!#$!@#%161345!%1346@#$^#$';
      const restApi = new RestApi({
        apiKey: key
      });
      const requestOptions = Request.default.firstCall.args[0].requestOptions;
      requestOptions.headers.zsessionid.should.eql(key);
      requestOptions.jar.should.eql(false);
      restApi.request.should.be.exactly(Request.default.firstCall.returnValue);
    });
  });

  describe('#create', () => {

    it('translates request options', async ( ) => {
      const restApi = new RestApi();
      await restApi.create({
        type: 'defect',
        data: {
          Name: 'A defect'
        },
        fetch: ['FormattedID'],
        scope: {workspace: '/workspace/1234'},
        requestOptions: {
          qs: {foo: 'bar'}
        }
      });

      post.callCount.should.eql(1);
      const args = post.firstCall.args[0];
      args.qs.fetch.should.eql('FormattedID');
      args.qs.workspace.should.eql('/workspace/1234');
      args.qs.foo.should.eql('bar');
       
    });

    it('generates correct post request', async ( ) => {
      const restApi = new RestApi();
      const callback = sinon.stub();
      const promise = restApi.create({
        type: 'defect',
        data: {
          Name: 'A defect'
        }
      }, callback);

      post.callCount.should.eql(1);
      const args = post.firstCall.args;
      args[0].url.should.eql('/defect/create');
      args[0].json.should.eql({defect: {Name: 'A defect'}});
      args[1].should.be.exactly(callback);
      post.firstCall.returnValue.should.be.exactly(promise);
      await promise;
       
    });
  });

  describe('#update', () => {

    it('translates request options', async ( ) => {
      const restApi = new RestApi();
      await restApi.update({
        ref: '/defect/1234',
        data: {
          Name: 'Updated defect'
        },
        fetch: ['FormattedID'],
        scope: {workspace: '/workspace/1234'},
        requestOptions: {
          qs: {foo: 'bar'}
        }
      });

      put.callCount.should.eql(1);
      const args = put.firstCall.args[0];
      args.qs.fetch.should.eql('FormattedID');
      args.qs.workspace.should.eql('/workspace/1234');
      args.qs.foo.should.eql('bar');
       
    });

    it('generates correct put request', async ( ) => {
      const restApi = new RestApi();
      const callback = sinon.stub();
      const promise = restApi.update({
        ref: {_ref: '/defect/1234'},
        data: {
          Name: 'Updated defect'
        }
      }, callback);

      put.callCount.should.eql(1);
      const args = put.firstCall.args;
      args[0].url.should.eql('/defect/1234');
      args[0].json.should.eql({defect: {Name: 'Updated defect'}});
      args[1].should.be.exactly(callback);
      put.firstCall.returnValue.should.be.exactly(promise);
      await promise;
       
    });
  });

  describe('#del', () => {

    it('translates request options', async ( ) => {
      const restApi = new RestApi();
      await restApi.del({
        ref: '/defect/1234',
        scope: {workspace: '/workspace/1234'},
        requestOptions: {
          qs: {foo: 'bar'}
        }
      });

      del.callCount.should.eql(1);
      const args = del.firstCall.args[0];
      args.qs.workspace.should.eql('/workspace/1234');
      args.qs.foo.should.eql('bar');
       
    });

    it('generates correct del request', async ( ) => {
      const restApi = new RestApi();
      const callback = sinon.stub();
      const promise = restApi.del({
        ref: {_ref: '/defect/1234'}
      }, callback);

      del.callCount.should.eql(1);
      const args = del.firstCall.args;
      args[0].url.should.eql('/defect/1234');
      args[1].should.be.exactly(callback);
      del.firstCall.returnValue.should.be.exactly(promise);
      await promise;
       
    });
  });

  describe('#get', () => {

    it('translates request options', async ( ) => {
      const restApi = new RestApi();
      await restApi.get({
        ref: '/defect/1234',
        scope: {workspace: '/workspace/1234'},
        fetch: ['FormattedID'],
        requestOptions: {
          qs: {foo: 'bar'}
        }
      });

      get.callCount.should.eql(1);
      const args = get.firstCall.args[0];
      args.qs.workspace.should.eql('/workspace/1234');
      args.qs.fetch.should.eql('FormattedID');
      args.qs.foo.should.eql('bar');
       
    });

    it('generates correct get request', async ( ) => {
      const restApi = new RestApi();
      const callback = sinon.stub();
      await restApi.get({
        ref: {_ref: '/defect/1234'}
      }, callback);

      get.callCount.should.eql(1);
      const args = get.firstCall.args;
      args[0].url.should.eql('/defect/1234');
      callback.callCount.should.eql(1);
       
    });

    it('calls back with transformed result', ( ) => {
      const restApi = new RestApi();
      get.returns(Promise.resolve({Errors: [], Warnings: [], Name: 'Foo'}));
      restApi.get({
        ref: {_ref: '/defect/1234'}
      }, (error, result) => {
        should.not.exist(error);
        result.Errors.should.eql([]);
        result.Warnings.should.eql([]);
        result.Object.should.eql({Name: 'Foo'});
         
      });
    });

    it('resolves promise with transformed result', async ( ) => {
      get.returns(Promise.resolve({Errors: [], Warnings: [], Name: 'Foo'}));
      const restApi = new RestApi();
      const result = await restApi.get({
        ref: {_ref: '/defect/1234'}
      });
      result.Errors.should.eql([]);
      result.Warnings.should.eql([]);
      result.Object.should.eql({Name: 'Foo'});
       
    });

    it('calls back with error', ( ) => {
        const error = 'Error!';
        const restApi = new RestApi();
        get.returns(Promise.reject([error]));
        restApi.get({
          ref: {_ref: '/defect/1234'}
        }, (err, result) => {
          err.should.eql([error]);
          should.not.exist(result);
           
        });
    });

    it('rejects promise with error', async ( ) => {
      const error = 'Error!';
      get.returns(Promise.reject([error]));
      const restApi = new RestApi();
      try {
        await restApi.get({
          ref: {_ref: '/defect/1234'}
        });
        fail('promise should be rejected');
      } catch (err) {
        err.should.eql([error]);
         
      }
    });
  });

  describe('#query', () => {

    it('translates workspace scope request options', async ( ) => {
      const restApi = new RestApi();
      await restApi.query({
        type: '/defect',
        scope: {workspace: '/workspace/1234'},
        fetch: ['FormattedID'],
        requestOptions: {
          qs: {foo: 'bar'}
        }
      });

      get.callCount.should.eql(1);
      const args = get.firstCall.args[0];
      args.qs.workspace.should.eql('/workspace/1234');
      args.qs.fetch.should.eql('FormattedID');
      args.qs.foo.should.eql('bar');
       
    });

    it('translates project scope request options', async ( ) => {
      const restApi = new RestApi();
      await restApi.query({
        type: '/defect',
        scope: {project: '/project/1234', up: false, down: true},
        fetch: ['FormattedID'],
        requestOptions: {
          qs: {foo: 'bar'}
        }
      });

      get.callCount.should.eql(1);
      const args = get.firstCall.args[0];
      args.qs.project.should.eql('/project/1234');
      args.qs.projectScopeUp.should.eql(false);
      args.qs.projectScopeDown.should.eql(true);
      args.qs.fetch.should.eql('FormattedID');
      args.qs.foo.should.eql('bar');
       
    });

    it('translates paging scope request options', async ( ) => {
      const restApi = new RestApi();
      await restApi.query({
        type: '/defect',
        start: 5,
        pageSize: 10,
        order: ['Severity', 'FormattedID DESC'],
        requestOptions: {
          qs: {foo: 'bar'}
        }
      });

      get.callCount.should.eql(1);
      const args = get.firstCall.args[0];
      args.qs.start.should.eql(5);
      args.qs.pagesize.should.eql(10);
      args.qs.order.should.eql('Severity,FormattedID DESC');
      args.qs.foo.should.eql('bar');
       
    });

    it('translates query request options', async ( ) => {
      const restApi = new RestApi();
      const query = where('State', '=', 'Submitted');
      await restApi.query({
        type: '/defect',
        query: query,
        requestOptions: {
          qs: {foo: 'bar'}
        }
      });

      get.callCount.should.eql(1);
      const args = get.firstCall.args[0];
      args.qs.query.should.eql(query.toQueryString());
      args.qs.foo.should.eql('bar');
       
    });

    it('generates correct get request by type', () => {
      const restApi = new RestApi();
      restApi.query({
        type: 'defect'
      });

      get.callCount.should.eql(1);
      const args = get.firstCall.args;
      args[0].url.should.eql('/defect');
    });

    it('generates correct get request by ref', () => {
      const restApi = new RestApi();
      restApi.query({
        ref: {_ref: '/defect/1234/tasks'}
      });

      get.callCount.should.eql(1);
      const args = get.firstCall.args;
      args[0].url.should.eql('/defect/1234/tasks');
    });

    it('calls back with results', ( ) => {
        const results = [
            {Name: 'Foo'}
        ];
        const restApi = new RestApi();
        get.returns(Promise.resolve({Errors: [], Warnings: [], StartIndex: 1, TotalResultCount: results.length, Results: results}));
        restApi.query({
          type: 'defect'
        }, (error, result) => {
          should.not.exist(error);
          result.Errors.should.eql([]);
          result.Warnings.should.eql([]);
          result.Results.should.eql(results);
           
        });
    });

    it('resolves promise with results', async ( ) => {
      const results = [
        {Name: 'Foo'}
      ];
      get.returns(Promise.resolve({Errors: [], Warnings: [], StartIndex: 1, TotalResultCount: results.length, Results: results}));
      const restApi = new RestApi();
      const onError = sinon.stub();
      const result = await restApi.query({
        type: 'defect'
      });
      onError.callCount.should.eql(0);
      result.Errors.should.eql([]);
      result.Warnings.should.eql([]);
      result.Results.should.eql(results);
       
    });

    it('calls back with error', function( ) {
      const error = 'Error!';
      const restApi = new RestApi();
      get.returns(Promise.reject([error]));
      restApi.query({
        type: 'defect'
      }, (err, result) => {
        err.should.eql([error]);
        should.not.exist(result);
         
      });
    });

    it('rejects promise with error', async ( ) => {
      const error = 'Error!';
      get.returns(Promise.reject([error]));
      const restApi = new RestApi();
      try {
        await restApi.query({
          type: 'defect'
        });
        fail('promise should be rejected');
      } catch (err) {
        err.should.eql([error]);
         
      }
    });

    describe('paging', () => {
      const results = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      beforeEach(() => {
        get.restore();
        sinon.stub(Request.default.prototype, 'get', (options) => {
          const start = options.qs.start;
          const pageSize = options.qs.pagesize;
          return Promise.resolve({Errors: [], Warnings: [], StartIndex: start, TotalResultCount: results.length, Results: results.slice(start - 1, start - 1 + pageSize)});
        });
      });
      afterEach(()=> {
        Request.default.prototype.get.restore();
      });

      it('should return 1 page if no limit specified', async ( ) => {
        const restApi = new RestApi();
        const result = await restApi.query({
          type: 'defect',
          start: 1,
          pageSize: 2
        });
        result.Results.should.eql([1, 2]);
         
      });

      it('should return multiple pages if limit specified', async ( ) => {
        const restApi = new RestApi();
        const result = await restApi.query({
          type: 'defect',
          start: 1,
          pageSize: 2,
          limit: 6
        });
        result.Results.should.eql([1, 2, 3, 4, 5, 6]);
         
      });

      it('should return no more than TotalResultCount', async ( ) => {
        const restApi = new RestApi();
        const result = await restApi.query({
          type: 'defect',
          start: 1,
          pageSize: 5,
          limit: 100
        });
        result.Results.should.eql(results);
         
      });

      it('should limit results to limit', async ( ) => {
        const restApi = new RestApi();
        const result = await restApi.query({
          type: 'defect',
          start: 1,
          pageSize: 100,
          limit: 4
        });
        result.Results.should.eql([1, 2, 3, 4]);
         
      });

      it('should limit paged results to limit', async ( ) => {
        const restApi = new RestApi();
        const result = await restApi.query({
          type: 'defect',
          start: 1,
          pageSize: 3,
          limit: 5
        });
        result.Results.should.eql([1, 2, 3, 4, 5]);
         
      });
    });

    describe('add', () => {
      it('translates request options', async ( ) => {
        const restApi = new RestApi();
        await restApi.add({
          ref: '/defect/1234',
          data: [{_ref: '/defect/2345'}],
          collection: 'Duplicates',
          scope: {workspace: '/workspace/1234'},
          fetch: ['FormattedID'],
          requestOptions: {
            qs: {foo: 'bar'}
          }
        });

        post.callCount.should.eql(1);
        const args = post.firstCall.args[0];
        args.qs.workspace.should.eql('/workspace/1234');
        args.qs.fetch.should.eql('FormattedID');
        args.qs.foo.should.eql('bar');
         
      });

      it('generates correct post request', async ( ) => {
        const restApi = new RestApi();
        await restApi.add({
          ref: '/defect/1234',
          data: [{_ref: '/defect/2345'}],
          collection: 'Duplicates'
        });

        post.callCount.should.eql(1);
        const args = post.firstCall.args;
        args[0].url.should.eql('/defect/1234/Duplicates/add');
        args[0].json.should.eql({CollectionItems: [{_ref: '/defect/2345'}]});
         
      });

      it('resolves promise with result', async ( ) => {
        post.returns(Promise.resolve({Errors: [], Warnings: [], Results: [{_ref: '/defect/2345'}]}));
        const restApi = new RestApi();
        const result = await restApi.add({
          ref: '/defect/1234',
          data: [{_ref: '/defect/2345'}],
          collection: 'Duplicates'
        });
        result.Errors.should.eql([]);
        result.Warnings.should.eql([]);
        result.Results.should.eql([{_ref: '/defect/2345'}]);
         
      });

      it('rejects promise with error', async ( ) => {
        const error = 'Error!';
        post.returns(Promise.reject([error]));
        const restApi = new RestApi();
        try {
          await restApi.add({
            ref: '/defect/1234',
            data: [{_ref: '/defect/2345'}],
            collection: 'Duplicates'
          });
          fail('promise should be rejected');
        } catch (err) {
          err.should.eql([error]);
           
        }
      });
    });

    describe('remove', () => {
      it('translates request options', () => {
        const restApi = new RestApi();
        restApi.remove({
          ref: '/defect/1234',
          data: [{_ref: '/defect/2345'}],
          collection: 'Duplicates',
          scope: {workspace: '/workspace/1234'},
          fetch: ['FormattedID'],
          requestOptions: {
            qs: {foo: 'bar'}
          }
        });

        post.callCount.should.eql(1);
        const args = post.firstCall.args[0];
        args.qs.workspace.should.eql('/workspace/1234');
        args.qs.fetch.should.eql('FormattedID');
        args.qs.foo.should.eql('bar');
      });

      it('generates correct post request', () => {
        const restApi = new RestApi();
        const callback = sinon.stub();
        restApi.remove({
          ref: '/defect/1234',
          data: [{_ref: '/defect/2345'}],
          collection: 'Duplicates'
        }, callback);

        post.callCount.should.eql(1);
        const args = post.firstCall.args;
        args[0].url.should.eql('/defect/1234/Duplicates/remove');
        args[0].json.should.eql({CollectionItems: [{_ref: '/defect/2345'}]});
      });

      it('resolves promise with result', async ( ) => {
        post.returns(Promise.resolve({Errors: [], Warnings: []}));
        const restApi = new RestApi();
        const result = await restApi.remove({
          ref: '/defect/1234',
          data: [{_ref: '/defect/2345'}],
          collection: 'Duplicates'
        });
        result.Errors.should.eql([]);
        result.Warnings.should.eql([]);
         
      });

      it('rejects promise with error', async ( ) => {
        const error = 'Error!';
        post.returns(Promise.reject([error]));
        const restApi = new RestApi();
        try {
          await restApi.remove({
            ref: '/defect/1234',
            data: [{_ref: '/defect/2345'}],
            collection: 'Duplicates'
          });
          fail('promise should be rejected');
        } catch (err) {
          err.should.eql([error]);
           
        }
      });
    });
  });
});
