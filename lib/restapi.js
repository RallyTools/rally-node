/**
 @module RestApi

 This module presents a higher-level API for interacting with resources
 in the Rally REST API.
 */
var defaultServer = 'https://rally1.rallydev.com',
    defaultApiVersion = 'v2.0';

var _ = require('lodash'),
    refUtils = require('./util/ref'),
    queryUtils = require('./util/query'),
    format = require('util').format,
    Q = require('q'),
    pkgInfo = require('../package.json');


function optionsToRequestOptions(options) {
    var qs = {};
    if (options.scope) {
        if (options.scope.workspace) {
            qs.workspace = refUtils.getRelative(options.scope.workspace);
        }
        if (options.scope.project) {
            qs.project = refUtils.getRelative(options.scope.project);
            delete qs.workspace;
            if (options.scope.hasOwnProperty('up')) {
                qs.projectScopeUp = options.scope.up;
            }
            if (options.scope.hasOwnProperty('down')) {
                qs.projectScopeDown = options.scope.down;
            }
        }
    }
    if(_.isArray(options.fetch)) {
        qs.fetch = options.fetch.join(',');
    } else if(_.isString(options.fetch)) {
        qs.fetch = options.fetch;
    }

    return {
        qs: qs
    };
}

/**
 The Rally REST API client
 @constructor
 @param {object} options (optional) - optional config for the REST client
 - @member {string} server - server for the Rally API (default: https://rally1.rallydev.com)
 - @member {string} apiVersion - the Rally REST API version to use for requests (default: v2.0)
 - @member {string} userName||user - the username to use for requests (default: RALLY_USERNAME env variable)
 - @member {string} password||pass - the password to use for requests (default: RALLY_PASSWORD env variable)
 - @member {object} requestOptions - default options for the request: https://github.com/mikeal/request
 */
function RestApi(options) {
    options = _.merge({
        server: defaultServer,
        apiVersion: defaultApiVersion,
        requestOptions: {
            jar: true,
            json: true,
            auth: {
                user: process.env.RALLY_USERNAME || options.user || options.userName,
                pass: process.env.RALLY_PASSWORD || options.pass || options.password,
                sendImmediately: false
            },
            headers: {
                'X-RallyIntegrationLibrary': format('%s v%s', pkgInfo.description, pkgInfo.version),
                'X-RallyIntegrationName': pkgInfo.description,
                'X-RallyIntegrationVendor': 'Rally Software, Inc.',
                'X-RallyIntegrationVersion': pkgInfo.version
            }
        }
    }, options);

    var rallyRequest = require('./request');
    this.http = rallyRequest(options);
}

/**
 Create a new object
 @param {object} options - The create options (required)
 - @member {string} type - The type to be created, e.g. defect, hierarchicalrequirement, etc. (required)
 - @member {object} data - Key/value pairs of data with which to populate the new object (required)
 - @member {object} scope - the default scoping to use.  if not specified server default will be used.
 - @member {ref} scope.workspace - the workspace
 - @member {string/string[]} fetch - the fields to include on the returned record
 - @member {object} requestOptions - Additional options to be applied to the request: https://github.com/mikeal/request (optional)
 @param {function} callback - A callback to be called when the operation completes
 - @param {string[]} errors - Any errors which occurred
 - @param {object} result - the operation result
 @return {promise}
 */
RestApi.prototype.create = function(options, callback) {
    var postBody = {};
    postBody[options.type] = options.data;
    return this.http.post(_.merge({
        url: format('/%s/create', options.type),
        json: postBody
    }, options.requestOptions, optionsToRequestOptions(options)), callback);
};

/**
 Update an object
 @param {object} options - The update options (required)
 - @member {string} ref - The ref of the object to update, e.g. /defect/12345 (required)
 - @member {object} data - Key/value pairs of data with which to update object (required)
 - @member {object} scope - the default scoping to use.  if not specified server default will be used.
 - @member {ref} scope.workspace - the workspace
 - @member {string/string[]} fetch - the fields to include on the returned record
 - @member {object} requestOptions - Additional options to be applied to the request: https://github.com/mikeal/request (optional)
 @param {function} callback - A callback to be called when the operation completes
 - @param {string[]} errors - Any errors which occurred
 - @param {object} result - the operation result
 @return {promise}
 */
RestApi.prototype.update = function(options, callback) {
    var postBody = {};
    postBody[refUtils.getType(options.ref)] = options.data;
    return this.http.put(_.merge({
        url: refUtils.getRelative(options.ref),
        json: postBody
    }, options.requestOptions, optionsToRequestOptions(options)), callback);
};

