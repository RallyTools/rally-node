/**
 @module RestApi

 This module presents a higher-level API for interacting with resources
 in the Rally REST API.
 */
var defaultServer = 'https://rally1.rallydev.com',
    defaultApiVersion = 'v2.0';

var request = require('request'),
    Q = require('q'),
    _ = require('lodash'),
    Ref = require('./Ref'),
    format = require('util').format;

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
        requestOptions: {
            jar: true,
            json: true,
            auth: {
                user: process.env.RALLY_USERNAME,
                pass: process.env.RALLY_PASSWORD,
                sendImmediately: false
            }
        }
    }, options);

    this.request = request.defaults(options.requestOptions);
    this.server = options.server;
    this.apiVersion = options.apiVersion;

    //todo: headers
}

//todo: private
RestApi.prototype.doRequest = function (options, callback) {
    var me = this;
    if (!this._auth) {
        var auth = this._auth = Q.defer();
        this.request({
            url: format('%s/security/authorize', this.getWsapiUrl())
        }, function (err, response, body) {
            if (body && body.OperationResult && body.OperationResult.SecurityToken) {
                auth.resolve(body.OperationResult.SecurityToken)
            } else {
                auth.reject('Unable to retrieve security token');
            }
        });
    }
    return Q.when(this._auth.promise, function (token) {
        var deferred = Q.defer();
        var requestOptions = _.merge(options, {
            url: me.getWsapiUrl() + options.url,
            qs: {
                key: token
            }
        });
        me.request(requestOptions, function (err, response, body) {
            if (err) {
                deferred.reject([err]);
            } else if(!response) {
                deferred.reject(['Unable to connect to server.']);
            } else if(response.statusCode !== 200) {
                deferred.reject([format('%s: %s', requestOptions.url, response.statusCode)])
            } else {
                var result = _.values(body)[0];
                if(result.Errors.length) {
                    deferred.reject(result.Errors);
                } else {
                    deferred.resolve(result);
                }
            }
        });

        return deferred.promise.nodeify(callback);
    });
};

//todo: private
RestApi.prototype.getWsapiUrl = function () {
    return format('%s/slm/webservice/%s', this.server, this.apiVersion);
};

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
    return this.doRequest(_.extend({
        url: format('/%s/create', + options.type),
        json: postBody,
        method: 'POST'
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
    postBody[Ref.getType(options.ref)] = options.data; //todo dynatype?
    return this.doRequest(_.extend({
        url: Ref.getRelative(options.ref),
        json: postBody,
        method: 'POST'
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
    return this.doRequest(_.extend({
        url: Ref.getRelative(options.ref),
        method: 'DELETE'
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
    return this.doRequest(_.extend({
        url: options.ref
    }, options.requestOptions),  callback);
};

module.exports = RestApi;