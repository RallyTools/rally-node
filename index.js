var util = require('./lib/util'),
    RestApi = require('./lib/restapi');

function restApi(options) {
    return new RestApi(options);
}

restApi.RestApi = RestApi;
restApi.util = util;

module.exports = restApi;