/**
 Delete an object
 @param {object} options - The delete options (required)
 - @member {string} ref - The ref of the object to delete, e.g. /defect/1234
 - @member {object} scope - the default scoping to use.  if not specified server default will be used.
 - @member {ref} scope.workspace - the workspace
 - @member {object} requestOptions - Additional options to be applied to the request: https://github.com/mikeal/request (optional)
 @param {function} callback - A callback to be called when the operation completes
 - @param {string[]} errors - Any errors which occurred
 - @param {object} result - the operation result
 @return {promise}
 */
RestApi.prototype.delete = function(options, callback) {
    return this.http.delete(_.merge({
        url: refUtils.getRelative(options.ref)
    }, options.requestOptions, optionsToRequestOptions(options)), callback);
};

/**
 Get an object
 @param {object} options - The get options (required)
 - @member {string} ref - The ref of the object to get, e.g. /defect/12345 (required)
 - @member {object} scope - the default scoping to use.  if not specified server default will be used.
 - @member {ref} scope.workspace - the workspace
 - @member {string/string[]} fetch - the fields to include on the returned record
 - @member {object} requestOptions - Additional options to be applied to the request: https://github.com/mikeal/request (optional)
 @param {function} callback - A callback to be called when the operation completes
 - @param {string[]} errors - Any errors which occurred
 - @param {object} result - the operation result
 @return {promise}
 */
RestApi.prototype.get = function(options, callback) {
    var deferred = Q.defer();
    this.http.get(_.merge({
            url: refUtils.getRelative(options.ref)
        }, options.requestOptions,
            optionsToRequestOptions(options))).then(function(result) {
            deferred.resolve({
                Errors: result.Errors,
                Warnings: result.Warnings,
                Object: _.omit(result, ['Errors', 'Warnings'])
            });
        },
        function(error) {
            deferred.reject(error);
        });
    return deferred.promise.nodeify(callback);
};

/**
 Query for objects
 @param {object} options - The query options (required)
 - @member {string} ref - The ref of the collection to query, e.g. /defect/12345/tasks (required if type not specified)
 - @member {string} type - The type to query, e.g. defect, hierarchicalrequirement (required if ref not specified)
 - @member {object} scope - the default scoping to use.  if not specified server default will be used.
 - @member {ref} scope.workspace - the workspace
 - @member {ref} scope.project - the project, or null to include entire workspace
 - @member {ref} scope.up - true to include parent project data, false otherwise
 - @member {ref} scope.down - true to include child project data, false otherwise
 - @member {int} start - the 1 based start index
 - @member {int} pageSize - the page size, 1 - 200 (default=200)
 - @member {int} limit - the maximum number of records to return
 - @member {string/string[]} fetch - the fields to include on each returned record
 - @member {string/string[]} order - the order by which to sort the results
 - @member {string/query} query - a query to filter the result set
 - @member {object} requestOptions - Additional options to be applied to the request: https://github.com/mikeal/request (optional)
 @param {function} callback - A callback to be called when the operation completes
 - @param {string[]} errors - Any errors which occurred
 - @param {object} result - the operation result
 @return {promise}
 */
RestApi.prototype.query = function(options, callback) {
    var self = this;
    options = _.merge({
        start: 1,
        pageSize: 200
    }, options);

    var requestOptions = _.merge({
        url: refUtils.getRelative(options.ref) || format('/%s', options.type),
        qs: {
            start: options.start,
            pagesize: options.pageSize
        }
    }, options.requestOptions, optionsToRequestOptions(options));
    if(_.isArray(options.order)) {
        requestOptions.qs.order = options.order.join(',');
    } else if(options.order && _.isString(options.order)) {
        requestOptions.qs.order = options.order;
    }
    if(options.query) {
        requestOptions.qs.query = options.query.toQueryString && options.query.toQueryString() || options.query;
    }

    var deferred = Q.defer();
    var results = [];

    function loadRemainingPages(result) {
        results = results.concat(result.Results);
        if (result.StartIndex + options.pageSize <= Math.min((options.limit || options.pageSize), result.TotalResultCount)) {
            return self.http.get(_.merge(requestOptions, {
                qs: {
                    start: result.StartIndex + options.pageSize
                }
            }, requestOptions)).then(loadRemainingPages);
        } else {
            result.Results = results;
            result.StartIndex = options.start;
            result.PageSize = results.length;
            return result;
        }
    }

    this.http.get(requestOptions)
        .then(loadRemainingPages)
        .then(function(result) {
            deferred.resolve(result);
        })
        .fail(function(error) {
            deferred.reject(error); //this doesn't work :-( why is the error swallowed
        });

    return deferred.promise.nodeify(callback);
};

module.exports = RestApi;