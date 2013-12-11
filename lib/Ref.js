var _ = require('lodash'),
    format = require('util').format;
/**
 @module Ref

 This module contains utility methods for working with Rally Object References (refs)
 */
var REF_REGEXES = [

    //dynatype collection ref (/portfolioitem/feature/1234/children)
    /.*?\/(\w{2,}\/\w+)\/(\d+\/\w+)(?:\.js\??.*)?$/,

    //dynatype ref (/portfolioitem/feature/1234)
    /.*?\/(\w{2,}\/\w+)\/(\d+)(?:\.js\??.*)?$/,

    //collection ref (/defect/1234/tasks)
    /.*?\/(\w+\/-?\d+)\/(\w+)(?:\.js\??.*)?$/,

    //basic ref (/defect/1234)
    /.*?\/(\w+)\/(-?\d+)(?:\.js\??.*)?$/,

    //permission ref (/workspacepermission/123u456w1)
    /.*?\/(\w+)\/(\d+u\d+[pw]\d+)(?:\.js\??.*)?$/
];

function match(input) {
    input = (input && input._ref) ? input._ref : (input || '');
    var regexMatch = _.find(REF_REGEXES, function(regex) {
        return regex.test(input);
    });
    return (regexMatch && input.match(regexMatch)) || null;
}

var Ref = {
    isRef: function(input) {
        return !!match(input);
    },

    getRelative: function(input) {
        var refMatch = match(input);
        return (refMatch && format('/%s/%s', refMatch[1], refMatch[2])) || null;
    }
};

module.exports = Ref;