var should = require('should'),
    queryUtils = require('../..').util.query;

describe('Query', function() {

    describe('#toQueryString', function() {

        it('should handle a simple query', function() {
            queryUtils.where('Name', 'contains', 'foo').toQueryString().should.eql('(Name contains foo)');
        });

        it('should handle a query with a non-string value', function() {
            queryUtils.where('DirectChildrenCount', '>', 0).toQueryString().should.eql('(DirectChildrenCount > 0)');
        });

        it('should handle a null value', function() {
            queryUtils.where('Iteration', '=', null).toQueryString().should.eql('(Iteration = null)');
        });

        it('should handle a ref value', function() {
            queryUtils.where('Iteration', '=', 'https://rally1.rallydev.com/slm/webservice/v2.0/iteration/12345').toQueryString().should.eql('(Iteration = /iteration/12345)');
            queryUtils.where('Iteration', '=', {_ref: 'https://rally1.rallydev.com/slm/webservice/v2.0/iteration/12345'}).toQueryString().should.eql('(Iteration = /iteration/12345)');
        });

        it('should handle a value with spaces', function() {
            queryUtils.where('Name', 'contains', 'foo bar').toQueryString().should.eql('(Name contains "foo bar")');
        });

        it('should handle a value with spaces', function() {
            queryUtils.where('Name', 'contains', 'foo bar').toQueryString().should.eql('(Name contains "foo bar")');
        });

        it('should handle nested queries', function() {
            queryUtils.where('Tags.Name', 'contains', 'foo').and('Owner', '=', '/user/1234').toQueryString().should.eql('((Tags.Name contains foo) AND (Owner = /user/1234))')
        });
    });

    describe('#and', function() {

        it('should combine two queries', function() {
            var q = queryUtils.where('Name', 'contains', 'foo').and('Owner', '=', '/user/1234');
            q.left.should.eql({left: 'Name', op: 'contains', right: 'foo'});
            q.op.should.eql('AND');
            q.right.should.eql({left: 'Owner', op: '=', right: '/user/1234'});
        });

        it('should combine three queries, including an or', function() {
            var q = queryUtils.where('Name', 'contains', 'foo').and('Owner', '=', '/user/1234').or('ScheduleState', '<', 'Accepted');
            q.left.should.eql({left: {left: 'Name', op: 'contains', right: 'foo'}, op: 'AND', right: {left: 'Owner', op: '=', right: '/user/1234'}});
            q.op.should.eql('OR');
            q.right.should.eql({left: 'ScheduleState', op: '<', right: 'Accepted'});
        });
    });

    describe('#or', function() {

        it('should combine two queries', function() {
            var q = queryUtils.where('Name', 'contains', 'foo').or('Owner', '=', '/user/1234');
            q.left.should.eql({left: 'Name', op: 'contains', right: 'foo'});
            q.op.should.eql('OR');
            q.right.should.eql({left: 'Owner', op: '=', right: '/user/1234'});
        });

        it('should combine three queries, including an and', function() {
            var q = queryUtils.where('Name', 'contains', 'foo').or('Owner', '=', '/user/1234').and('ScheduleState', '<', 'Accepted');
            q.left.should.eql({left: {left: 'Name', op: 'contains', right: 'foo'}, op: 'OR', right: {left: 'Owner', op: '=', right: '/user/1234'}});
            q.op.should.eql('AND');
            q.right.should.eql({left: 'ScheduleState', op: '<', right: 'Accepted'});
        });
    });
});

