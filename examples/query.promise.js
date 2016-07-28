// NOTE: Environment variable RALLY_API_KEY (or RALLY_USERNAME and RALLY_PASSWORD)
// must be defined to actually run this example
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
        limit: 200,
        order: 'Rank',
        fetch: ['FormattedID', 'Name', 'ScheduleState']
    });
}

function onSuccess(result) {
    console.log('Success!', result);
}

function onError(error) {
    console.log('Failure!', error.message, error.errors);
}

queryEpicStories()
    .then(queryChildren)
    .then(onSuccess)
    .catch(onError);
