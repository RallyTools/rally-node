import request from 'request';
import _ from 'lodash';
import callbackify from './util/callbackify';

const generateError = (errorMessages) => {
  const e = new Error(errorMessages[0]);
  e.errors = errorMessages;
  return e;
}
export default class Request {
  constructor(options) {
    this.wsapiUrl = `${options.server}/slm/webservice/${options.apiVersion}`;
    this.jar = request.jar();
    this._requestOptions = Object.assign({ jar: this.jar }, options.requestOptions);
    this.httpRequest = request.defaults(this._requestOptions);
    this._hasKey = options.requestOptions &&
        options.requestOptions.headers &&
        options.requestOptions.headers.zsessionid;
  }

  getCookies(...args) {
    return this.jar.getCookies(...args);
  }

  auth() {
    return this.doRequest('get', {
      url: '/security/authorize'
    }).then((result) => {
      this._token = result.SecurityToken;
    });
  }

  doSecuredRequest(method, options, callback) {
    if (this._hasKey) {
      return this.doRequest(method, options, callback);
    }

    const doRequest = () => {
      const requestOptions = _.merge(
        {},
        options,
        {
          qs: {
            key: this._token
          }
        }
      );
      return this.doRequest(method, requestOptions);
    };

    let securedRequestPromise;
    if (this._token) {
      securedRequestPromise = doRequest();
    } else {
      securedRequestPromise = this.auth().then(doRequest);
    }
    callbackify(securedRequestPromise, callback);
    return securedRequestPromise;
  }

  doRequest(method, options, callback) {
    const doRequestPromise = new Promise((resolve, reject) => {
      const requestOptions = _.merge({}, options, {
        url: this.wsapiUrl + options.url
      });
      this.httpRequest[method](requestOptions, (err, response, body) => {
        if (err) {
          reject(generateError([err]));
        } else if (!response) {
          reject(generateError([`Unable to connect to server: ${this.wsapiUrl}`]));
        } else if (!body || !_.isObject(body)) {
          reject(generateError([`${options.url}: ${response.statusCode}! body=${body}`]));
        } else {
          const result = _.values(body)[0];
          if (result.Errors.length) {
            reject(generateError(result.Errors));
          } else {
            resolve(result);
          }
        }
      });
    });

    callbackify(doRequestPromise, callback);
    return doRequestPromise;
  }

  get(options, callback) {
    return this.doRequest('get', options, callback);
  }

  post(options, callback) {
    return this.doSecuredRequest('post', options, callback);
  }

  put(options, callback) {
    return this.doSecuredRequest('put', options, callback);
  }

  del(options, callback) {
    return this.doSecuredRequest('del', options, callback);
  }
}
