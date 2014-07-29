var _ = require('lodash');
/**
 @module Ref

 This module contains utility methods for working with Rally Object References (refs)
 */

//                              oid |  -oid  |                                   uuid                                    |  uuid compact
var IDENTITY_REGEX_PARTIAL = '[0-9]+|-?[0-9]+|[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}|[a-fA-F0-9]{32}';

var IDENTITY_REGEX = '(' + IDENTITY_REGEX_PARTIAL + ')';

var NON_CAP_IDENTITY_REGEX = '(?:' + IDENTITY_REGEX_PARTIAL + ')';

var TYPE_REGEX = '(\\w+)';

var DYNATYPE_REGEX = '(\\w{2,}\\/\\w+)';

var EXT_REGEX = '(?:\\.js\\??.*)';
    
var REF_REGEXES = [

    //dynatype collection ref (/portfolioitem/feature/1234/children)
    new RegExp('.*?\\/' + DYNATYPE_REGEX + '\\/' + IDENTITY_REGEX + '\\/' + TYPE_REGEX + EXT_REGEX + '?$'),

    //dynatype ref (/portfolioitem/feature/1234)
    new RegExp('.*?\\/' + DYNATYPE_REGEX + '\\/' + IDENTITY_REGEX + EXT_REGEX + '?$'),

    //collection ref (/defect/1234/tasks)
    new RegExp('.*?\\/' + TYPE_REGEX + '\\/' + IDENTITY_REGEX + '\\/' + TYPE_REGEX + EXT_REGEX + '?$'),

    //basic ref (/defect/1234)
    new RegExp('.*?\\/' + TYPE_REGEX + '\\/' + IDENTITY_REGEX + EXT_REGEX + '?$'),

    //permission ref (/workspacepermission/123u456w1)
    new RegExp('.*?\\/' + TYPE_REGEX + '\\/(' + NON_CAP_IDENTITY_REGEX + 'u' + NON_CAP_IDENTITY_REGEX + '[pw]' + NON_CAP_IDENTITY_REGEX + ')' + EXT_REGEX + '?$')
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
        return (refMatch && [''].concat(refMatch.slice(1)).join('/')) || null;
    },

    getType: function(input) {
        var refMatch = match(input);
        return (refMatch && refMatch[1]) || null;
    },

    getId: function(input) {
        var refMatch = match(input);
        return (refMatch && refMatch[2]) || null;
    }
};

module.exports = Ref;