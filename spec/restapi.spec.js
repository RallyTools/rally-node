var should = require('should'),
    RestApi = require('../lib/restapi'),
    request = require('../lib/request'),
    queryUtils = require('../lib/util/query'),
    sinon = require('sinon'),
    Q = require('q');

describe('RestApi', function() {

    beforeEach(function() {
        this.get = sinon.stub(request.Request.prototype, 'get').returns(Q());
        this.put = sinon.stub(request.Request.prototype, 'put').returns(Q());
        this.post = sinon.stub(request.Request.prototype, 'post').returns(Q());
        this.del = sinon.stub(request.Request.prototype, 'del').returns(Q());
    });

    afterEach(function() {
        this.get.restore();
        this.put.restore();
        this.post.restore();
        this.del.restore();
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
            requestOptions.auth.sendImmediately.should.eql(false);
            restApi.request.should.be.exactly(request.init.firstCall.returnValue);
        });

        it('initializes request with specified auth options', function() {
            var restApi = new RestApi({
                user: 'user1',
                pass: 'pass1'
            });
            var requestOptions = request.init.firstCall.args[0].requestOptions;
            requestOptions.jar.should.eql(true);
            requestOptions.auth.user.should.eql('user1');
            requestOptions.auth.pass.should.eql('pass1');
            requestOptions.auth.sendImmediately.should.eql(false);
            restApi.request.should.be.exactly(request.init.firstCall.returnValue);
        });

        it('initializes request with correct integration headers', function() {
            var restApi = new RestApi();
            var initArgs = request.init.firstCall.args[0];
            initArgs.requestOptions.headers.should.eql({
                'X-RallyIntegrationLibrary': 'Rally REST Toolkit for Node.js v0.2.0',
                'X-RallyIntegrationName': 'Rally REST Toolkit for Node.js',
                'X-RallyIntegrationVendor': 'Rally Software, Inc.',
                'X-RallyIntegrationVersion': '0.2.0'
            });
            restApi.request.should.be.exactly(request.init.firstCall.returnValue);
        });

        it('initializes request with default api key options', function() {
            var key = '!#$!@#%161345!%1346@#$^#$';
            process.env.RALLY_API_KEY = key;
            var restApi = new RestApi();
            var requestOptions = request.init.firstCall.args[0].requestOptions;
            requestOptions.headers.zsessionid.should.eql(key);
            requestOptions.jar.should.eql(false);
            restApi.request.should.be.exactly(request.init.firstCall.returnValue);
        });

        it('initializes request with specified api key options', function() {
            var key = '!#$!@#%161345!%1346@#$^#$';
            var restApi = new RestApi({
                apiKey: key
            });
            var requestOptions = request.init.firstCall.args[0].requestOptions;
            requestOptions.headers.zsessionid.should.eql(key);
            requestOptions.jar.should.eql(false);
            restApi.request.should.be.exactly(request.init.firstCall.returnValue);
        });
    });

    describe('#create', function() {

        it('translates request options', function() {
            var restApi = new RestApi();
            restApi.create({
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

            this.post.callCount.should.eql(1);
            var args = this.post.firstCall.args[0];
            args.qs.fetch.should.eql('FormattedID');
            args.qs.workspace.should.eql('/workspace/1234');
            args.qs.foo.should.eql('bar');
        });

        it('generates correct post request', function() {
            var restApi = new RestApi();
            var callback = sinon.stub();
            var promise = restApi.create({
                type: 'defect',
                data: {
                    Name: 'A defect'
                }
            }, callback);

            this.post.callCount.should.eql(1);
            var args = this.post.firstCall.args;
            args[0].url.should.eql('/defect/create');
            args[0].json.should.eql({defect: {Name: 'A defect'}});
            args[1].should.be.exactly(callback);
            this.post.firstCall.returnValue.should.be.exactly(promise);
        });
    });

    describe('#update', function() {

        it('translates request options', function() {
            var restApi = new RestApi();
            restApi.update({
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

            this.put.callCount.should.eql(1);
            var args = this.put.firstCall.args[0];
            args.qs.fetch.should.eql('FormattedID');
            args.qs.workspace.should.eql('/workspace/1234');
            args.qs.foo.should.eql('bar');
        });

        it('generates correct put request', function() {
            var restApi = new RestApi();
            var callback = sinon.stub();
            var promise = restApi.update({
                ref: {_ref: '/defect/1234'},
                data: {
                    Name: 'Updated defect'
                }
            }, callback);

            this.put.callCount.should.eql(1);
            var args = this.put.firstCall.args;
            args[0].url.should.eql('/defect/1234');
            args[0].json.should.eql({defect: {Name: 'Updated defect'}});
            args[1].should.be.exactly(callback);
            this.put.firstCall.returnValue.should.be.exactly(promise);
        });
    });

    describe('#del', function() {

        it('translates request options', function() {
            var restApi = new RestApi();
            restApi.del({
                ref: '/defect/1234',
                scope: {workspace: '/workspace/1234'},
                requestOptions: {
                    qs: {foo: 'bar'}
                }
            });

            this.del.callCount.should.eql(1);
            var args = this.del.firstCall.args[0];
            args.qs.workspace.should.eql('/workspace/1234');
            args.qs.foo.should.eql('bar');
        });

        it('generates correct del request', function() {
            var restApi = new RestApi();
            var callback = sinon.stub();
            var promise = restApi.del({
                ref: {_ref: '/defect/1234'}
            }, callback);

            this.del.callCount.should.eql(1);
            var args = this.del.firstCall.args;
            args[0].url.should.eql('/defect/1234');
            args[1].should.be.exactly(callback);
            this.del.firstCall.returnValue.should.be.exactly(promise);
        });
    });

    describe('#get', function() {

        it('translates request options', function() {
            var restApi = new RestApi();
            restApi.get({
                ref: '/defect/1234',
                scope: {workspace: '/workspace/1234'},
                fetch: ['FormattedID'],
                requestOptions: {
                    qs: {foo: 'bar'}
                }
            });

            this.get.callCount.should.eql(1);
            var args = this.get.firstCall.args[0];
            args.qs.workspace.should.eql('/workspace/1234');
            args.qs.fetch.should.eql('FormattedID');
            args.qs.foo.should.eql('bar');
        });

        it('generates correct get request', function() {
            var restApi = new RestApi();
            var callback = sinon.stub();
            restApi.get({
                ref: {_ref: '/defect/1234'}
            }, callback);

            this.get.callCount.should.eql(1);
            var args = this.get.firstCall.args;
            args[0].url.should.eql('/defect/1234');
        });

        it('calls back with transformed result', function(done) {
            this.get.yieldsAsync(null, {Errors: [], Warnings: [], Name: 'Foo'});
            var restApi = new RestApi();
            restApi.get({
                ref: {_ref: '/defect/1234'}
            }, function(error, result) {
                should.not.exist(error);
                result.Errors.should.eql([]);
                result.Warnings.should.eql([]);
                result.Object.should.eql({Name: 'Foo'});
                done();
            });
        });

        it('resolves promise with transformed result', function(done) {
            this.get.yieldsAsync(null, {Errors: [], Warnings: [], Name: 'Foo'});
            var restApi = new RestApi();
            var onError = sinon.stub();
            restApi.get({
                ref: {_ref: '/defect/1234'}
            }).then(function(result) {
                    onError.callCount.should.eql(0);
                    result.Errors.should.eql([]);
                    result.Warnings.should.eql([]);
                    result.Object.should.eql({Name: 'Foo'});
                    done();
                }, onError).done();
        });

        it('calls back with error', function(done) {
            var error = 'Error!';
            this.get.yieldsAsync([error], null);
            var restApi = new RestApi();
            restApi.get({
                ref: {_ref: '/defect/1234'}
            }, function(err, result) {
                err.should.eql([error]);
                should.not.exist(result);
                done();
            });
        });

        it('rejects promise with error', function(done) {
            var error = 'Error!';
            this.get.yieldsAsync([error], null);
            var restApi = new RestApi();
            var onSuccess = sinon.stub();
            restApi.get({
                ref: {_ref: '/defect/1234'}
            }).then(onSuccess, function(err) {
                    onSuccess.callCount.should.eql(0);
                    err.should.eql([error]);
                    done();
                }).done();
        });
    });

    describe('#query', function() {

        it('translates workspace scope request options', function() {
            var restApi = new RestApi();
            restApi.query({
                type: '/defect',
                scope: {workspace: '/workspace/1234'},
                fetch: ['FormattedID'],
                requestOptions: {
                    qs: {foo: 'bar'}
                }
            });

            this.get.callCount.should.eql(1);
            var args = this.get.firstCall.args[0];
            args.qs.workspace.should.eql('/workspace/1234');
            args.qs.fetch.should.eql('FormattedID');
            args.qs.foo.should.eql('bar');
        });

        it('translates project scope request options', function() {
            var restApi = new RestApi();
            restApi.query({
                type: '/defect',
                scope: {project: '/project/1234', up: false, down: true},
                fetch: ['FormattedID'],
                requestOptions: {
                    qs: {foo: 'bar'}
                }
            });

            this.get.callCount.should.eql(1);
            var args = this.get.firstCall.args[0];
            args.qs.project.should.eql('/project/1234');
            args.qs.projectScopeUp.should.eql(false);
            args.qs.projectScopeDown.should.eql(true);
            args.qs.fetch.should.eql('FormattedID');
            args.qs.foo.should.eql('bar');
        });

        it('translates paging scope request options', function() {
            var restApi = new RestApi();
            restApi.query({
                type: '/defect',
                start: 5,
                pageSize: 10,
                order: ['Severity', 'FormattedID DESC'],
                requestOptions: {
                    qs: {foo: 'bar'}
                }
            });

            this.get.callCount.should.eql(1);
            var args = this.get.firstCall.args[0];
            args.qs.start.should.eql(5);
            args.qs.pagesize.should.eql(10);
            args.qs.order.should.eql('Severity,FormattedID DESC');
            args.qs.foo.should.eql('bar');
        });

        it('translates query request options', function() {
            var restApi = new RestApi();
            var query = queryUtils.where('State', '=', 'Submitted');
            restApi.query({
                type: '/defect',
                query: query,
                requestOptions: {
                    qs: {foo: 'bar'}
                }
            });

            this.get.callCount.should.eql(1);
            var args = this.get.firstCall.args[0];
            args.qs.query.should.eql(query.toQueryString());
            args.qs.foo.should.eql('bar');
        });

        it('generates correct get request by type', function() {
            var restApi = new RestApi();
            restApi.query({
                type: 'defect'
            });

            this.get.callCount.should.eql(1);
            var args = this.get.firstCall.args;
            args[0].url.should.eql('/defect');
        });

        it('generates correct get request by ref', function() {
            var restApi = new RestApi();
            restApi.query({
                ref: {_ref: '/defect/1234/tasks'}
            });

            this.get.callCount.should.eql(1);
            var args = this.get.firstCall.args;
            args[0].url.should.eql('/defect/1234/tasks');
        });

        it('calls back with results', function(done) {
            var results = [
                {Name: 'Foo'}
            ];
            this.get.returns(Q.resolve({Errors: [], Warnings: [], StartIndex: 1, TotalResultCount: results.length, Results: results}));
            var restApi = new RestApi();
            restApi.query({
                type: 'defect'
            }, function(error, result) {
                should.not.exist(error);
                result.Errors.should.eql([]);
                result.Warnings.should.eql([]);
                result.Results.should.eql(results);
                done();
            });
        });

        it('resolves promise with results', function(done) {
            var results = [
                {Name: 'Foo'}
            ];
            this.get.returns(Q.resolve({Errors: [], Warnings: [], StartIndex: 1, TotalResultCount: results.length, Results: results}));
            var restApi = new RestApi();
            var onError = sinon.stub();
            restApi.query({
                type: 'defect'
            }).then(function(result) {
                    onError.callCount.should.eql(0);
                    result.Errors.should.eql([]);
                    result.Warnings.should.eql([]);
                    result.Results.should.eql(results);
                    done();
                }, onError).done();
        });

        it('calls back with error', function(done) {
            var error = 'Error!';
            this.get.returns(Q.reject([error]));
            var restApi = new RestApi();
            restApi.query({
                type: 'defect'
            }, function(err, result) {
                err.should.eql([error]);
                should.not.exist(result);
                done();
            });
        });

        it('rejects promise with error', function(done) {
            var error = 'Error!';
            this.get.returns(Q.reject([error]));
            var onSuccess = sinon.stub();
            var restApi = new RestApi();
            restApi.query({
                type: 'defect'
            }).then(onSuccess, function(err) {
                    onSuccess.callCount.should.eql(0);
                    err.should.eql([error]);
                    done();
                }).done();
        });

        describe('paging', function() {
            var results = [];
            for (var i = 0; i < 10; i++) {
                results.push(i + 1);
            }
            beforeEach(function() {
                this.get.restore();
                sinon.stub(request.Request.prototype, 'get', function(options) {
                    var start = options.qs.start,
                        pageSize = options.qs.pagesize;
                    return Q({Errors: [], Warnings: [], StartIndex: start, TotalResultCount: results.length, Results: results.slice(start - 1, start - 1 + pageSize)});
                });
            });
            afterEach(function(){
                request.Request.prototype.get.restore();
            });

            it('should return 1 page if no limit specified', function(done) {
                var restApi = new RestApi();
                restApi.query({
                    type: 'defect',
                    start: 1,
                    pageSize: 2
                }).then(function(result) {
                        result.Results.should.eql([1, 2]);
                        done();
                    }).done();
            });

            it('should return multiple pages if limit specified', function(done) {
                var restApi = new RestApi();
                restApi.query({
                    type: 'defect',
                    start: 1,
                    pageSize: 2,
                    limit: 6
                }).then(function(result) {
                        result.Results.should.eql([1, 2, 3, 4, 5, 6]);
                        done();
                    }).done();
            });

            it('should call progress function for each page of multiple page call', function(done) {
                var restApi = new RestApi();
                var pagesReturned = 0;
                restApi.query({
                    type: 'defect',
                    start: 1,
                    pageSize: 2,
                    limit: 6
                }).progress(function(page){
                      pagesReturned++;
                }).done(function(){
                      (pagesReturned).should.be.exactly(3);
                      done();
                    });
            });

            it('should return no more than TotalResultCount', function(done) {
                var restApi = new RestApi();
                restApi.query({
                    type: 'defect',
                    start: 1,
                    pageSize: 5,
                    limit: 100
                }).then(function(result) {
                        result.Results.should.eql(results);
                        done();
                    }).done();
            });

            it('should limit results to limit', function(done) {
                var restApi = new RestApi();
                restApi.query({
                    type: 'defect',
                    start: 1,
                    pageSize: 100,
                    limit: 4
                }).then(function(result) {
                        result.Results.should.eql([1, 2, 3, 4]);
                        done();
                    }).done();
            });

            it('should limit paged results to limit', function(done) {
                var restApi = new RestApi();
                restApi.query({
                    type: 'defect',
                    start: 1,
                    pageSize: 3,
                    limit: 5
                }).then(function(result) {
                        result.Results.should.eql([1, 2, 3, 4, 5]);
                        done();
                    }).done();
            });
        });

        describe('add', function() {
            it('translates request options', function() {
                var restApi = new RestApi();
                restApi.add({
                    ref: '/defect/1234',
                    data: [{_ref: '/defect/2345'}],
                    collection: 'Duplicates',
                    scope: {workspace: '/workspace/1234'},
                    fetch: ['FormattedID'],
                    requestOptions: {
                        qs: {foo: 'bar'}
                    }
                });

                this.post.callCount.should.eql(1);
                var args = this.post.firstCall.args[0];
                args.qs.workspace.should.eql('/workspace/1234');
                args.qs.fetch.should.eql('FormattedID');
                args.qs.foo.should.eql('bar');
            });

            it('generates correct post request', function() {
                var restApi = new RestApi();
                var callback = sinon.stub();
                restApi.add({
                    ref: '/defect/1234',
                    data: [{_ref: '/defect/2345'}],
                    collection: 'Duplicates'
                }, callback);

                this.post.callCount.should.eql(1);
                var args = this.post.firstCall.args;
                args[0].url.should.eql('/defect/1234/Duplicates/add');
                args[0].json.should.eql({CollectionItems: [{_ref: '/defect/2345'}]});
            });

            it('calls back with result', function(done) {
                this.post.yieldsAsync(null, {Errors: [], Warnings: [], Results: [{_ref: '/defect/2345'}]});
                var restApi = new RestApi();
                restApi.add({
                    ref: '/defect/1234',
                    data: [{_ref: '/defect/2345'}],
                    collection: 'Duplicates'
                }, function(error, result) {
                    should.not.exist(error);
                    result.Errors.should.eql([]);
                    result.Warnings.should.eql([]);
                    result.Results.should.eql([{_ref: '/defect/2345'}]);
                    done();
                });
            });

            it('resolves promise with result', function(done) {
                this.post.yieldsAsync(null, {Errors: [], Warnings: [], Results: [{_ref: '/defect/2345'}]});
                var restApi = new RestApi();
                var onError = sinon.stub();
                restApi.add({
                    ref: '/defect/1234',
                    data: [{_ref: '/defect/2345'}],
                    collection: 'Duplicates'
                }).then(function(result) {
                    onError.callCount.should.eql(0);
                    result.Errors.should.eql([]);
                    result.Warnings.should.eql([]);
                    result.Results.should.eql([{_ref: '/defect/2345'}]);
                    done();
                }, onError).done();
            });

            it('calls back with error', function(done) {
                var error = 'Error!';
                this.post.yieldsAsync([error], null);
                var restApi = new RestApi();
                restApi.add({
                    ref: '/defect/1234',
                    data: [{_ref: '/defect/2345'}],
                    collection: 'Duplicates'
                }, function(err, result) {
                    err.should.eql([error]);
                    should.not.exist(result);
                    done();
                });
            });

            it('rejects promise with error', function(done) {
                var error = 'Error!';
                this.post.yieldsAsync([error], null);
                var restApi = new RestApi();
                var onSuccess = sinon.stub();
                restApi.add({
                    ref: '/defect/1234',
                    data: [{_ref: '/defect/2345'}],
                    collection: 'Duplicates'
                }).then(onSuccess, function(err) {
                    onSuccess.callCount.should.eql(0);
                    err.should.eql([error]);
                    done();
                }).done();
            });
        });

        describe('remove', function() {
            it('translates request options', function() {
                var restApi = new RestApi();
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

                this.post.callCount.should.eql(1);
                var args = this.post.firstCall.args[0];
                args.qs.workspace.should.eql('/workspace/1234');
                args.qs.fetch.should.eql('FormattedID');
                args.qs.foo.should.eql('bar');
            });

            it('generates correct post request', function() {
                var restApi = new RestApi();
                var callback = sinon.stub();
                restApi.remove({
                    ref: '/defect/1234',
                    data: [{_ref: '/defect/2345'}],
                    collection: 'Duplicates'
                }, callback);

                this.post.callCount.should.eql(1);
                var args = this.post.firstCall.args;
                args[0].url.should.eql('/defect/1234/Duplicates/remove');
                args[0].json.should.eql({CollectionItems: [{_ref: '/defect/2345'}]});
            });

            it('calls back with result', function(done) {
                this.post.yieldsAsync(null, {Errors: [], Warnings: []});
                var restApi = new RestApi();
                restApi.remove({
                    ref: '/defect/1234',
                    data: [{_ref: '/defect/2345'}],
                    collection: 'Duplicates'
                }, function(error, result) {
                    should.not.exist(error);
                    result.Errors.should.eql([]);
                    result.Warnings.should.eql([]);
                    done();
                });
            });

            it('resolves promise with result', function(done) {
                this.post.yieldsAsync(null, {Errors: [], Warnings: []});
                var restApi = new RestApi();
                var onError = sinon.stub();
                restApi.remove({
                    ref: '/defect/1234',
                    data: [{_ref: '/defect/2345'}],
                    collection: 'Duplicates'
                }).then(function(result) {
                    onError.callCount.should.eql(0);
                    result.Errors.should.eql([]);
                    result.Warnings.should.eql([]);
                    done();
                }, onError).done();
            });

            it('calls back with error', function(done) {
                var error = 'Error!';
                this.post.yieldsAsync([error], null);
                var restApi = new RestApi();
                restApi.remove({
                    ref: '/defect/1234',
                    data: [{_ref: '/defect/2345'}],
                    collection: 'Duplicates'
                }, function(err, result) {
                    err.should.eql([error]);
                    should.not.exist(result);
                    done();
                });
            });

            it('rejects promise with error', function(done) {
                var error = 'Error!';
                this.post.yieldsAsync([error], null);
                var restApi = new RestApi();
                var onSuccess = sinon.stub();
                restApi.remove({
                    ref: '/defect/1234',
                    data: [{_ref: '/defect/2345'}],
                    collection: 'Duplicates'
                }).then(onSuccess, function(err) {
                    onSuccess.callCount.should.eql(0);
                    err.should.eql([error]);
                    done();
                }).done();
            });
        });
    });
});
