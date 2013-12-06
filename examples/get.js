var rally = require('./../lib/main.js');

var restApi = new rally.RestApi();
var promise = restApi.get({
    ref: '/hierarchicalrequirement/15176552210'
}, function(error, result, rawResponse) {
    console.log(arguments);
});

var promise = restApi.get({
    ref: '/hierarchicalrequirement/15176552210'
}).then(function(error, result, rawResponse) {
    console.log(arguments);
});