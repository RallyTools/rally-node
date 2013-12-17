var rally = require('..'),
    restApi = rally(),
    queryUtils = rally.util.query;

function onError(error) {
    console.log('Failure!', error);
}

function queryChildren(result) {
    restApi.query({
        ref: result.Results[0].Children,
        start: 1,
        limit: Infinity,
        order: 'Rank',
        fetch: ['FormattedID', 'Name', 'ScheduleState']
    }, function(error, result) {
        if(error) {
            onError(error);
        } else {
            console.log('Success!', result)
        }
    });
}

function queryEpicStories(callback) {
    restApi.query({
        type: 'hierarchicalrequirement',
        start: 1,
        pageSize: 2,
        limit: 10,
        order: 'Rank',
        fetch: ['FormattedID', 'Name', 'ScheduleState', 'Children'],
        query: queryUtils.where('DirectChildrenCount', '>', 0)
    }, function(error, result) {
        if(error) {
            onError(error);
        } else {
            callback(result);
        }
    });
}

queryEpicStories(queryChildren);

