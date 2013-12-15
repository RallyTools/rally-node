var rally = require('..'),
    queryUtils = rally.util.query,
    restApi = rally();

function queryDefects() {
    return restApi.query({
        type: 'defect',
        start: 1,
        pageSize: 1,
        limit: 10,
        order: 'FormattedID',
        fetch: ['FormattedID', 'Name', 'Priority', 'Severity'],
        query: queryUtils.where('State', '=', 'Open')
    });
}

function onSuccess(result) {
    console.log('Success!', result);
}

function onError(errors) {
    console.log('Failure!', errors);
}

queryDefects()
    .then(onSuccess)
    .fail(onError);