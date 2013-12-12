var should = require('should'),
    Ref = require('../lib/main').Ref;

describe('Ref', function () {

    describe('#isRef', function () {

        it('should handle invalid refs', function () {
            Ref.isRef(6786876).should.eql(false);
            Ref.isRef({}).should.eql(false);
            Ref.isRef(false).should.eql(false);
            Ref.isRef('yar').should.eql(false);
            Ref.isRef(null).should.eql(false);
            Ref.isRef().should.eql(false);
            Ref.isRef('/defect').should.eql(false);
            Ref.isRef('https://rally1.rallydev.com/slm/webservice/1.32/defect/abc.js').should.eql(false);
            Ref.isRef('').should.eql(false);
        });

        it('should handle basic refs', function () {
            Ref.isRef('https://rally1.rallydev.com/slm/webservice/1.17/builddefinition/81177657').should.eql(true);
            Ref.isRef('https://rally1.rallydev.com/slm/webservice/1.17/builddefinition/81177657.js').should.eql(true);
            Ref.isRef('/builddefinition/81177657.js').should.eql(true);
            Ref.isRef('/builddefinition/81177657').should.eql(true);
        });

        it('should handle permission refs', function () {
            Ref.isRef('/projectpermission/1234u5678p1').should.eql(true);
            Ref.isRef('/projectpermission/1234u5678p1.js').should.eql(true);
            Ref.isRef('https://rally1.rallydev.com/slm/webservice/v2.0/projectpermission/1234u5678p1.js').should.eql(true);
            Ref.isRef('/workspacepermission/1234u5678w1').should.eql(true);
            Ref.isRef('/workspacepermission/1234u5678w1.js').should.eql(true);
            Ref.isRef('https://rally1.rallydev.com/slm/webservice/v2.0/workspacepermission/1234u5678w1.js').should.eql(true);
        });

        it('should handle built-in refs', function () {
            Ref.isRef('/typedefinition/-1234.js').should.eql(true);
            Ref.isRef('/typedefinition/-1234').should.eql(true);
            Ref.isRef('https://rally1.rallydev.com/slm/webservice/v2.0/typedefinition/-1234').should.eql(true);
            Ref.isRef('/typedefinition/-1234/attributes').should.eql(true);
        });

        it('should handle objects', function () {
            Ref.isRef({_ref: '/defect/12345'}).should.eql(true);
            Ref.isRef({_ref: 'https://rally1.rallydev.com/slm/webservice/v2.0/defect/12345'}).should.eql(true);
        });

        it('should handle dynatype refs', function () {
            Ref.isRef('/portfolioitem/feature/1234').should.eql(true);
            Ref.isRef('/portfolioitem/feature/1234.js').should.eql(true);
            Ref.isRef('https://rally1.rallydev.com/slm/webservice/1.32/portfolioitem/feature/1234').should.eql(true);
            Ref.isRef('http://rally1.rallydev.com/slm/webservice/1.32/portfolioitem/feature/1234.js').should.eql(true);
            Ref.isRef('/portfolioitem/feature/1234/children.js').should.eql(true);
            Ref.isRef('/portfolioitem/feature/1234/children').should.eql(true);
            Ref.isRef('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234/children').should.eql(true);
        });
    });

    describe('#getRelative', function () {

        it('should handle non-refs', function () {
            should.not.exist(Ref.getRelative('blah'));
            should.not.exist(Ref.getRelative(''));
            should.not.exist(Ref.getRelative(null));
            should.not.exist(Ref.getRelative({}));
            should.not.exist(Ref.getRelative({_ref: null}));
        });

        it('should handle basic refs', function () {
            Ref.getRelative('/defect/1234').should.eql('/defect/1234');
            Ref.getRelative('/defect/1234.js').should.eql('/defect/1234');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/1.32/defect/1234').should.eql('/defect/1234');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/1.32/defect/1234.js').should.eql('/defect/1234');
        });

        it('should handle dynatype refs', function () {
            Ref.getRelative('/portfolioitem/feature/1234').should.eql('/portfolioitem/feature/1234');
            Ref.getRelative('/portfolioitem/feature/1234.js').should.eql('/portfolioitem/feature/1234');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234').should.eql('/portfolioitem/feature/1234');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234.js').should.eql('/portfolioitem/feature/1234');
        });

        it('should handle dynatype collection refs', function () {
            Ref.getRelative('/portfolioitem/feature/1234/children').should.eql('/portfolioitem/feature/1234/children');
            Ref.getRelative('/portfolioitem/feature/1234/children.js').should.eql('/portfolioitem/feature/1234/children');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234/children').should.eql('/portfolioitem/feature/1234/children');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234/children.js').should.eql('/portfolioitem/feature/1234/children');
        });

        it('should handle collection refs', function () {
            Ref.getRelative('/defect/1234/tasks').should.eql('/defect/1234/tasks');
            Ref.getRelative('/defect/1234/tasks.js').should.eql('/defect/1234/tasks');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234/tasks').should.eql('/defect/1234/tasks');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234/tasks.js').should.eql('/defect/1234/tasks');
        });

        it('should handle built-in refs', function () {
            Ref.getRelative('/typedefinition/-1234').should.eql('/typedefinition/-1234');
            Ref.getRelative('/typedefinition/-1234.js').should.eql('/typedefinition/-1234');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/typedefinition/-1234.js').should.eql('/typedefinition/-1234');
            Ref.getRelative('/typedefinition/-1234/attributes').should.eql('/typedefinition/-1234/attributes');
            Ref.getRelative('/typedefinition/-1234/attributes.js').should.eql('/typedefinition/-1234/attributes');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/typedefinition/-1234/attributes.js').should.eql('/typedefinition/-1234/attributes');
        });

        it('should support various wsapi versions', function () {
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234/tasks').should.eql('/defect/1234/tasks');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/1.43/defect/1234/tasks').should.eql('/defect/1234/tasks');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/x/defect/1234/tasks').should.eql('/defect/1234/tasks');
        });

        it('should handle permissions refs', function () {
            Ref.getRelative('/projectpermission/1234u5678p1').should.eql('/projectpermission/1234u5678p1');
            Ref.getRelative('/projectpermission/1234u5678p1.js').should.eql('/projectpermission/1234u5678p1');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/projectpermission/1234u5678p1.js').should.eql('/projectpermission/1234u5678p1');
            Ref.getRelative('/workspacepermission/1234u5678w1').should.eql('/workspacepermission/1234u5678w1');
            Ref.getRelative('/workspacepermission/1234u5678w1.js').should.eql('/workspacepermission/1234u5678w1');
            Ref.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/workspacepermission/1234u5678w1.js').should.eql('/workspacepermission/1234u5678w1');
        });
    });

    describe('#getType', function () {

        it('should handle non-refs', function () {
            should.not.exist(Ref.getType('blah'));
            should.not.exist(Ref.getType(''));
            should.not.exist(Ref.getType(null));
            should.not.exist(Ref.getType({}));
            should.not.exist(Ref.getType({_ref: null}));
        });

        it('should handle basic refs', function () {
            Ref.getType('/defect/1234').should.eql('defect');
            Ref.getType('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234.js').should.eql('defect');
        });

        it('should handle dynatype refs', function () {
            Ref.getType('/portfolioitem/feature/1234').should.eql('portfolioitem/feature');
            Ref.getType('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234.js').should.eql('portfolioitem/feature');
        });

        it('should handle dynatype collection refs', function () {
            Ref.getType('/portfolioitem/feature/1234/children').should.eql('portfolioitem/feature');
            Ref.getType('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234/children.js').should.eql('portfolioitem/feature');
        });

        it('should handle collection refs', function () {
            Ref.getType('/defect/1234/tasks').should.eql('defect');
            Ref.getType('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234/tasks.js').should.eql('defect');
        });

        it('should handle built-in refs', function () {
            Ref.getType('/typedefinition/-1234').should.eql('typedefinition');
            Ref.getType('https://rally1.rallydev.com/slm/webservice/v2.0/typedefinition/-1234.js').should.eql('typedefinition');
        });

        it('should handle permissions refs', function () {
            Ref.getType('/projectpermission/1234u5678p1').should.eql('projectpermission');
            Ref.getType('https://rally1.rallydev.com/slm/webservice/v2.0/projectpermission/1234u5678p1.js').should.eql('projectpermission');
            Ref.getType('/workspacepermission/1234u5678w1').should.eql('workspacepermission');
            Ref.getType('https://rally1.rallydev.com/slm/webservice/v2.0/workspacepermission/1234u5678w1.js').should.eql('workspacepermission');
        });
    });

    describe('#getId', function () {

        it('should handle non-refs', function () {
            should.not.exist(Ref.getId('blah'));
            should.not.exist(Ref.getId(''));
            should.not.exist(Ref.getId(null));
            should.not.exist(Ref.getId({}));
            should.not.exist(Ref.getId({_ref: null}));
        });

        it('should handle basic refs', function () {
            Ref.getId('/defect/1234').should.eql('1234');
            Ref.getId('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234.js').should.eql('1234');
        });

        it('should handle dynatype refs', function () {
            Ref.getId('/portfolioitem/feature/1234').should.eql('1234');
            Ref.getId('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234.js').should.eql('1234');
        });

        it('should handle dynatype collection refs', function () {
            Ref.getId('/portfolioitem/feature/1234/children').should.eql('1234');
            Ref.getId('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234/children.js').should.eql('1234');
        });

        it('should handle collection refs', function () {
            Ref.getId('/defect/1234/tasks').should.eql('1234');
            Ref.getId('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234/tasks.js').should.eql('1234');
        });

        it('should handle built-in refs', function () {
            Ref.getId('/typedefinition/-1234').should.eql('-1234');
            Ref.getId('https://rally1.rallydev.com/slm/webservice/v2.0/typedefinition/-1234.js').should.eql('-1234');
        });

        it('should handle permissions refs', function () {
            Ref.getId('/projectpermission/1234u5678p1').should.eql('1234u5678p1');
            Ref.getId('https://rally1.rallydev.com/slm/webservice/v2.0/projectpermission/1234u5678p1.js').should.eql('1234u5678p1');
            Ref.getId('/workspacepermission/1234u5678w1').should.eql('1234u5678w1');
            Ref.getId('https://rally1.rallydev.com/slm/webservice/v2.0/workspacepermission/1234u5678w1.js').should.eql('1234u5678w1');
        });
    });
});

