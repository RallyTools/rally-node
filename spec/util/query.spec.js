import should from 'should';
import rally from '../../lib/index';
import Query from '../../lib/util/query';

const queryUtils = rally.util.query;

describe('Query', () => {

  beforeEach(() => {
    should.config.checkProtoEql = false;
  });

  describe('#toQueryString', () => {

    it('should handle a simple query', () => {
      queryUtils.where('Name', 'contains', 'foo').toQueryString().should.eql('(Name contains foo)');
    });

    it('should handle a query with a non-string value', () => {
      queryUtils.where('DirectChildrenCount', '>', 0).toQueryString().should.eql('(DirectChildrenCount > 0)');
    });

    it('should handle a null value', () => {
      queryUtils.where('Iteration', '=', null).toQueryString().should.eql('(Iteration = null)');
    });

    it('should handle a ref value', () => {
      queryUtils.where('Iteration', '=', 'https://rally1.rallydev.com/slm/webservice/v2.0/iteration/12345').toQueryString().should.eql('(Iteration = /iteration/12345)');
      queryUtils.where('Iteration', '=', {_ref: 'https://rally1.rallydev.com/slm/webservice/v2.0/iteration/12345'}).toQueryString().should.eql('(Iteration = /iteration/12345)');
    });

    it('should handle a value with spaces', () => {
      queryUtils.where('Name', 'contains', 'foo bar').toQueryString().should.eql('(Name contains "foo bar")');
    });

    it('should handle nested queries', () => {
      queryUtils.where('Tags.Name', 'contains', 'foo').and('Owner', '=', '/user/1234').toQueryString().should.eql('((Tags.Name contains foo) AND (Owner = /user/1234))');
    });
  });

  describe('#and', () => {

    it('should combine two queries', () => {
      const q = queryUtils.where('Name', 'contains', 'foo').and('Owner', '=', '/user/1234');
      q.left.should.eql(new Query('Name', 'contains', 'foo'));
      q.op.should.eql('AND');
      q.right.should.eql(new Query('Owner', '=', '/user/1234'));
    });

    it('should combine three queries, including an or', () => {
      const q = queryUtils.where('Name', 'contains', 'foo').and('Owner', '=', '/user/1234').or('ScheduleState', '<', 'Accepted');
      q.left.should.eql(new Query(new Query('Name', 'contains', 'foo'), 'AND', new Query('Owner', '=', '/user/1234')));
      q.op.should.eql('OR');
      q.right.should.eql(new Query('ScheduleState', '<', 'Accepted'));
    });
  });

  describe('#or', () => {

    it('should combine two queries', () => {
      const q = queryUtils.where('Name', 'contains', 'foo').or('Owner', '=', '/user/1234');
      q.left.should.eql(new Query('Name', 'contains', 'foo'));
      q.op.should.eql('OR');
      q.right.should.eql(new Query('Owner', '=', '/user/1234'));
    });

    it('should combine three queries, including an and', () => {
      const q = queryUtils.where('Name', 'contains', 'foo').or('Owner', '=', '/user/1234').and('ScheduleState', '<', 'Accepted');
      q.left.should.eql(new Query(new Query('Name', 'contains', 'foo'), 'OR', new Query('Owner', '=', '/user/1234')));
      q.op.should.eql('AND');
      q.right.should.eql(new Query('ScheduleState', '<', 'Accepted'));
    });
  });
});
