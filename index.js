var util = require('./lib/util'),
    RestApi = require('./lib/restapi');

function restApi(options) {
    return new RestApi(options);
}

restApi.RestApi = RestApi;
restApi.util = util;

restApi.debug = process.env.NODE_DEBUG && /rally/.test(process.env.NODE_DEBUG);

module.exports = restApi;
