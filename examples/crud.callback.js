var rally = require('..'),
    restApi = rally(),
    refUtils = rally.util.ref;

function onError(errors) {
    console.log('Failure!', errors);
}

function createDefect() {
    console.log('Creating defect...');
    restApi.create({
        type: 'defect',
        data: {
            Name: 'My Defect',
            Environment: 'Test'
        }
    }, function(error, result) {
        if(error) {
            onError(error);
        } else {
            console.log('Defect created:', refUtils.getRelative(result.Object));
            readDefect(result);
        }
    });
}

function readDefect(result) {
    console.log('Reading defect...');
    restApi.get({
        ref: result.Object,
        fetch: ['FormattedID', 'Name']
    }, function(error, result) {
        if(error) {
            onError(error);
        } else {
            console.log('Defect read:', result.Object.FormattedID, '-', result.Object.Name);
            updateDefect(result);
        }
    });
}

function updateDefect(result) {
    console.log('Updating defect...');
    restApi.update({
        ref: result.Object,
        data: {
            Name: 'My Updated Defect'
        },
        fetch: ['Name']
    }, function(error, result) {
        if(error) {
            onError(error);
        } else {
            console.log('Defect updated:', result.Object.Name);
            deleteDefect(result);
        }
    });
}

function deleteDefect(result) {
    console.log('Deleting defect...');
    restApi.del({
        ref: result.Object
    }, function(error, result) {
        if(error) {
            onError(error);
        } else {
            console.log('Success!', result);
        }
    });
}

createDefect(readDefect);