/**
 @module RestApi

 This module presents a higher-level API for interacting with resources
 in the Rally REST API.
 */
var defaultServer = 'https://rally1.rallydev.com',
    defaultApiVersion = 'v2.0';

var request = require('request'),
    Q = require('q');

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
    this.http = request.defaults({
        jar: true,
        auth: {
            user: options.userName || process.env.RALLY_USERNAME,
            pass: options.password || process.env.RALLY_PASSWORD,
            sendImmediately: false
        }
    });
    this.server = options.server || defaultServer;
    this.apiVersion = options.apiVersion || defaultApiVersion;
}

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
RestApi.prototype.get = function(options, callback) {
    var deferred = Q.defer();

    this.http.get({
        url: this.server + '/slm/webservice/' + this.apiVersion + options.ref
    }, function(err, response, body) {
        var error;
        var data = body;

        data.rawResponse = response;

        if (error) {
            deferred.reject(error);
        } else {
            deferred.resolve(data);
        }
    });

    // Return promise, but also support original node callback style
    return deferred.promise.nodeify(callback);
};

module.exports = RestApi;