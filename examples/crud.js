var rally = require('./../lib/main.js'),
  restApi = new rally.RestApi({server: 'https://test7cluster.rallydev.com'});

function createDefect() {
    return restApi.create({
        type: 'defect',
        data: {
            Name: 'My Defect',
            Environment: 'Test'
        }
        //todo: request options, rally options (fetch, etc)
    });
}

function readDefect(result) {
    return restApi.get({
        ref: '/defect/' + result.Object.ObjectID //todo: use ref instead
    });
}

function updateDefect(result) {
    //todo: inconsistent result from read (should be stored on Object property?
    return restApi.update({
        ref: '/defect/' + result.ObjectID, //todo: use ref instead
        data: {
            Name: 'My Updated Defect'
        }
    });
}

function deleteDefect(result) {
    return restApi.delete({
        ref: '/defect/' + result.Object.ObjectID  //todo: use ref instead
    });
}

createDefect()
    .then(readDefect)
    .then(updateDefect)
    .then(deleteDefect)
    .fail(function(errors) {
        console.log(errors);
    });

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

