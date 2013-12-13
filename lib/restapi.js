/**
 @module RestApi

 This module presents a higher-level API for interacting with resources
 in the Rally REST API.
 */
var defaultServer = 'https://rally1.rallydev.com',
    defaultApiVersion = 'v2.0';

var _ = require('lodash'),
    refUtils = require('./util/ref'),
    format = require('util').format,
    Q = require('q');
Q.longStackSupport = true;

/**
 The Rally REST API client
 @constructor
 @param {object} options (optional) - optional config for the REST client
 - @member {string} server - server for the Rally API (default: https://rally1.rallydev.com)
 - @member {string} apiVersion - the Rally REST API version to use for requests (default: v2.0)
 - @member {string} userName - the username to use for requests (default: RALLY_USERNAME env variable)
 - @member {string} password - the password to use for requests (default: RALLY_PASSWORD env variable)
 - @member {object} requestOptions - default options for the request: https://github.com/mikeal/request
 */
function RestApi(options) {
    options = _.merge({
        server: defaultServer,
        apiVersion: defaultApiVersion,
        requestOptions: {//todo: headers
            jar: true,
            json: true,
            auth: {
                user: process.env.RALLY_USERNAME,
                pass: process.env.RALLY_PASSWORD,
                sendImmediately: false
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
 - @member {object} requestOptions - Additional options to be applied to the request: https://github.com/mikeal/request (optional)
 @param {function} callback - A callback to be called when the operation completes
 - @param {string[]} errors - Any errors which occurred
 - @param {object} result - the operation result
 @return {promise}
 */
RestApi.prototype.create = function (options, callback) {
    var postBody = {};
    postBody[options.type] = options.data;
    return this.http.post(_.extend({
        url: format('/%s/create', options.type),
        json: postBody
    }, options.requestOptions), callback);
};

/**
 Update an object
 @param {object} options - The update options (required)
 - @member {string} ref - The ref of the object to update, e.g. /defect/12345 (required)
 - @member {object} data - Key/value pairs of data with which to update object (required)
 - @member {object} requestOptions - Additional options to be applied to the request: https://github.com/mikeal/request (optional)
 @param {function} callback - A callback to be called when the operation completes
 - @param {string[]} errors - Any errors which occurred
 - @param {object} result - the operation result
 @return {promise}
 */
RestApi.prototype.update = function (options, callback) {
    var postBody = {};
    postBody[refUtils.getType(options.ref)] = options.data; //todo dynatype?
    return this.http.put(_.extend({
        url: refUtils.getRelative(options.ref),
        json: postBody
    }, options.requestOptions), callback);
};

/**
 Delete an object
 @param {object} options - The delete options (required)
 - @member {string} ref - The ref of the object to delete, e.g. /defect/1234
 - @member {object} requestOptions - Additional options to be applied to the request: https://github.com/mikeal/request (optional)
 @param {function} callback - A callback to be called when the operation completes
 - @param {string[]} errors - Any errors which occurred
 - @param {object} result - the operation result
 @return {promise}
 */
RestApi.prototype.delete = function (options, callback) {
    return this.http.delete(_.extend({
        url: refUtils.getRelative(options.ref)
    }, options.requestOptions), callback);
};

/**
 Get an object
 @param {object} options - The get options (required)
 - @member {string} ref - The ref of the object to get, e.g. /defect/12345 (required)
 - @member {object} requestOptions - Additional options to be applied to the request: https://github.com/mikeal/request (optional)
 @param {function} callback - A callback to be called when the operation completes
 - @param {string[]} errors - Any errors which occurred
 - @param {object} result - the operation result
 @return {promise}
 */
RestApi.prototype.get = function (options, callback) {
    var deferred = Q.defer();
    this.http.get(_.extend({
            url: options.ref
        }, options.requestOptions)).then(function (result) {
            deferred.resolve({
                Errors: result.Errors,
                Warnings: result.Warnings,
                Object: _.omit(result, ['Errors', 'Warnings'])
            });
        },
        function (error) {
            deferred.reject(error);
        });
    return deferred.promise.nodeify(callback);
};

/**
 Query for objects
 @param {object} options - The query options (required)
 - @member {string} ref - The ref of the collection to query, e.g. /defect/12345/tasks (required if type not specified)
 - @member {string} type - The type to query, e.g. defect, hierarchicalrequirement (required if ref not specified)
 - @member {object} requestOptions - Additional options to be applied to the request: https://github.com/mikeal/request (optional)
 @param {function} callback - A callback to be called when the operation completes
 - @param {string[]} errors - Any errors which occurred
 - @param {object} result - the operation result
 @return {promise}
 */
RestApi.prototype.query = function (options, callback) {
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
    }, options.requestOptions);

    var deferred = Q.defer();
    var pageFuncs = [];
    this.http.get(requestOptions).then(function (result) {
            var results = [];
            for (var start = options.start + options.pageSize; start <= Math.min((options.limit || options.pageSize), result.TotalResultCount); start += options.pageSize) {
                pageFuncs.push(function (pageResult) {
                    results = results.concat(pageResult.Results);
                    return self.http.get(_.merge(requestOptions, {
                        qs: {
                            start: pageResult.StartIndex + options.pageSize
                        }
                    }, requestOptions));
                });
            }
            pageFuncs.push(function (lastResult) {
                result.Results = results.concat(lastResult.Results);
                result.PageSize = result.Results.length;
                deferred.resolve(result);
            });
            pageFuncs.reduce(Q.when, Q(result)).fail(function (error) {
                //deferred.reject(error); why doesn't this work?
            });
        },
        function (error) {
            deferred.reject(error);
        });
    return deferred.promise.nodeify(callback);
};

module.exports = RestApi;