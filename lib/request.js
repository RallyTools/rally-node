var Q = require('q'),
    request = require('request'),
    format = require('util').format,
    _ = require('lodash');

function Request(options) {
    this.wsapiUrl = format('%s/slm/webservice/%s', options.server, options.apiVersion);
    this.httpRequest = request.defaults(options.requestOptions);
}

Request.prototype.doSecuredRequest = function (options, callback) {
    var self = this;
    if (!this._auth) {
        this._auth = Q.defer();
        this.httpRequest.get({
            url: format('%s/security/authorize', this.wsapiUrl)
        }, function (err, response, body) {
            if (body && body.OperationResult && body.OperationResult.SecurityToken) {
                self._auth.resolve(body.OperationResult.SecurityToken)
            } else {
                self._auth.reject('Unable to retrieve security token');
            }
        });
    }
    return this._auth.promise.then(function (token) {
        return self.doRequest(_.merge(options, {
            qs: {
                key: token
            }
        }), callback);
    });
};

Request.prototype.doRequest = function (options, callback) {
    var deferred = Q.defer();
    this.httpRequest(_.extend({}, options, {
        url: this.wsapiUrl + options.url
    }), function (err, response, body) {
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

Request.prototype.get = function (options, callback) {
    return this.doRequest(options, callback);
};

Request.prototype.post = function (options, callback) {
    return this.doSecuredRequest(_.extend({
        method: 'POST'
    }, options), callback);
};

Request.prototype.put = function (options, callback) {
    return this.doSecuredRequest(_.extend({
        method: 'PUT'
    }, options), callback);
};

Request.prototype.delete = function (options, callback) {
    return this.doSecuredRequest(_.extend({
        method: 'DELETE'
    }, options), callback);
};

module.exports = function (options) {
    return new Request(options);
};