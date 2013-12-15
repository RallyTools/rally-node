var rally = require('..'),
    restApi = rally(),
    queryUtils = rally.util.query;

function queryOpenDefects(callback) {
    restApi.query({
        type: 'defect',
        start: 1,
        pageSize: 1,
        limit: 10,
        order: 'FormattedID',
        fetch: ['FormattedID', 'Name', 'Priority', 'Severity'],
        query: queryUtils.create('State', '=', 'Open')
    }, callback);
}

function processResults(error, result) {
    if (error) {
        console.log('Failure!', errors);
    } else {
        console.log('Success!', result);
    }
}

queryOpenDefects(processResults);

