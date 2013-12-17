var rally = require('..'),
    queryUtils = rally.util.query,
    restApi = rally();

function queryEpicStories() {
    return restApi.query({
        type: 'hierarchicalrequirement',
        start: 1,
        pageSize: 2,
        limit: 10,
        order: 'Rank',
        fetch: ['FormattedID', 'Name', 'ScheduleState', 'Children'],
        query: queryUtils.where('DirectChildrenCount', '>', 0)
    });
}

function queryChildren(result) {
    return restApi.query({
        ref: result.Results[0].Children,
        start: 1,
        limit: Infinity,
        order: 'Rank',
        fetch: ['FormattedID', 'Name', 'ScheduleState']
    });
}

function onSuccess(result) {
    console.log('Success!', result);
}

function onError(errors) {
    console.log('Failure!', errors);
}

queryEpicStories()
    .then(queryChildren)
    .then(onSuccess)
    .fail(onError);