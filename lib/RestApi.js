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
 - @member {string} host - host for the Rally API (default: https://rally1.rallydev.com)
 - @member {string} apiVersion - the Rally REST API version to use for requests (default: v2.0)
 - @member {string} userName - the username to use for requests (default: RALLY_USERNAME env variable)
 - @member {string} password - the password to use for requests (default: RALLY_PASSWORD env variable)
 */
function RestApi(options) {
    options = options || {};
    this.request = request.defaults({
        jar: true,
        json: true,
        auth: {
            user: options.userName || process.env.RALLY_USERNAME,
            pass: options.password || process.env.RALLY_PASSWORD,
            sendImmediately: false
        }
    });
    this.server = options.server || defaultServer;
    this.apiVersion = options.apiVersion || defaultApiVersion;
}

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

RestApi.prototype.getWsapiUrl = function () {
    return format('%s/slm/webservice/%s', this.server, this.apiVersion);
};

RestApi.prototype.create = function (options, callback) {
    var postBody = {};
    postBody[options.type] = options.data;
    return this.doRequest({
        url: format('/%s/create', + options.type),
        json: postBody,
        method: 'POST'
    }, callback);
};

RestApi.prototype.update = function (options, callback) {
    var postBody = {};
    postBody[Ref.getType(options.ref)] = options.data;
    return this.doRequest({
        url: Ref.getRelative(options.ref),
        json: postBody,
        method: 'POST'
    }, callback);
};

RestApi.prototype.delete = function (options, callback) {
    return this.doRequest({
        url: Ref.getRelative(options.ref),
        method: 'DELETE'
    }, callback);
};

/**
 Retrieve the specified object.  Uses the request
 library, and largely passes through to its API for options:

 https://github.com/mikeal/request

 @param {object} options - options for request
 - @member {string} ref - the ref of the object to retrieve
 @param {function} callback - callback function for when request is complete
 - @param {object} error - an error object if there was a problem processing the request
 - @param {object} data - the response
 - @param {http.ClientResponse} response - the raw node http.ClientResponse object
 */
RestApi.prototype.get = function (options, callback) {
    return this.doRequest({url: options.ref}, callback);
};

module.exports = RestApi;