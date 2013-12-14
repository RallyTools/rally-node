var rally = require('..'),
    restApi = rally();

function queryDefects(callback) {
    return restApi.query({
        type: 'defect',
        start: 1,
        pageSize: 1,
        limit: 10
    }, callback);
}

function onSuccess(result) {
    console.log('Success!', result);
}

function onError(errors) {
    console.log('Failure!', errors);
}

//promise style
queryDefects()
    .then(onSuccess)
    .fail(onError);

//callback style
queryDefects(function(error, result) {
    if(error) {
        onError(error);
    } else {
        onSuccess(result);
    }
});
