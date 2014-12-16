var Q = require('q'),
    request = require('request'),
    format = require('util').format,
    _ = require('lodash');

function Request(options) {
    this.wsapiUrl = format('%s/slm/webservice/%s', options.server, options.apiVersion);
    this.httpRequest = request.defaults(options.requestOptions || {});
    this._hasKey = options.requestOptions &&
        options.requestOptions.headers &&
        options.requestOptions.headers.zsessionid;
}

Request.prototype.doSecuredRequest = function(method, options, callback) {
    if(this._hasKey) {
        return this.doRequest(method, options, callback);
    }

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
    var deferred = Q.defer(),
        self = this;
    this.httpRequest[method](_.extend({}, options, {
        url: this.wsapiUrl + options.url
    }), function(err, response, body) {
        if (err) {
            deferred.reject([err]);
        } else if (!response) {
            deferred.reject([format('Unable to connect to server: %s', self.wsapiUrl)]);
        } else if (!body || !_.isObject(body)) {
            deferred.reject([format('%s: %s! body=%s', options.url, response.statusCode, body)]);
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

Request.prototype.del = function(options, callback) {
    return this.doSecuredRequest('del', options, callback);
};

module.exports = {
    init: function(options) {
        return new Request(options);
    },
    Request: Request
};