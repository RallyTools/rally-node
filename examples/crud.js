var rally = require('./../lib/main.js'),
  restApi = new rally.RestApi();

function createDefect() {
    return restApi.create({
        type: 'defect',
        data: {
            Name: 'My Defect'
        }
        //todo: request options, rally options (fetch, etc)
    });
}

function readDefect(result) {
    return restApi.get();
}

//function updateDefect(error, result) {
//
//}
//
//function deleteDefect(error, result) {
//
//}
//
//function done() {
//
//}
//
createDefect()
    .then(readDefect)
    .fail(function(errors) {
        console.log(errors);
    });
//    .then(updateDefect)
//    .then(deleteDefect)
//    .then()

//var promise = restApi.get({
//    ref: '/hierarchicalrequirement/15176552210'
//}, function(error, result, rawResponse) {
//    console.log(arguments);
//});
//
//var promise = restApi.get({
//    ref: '/hierarchicalrequirement/15176552210'
//}).then(function(error, result, rawResponse) {
//    console.log(arguments);
//});

