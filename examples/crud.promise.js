// NOTE: Environment variable RALLY_API_KEY (or RALLY_USERNAME and RALLY_PASSWORD)
// must be defined to actually run this example
var rally = require('..'),
    restApi = rally(),
    refUtils = rally.util.ref;

function createDefect() {
    console.log('Creating defect...');
    return restApi.create({
        type: 'defect',
        data: {
            Name: 'My Defect',
            Environment: 'Test'
        }
    });
}

function readDefect(result) {
    console.log('Defect created:', refUtils.getRelative(result.Object));
    console.log('Reading defect...');
    return restApi.get({
        ref: result.Object,
        fetch: ['FormattedID', 'Name']
    });
}

function updateDefect(result) {
    console.log('Defect read:', result.Object.FormattedID, '-', result.Object.Name);
    console.log('Updating defect...');
    return restApi.update({
        ref: result.Object,
        data: {
            Name: 'My Updated Defect'
        },
        fetch: ['Name']
    });
}

function deleteDefect(result) {
    console.log('Defect updated:', result.Object.Name);
    console.log('Deleting defect...');
    return restApi.del({
        ref: result.Object
    });
}

function onSuccess(result) {
    console.log('Success!', result);
}

function onError(error) {
    console.log('Failure!', error.message, error.errors);
}

createDefect()
    .then(readDefect)
    .then(updateDefect)
    .then(deleteDefect)
    .then(onSuccess)
    .catch(onError);
