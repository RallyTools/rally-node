var rally = require('..'),
    restApi = rally();

function queryDefects() {
    return restApi.query({
        type: 'defect',
        start: 1,
        pageSize: 1,
        limit: 10
        //todo: rally options (fetch, etc)
    });
}

function onSuccess(result) {
    console.log('Success!', result.Results);
}

function onError(result) {
    console.log('Failure!', errors);

}

queryDefects()
    .then(onSuccess)
    .fail(onError);
