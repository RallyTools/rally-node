var Q = require('q'),
    request = require('request'),
    format = require('util').format,
    _ = require('lodash');

function Request(options) {
    this.wsapiUrl = format('%s/slm/webservice/%s', options.server, options.apiVersion);
    this.httpRequest = request.defaults(options.requestOptions);
}

Request.prototype.doSecuredRequest = function(method, options, callback) {
    var self = this,
        deferred = Q.defer();

    function doRequest() {
        self.doRequest(method, _.merge(options, {
            qs: {
                key: self._token
            }
        }), function(error, result) {
            if(error) {
                deferred.reject(error);
            } else {
                deferred.resolve(result);
            }
        });
    }

    if (this._token) {
        doRequest();
    } else {
        this.doRequest('get', {
            url: '/security/authorize'
        }).then(function(result) {
                self._token = result.SecurityToken;
                doRequest();
            },
            function(error) {
                deferred.reject(error);
            });
    }

    return deferred.promise.nodeify(callback);
};

Request.prototype.doRequest = function(method, options, callback) {
    var deferred = Q.defer();
    this.httpRequest[method](_.extend({}, options, {
        url: this.wsapiUrl + options.url
    }), function(err, response, body) {
        if (err) {
            deferred.reject([err]);
        } else if (!response) {
            deferred.reject(['Unable to connect to server.']);
        } else if (response.statusCode !== 200) {
            deferred.reject([format('%s: %s', options.url, response.statusCode)])
        } else {
            var result = _.values(body)[0];
            if (result.Errors.length) {
                deferred.reject(result.Errors);
            } else {
                deferred.resolve(result);
            }
        }
    });

    return deferred.promise.nodeify(callback);
};

Request.prototype.get = function(options, callback) {
    return this.doRequest('get', options, callback);
};

Request.prototype.post = function(options, callback) {
    return this.doSecuredRequest('post', options, callback);
};

Request.prototype.put = function(options, callback) {
    return this.doSecuredRequest('put', options, callback);
};

Request.prototype.delete = function(options, callback) {
    return this.doSecuredRequest('del', options, callback);
};

module.exports = {
    init: function(options) {
        return new Request(options);
    },
    Request: Request
};