var should = require('should'),
    refUtils = require('../..').util.ref;

describe('Ref', function() {

    describe('#isRef', function() {

        it('should handle invalid refs', function() {
            refUtils.isRef(6786876).should.eql(false);
            refUtils.isRef({}).should.eql(false);
            refUtils.isRef(false).should.eql(false);
            refUtils.isRef('yar').should.eql(false);
            refUtils.isRef(null).should.eql(false);
            refUtils.isRef().should.eql(false);
            refUtils.isRef('/defect').should.eql(false);
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/1.32/defect/abc.js').should.eql(false);
            refUtils.isRef('').should.eql(false);
        });

        it('should handle basic refs', function() {
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/1.17/builddefinition/81177657').should.eql(true);
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/1.17/builddefinition/81177657.js').should.eql(true);
            refUtils.isRef('/builddefinition/81177657.js').should.eql(true);
            refUtils.isRef('/builddefinition/81177657').should.eql(true);
            
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/v3.0/builddefinition/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql(true);
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/v3.0/builddefinition/3493b0493ea74c9abf78069487936c13').should.eql(true);
            refUtils.isRef('/builddefinition/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql(true);
            refUtils.isRef('/builddefinition/3493b0493ea74c9abf78069487936c13').should.eql(true);
        });

        it('should handle permission refs', function() {
            refUtils.isRef('/projectpermission/1234u5678p1').should.eql(true);
            refUtils.isRef('/projectpermission/1234u5678p1.js').should.eql(true);
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/v2.0/projectpermission/1234u5678p1.js').should.eql(true);
            refUtils.isRef('/workspacepermission/1234u5678w1').should.eql(true);
            refUtils.isRef('/workspacepermission/1234u5678w1.js').should.eql(true);
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/v2.0/workspacepermission/1234u5678w1.js').should.eql(true);
            
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/v3.0/workspacepermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql(true);
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/v3.0/workspacepermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql(true);
            refUtils.isRef('/workspacepermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql(true);
            refUtils.isRef('/workspacepermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql(true);
        });

        it('should handle built-in refs', function() {
            refUtils.isRef('/typedefinition/-1234.js').should.eql(true);
            refUtils.isRef('/typedefinition/-1234').should.eql(true);
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/v2.0/typedefinition/-1234').should.eql(true);
            refUtils.isRef('/typedefinition/-1234/attributes').should.eql(true);
        });

        it('should handle objects', function() {
            refUtils.isRef({_ref: '/defect/12345'}).should.eql(true);
            refUtils.isRef({_ref: 'https://rally1.rallydev.com/slm/webservice/v2.0/defect/12345'}).should.eql(true);
            
            refUtils.isRef({_ref: 'https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b049-3ea7-4c9a-bf78-069487936c13'}).should.eql(true);
            refUtils.isRef({_ref: 'https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b0493ea74c9abf78069487936c13'}).should.eql(true);
            refUtils.isRef({_ref: '/defect/3493b049-3ea7-4c9a-bf78-069487936c13'}).should.eql(true);
            refUtils.isRef({_ref: '/defect/3493b0493ea74c9abf78069487936c13'}).should.eql(true);
        });

        it('should handle dynatype refs', function() {
            refUtils.isRef('/portfolioitem/feature/1234').should.eql(true);
            refUtils.isRef('/portfolioitem/feature/1234.js').should.eql(true);
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/1.32/portfolioitem/feature/1234').should.eql(true);
            refUtils.isRef('http://rally1.rallydev.com/slm/webservice/1.32/portfolioitem/feature/1234.js').should.eql(true);
            refUtils.isRef('/portfolioitem/feature/1234/children.js').should.eql(true);
            refUtils.isRef('/portfolioitem/feature/1234/children').should.eql(true);
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234/children').should.eql(true);
            
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13/children').should.eql(true);
            refUtils.isRef('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b0493ea74c9abf78069487936c13/children').should.eql(true);
            refUtils.isRef('/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13/children').should.eql(true);
            refUtils.isRef('/portfolioitem/feature/3493b0493ea74c9abf78069487936c13/children').should.eql(true);
        });
    });

    describe('#getRelative', function() {

        it('should handle non-refs', function() {
            should.not.exist(refUtils.getRelative('blah'));
            should.not.exist(refUtils.getRelative(''));
            should.not.exist(refUtils.getRelative(null));
            should.not.exist(refUtils.getRelative({}));
            should.not.exist(refUtils.getRelative({_ref: null}));
        });

        it('should handle basic refs', function() {
            refUtils.getRelative('/defect/1234').should.eql('/defect/1234');
            refUtils.getRelative('/defect/1234.js').should.eql('/defect/1234');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/1.32/defect/1234').should.eql('/defect/1234');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/1.32/defect/1234.js').should.eql('/defect/1234');
            
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b049-3ea7-4c9a-bf78-069487936c13.js').should.eql('/defect/3493b049-3ea7-4c9a-bf78-069487936c13');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b0493ea74c9abf78069487936c13').should.eql('/defect/3493b0493ea74c9abf78069487936c13');
            refUtils.getRelative('/defect/3493b049-3ea7-4c9a-bf78-069487936c13.js').should.eql('/defect/3493b049-3ea7-4c9a-bf78-069487936c13');
            refUtils.getRelative('/defect/3493b0493ea74c9abf78069487936c13').should.eql('/defect/3493b0493ea74c9abf78069487936c13');
        });

        it('should handle dynatype refs', function() {
            refUtils.getRelative('/portfolioitem/feature/1234').should.eql('/portfolioitem/feature/1234');
            refUtils.getRelative('/portfolioitem/feature/1234.js').should.eql('/portfolioitem/feature/1234');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234').should.eql('/portfolioitem/feature/1234');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234.js').should.eql('/portfolioitem/feature/1234');
            
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql('/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b0493ea74c9abf78069487936c13').should.eql('/portfolioitem/feature/3493b0493ea74c9abf78069487936c13');
            refUtils.getRelative('/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql('/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13');
            refUtils.getRelative('/portfolioitem/feature/3493b0493ea74c9abf78069487936c13').should.eql('/portfolioitem/feature/3493b0493ea74c9abf78069487936c13');
        });

        it('should handle dynatype collection refs', function() {
            refUtils.getRelative('/portfolioitem/feature/1234/children').should.eql('/portfolioitem/feature/1234/children');
            refUtils.getRelative('/portfolioitem/feature/1234/children.js').should.eql('/portfolioitem/feature/1234/children');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234/children').should.eql('/portfolioitem/feature/1234/children');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234/children.js').should.eql('/portfolioitem/feature/1234/children');
            
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b0493ea74c9abf78069487936c13/children').should.eql('/portfolioitem/feature/3493b0493ea74c9abf78069487936c13/children');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13/children').should.eql('/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13/children');
            refUtils.getRelative('/portfolioitem/feature/3493b0493ea74c9abf78069487936c13/children').should.eql('/portfolioitem/feature/3493b0493ea74c9abf78069487936c13/children');
            refUtils.getRelative('/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13/children').should.eql('/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13/children');
        });

        it('should handle collection refs', function() {
            refUtils.getRelative('/defect/1234/tasks').should.eql('/defect/1234/tasks');
            refUtils.getRelative('/defect/1234/tasks.js').should.eql('/defect/1234/tasks');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234/tasks').should.eql('/defect/1234/tasks');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234/tasks.js').should.eql('/defect/1234/tasks');
            
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks').should.eql('/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b0493ea74c9abf78069487936c13/tasks').should.eql('/defect/3493b0493ea74c9abf78069487936c13/tasks');
            refUtils.getRelative('/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks').should.eql('/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks');
            refUtils.getRelative('/defect/3493b0493ea74c9abf78069487936c13/tasks').should.eql('/defect/3493b0493ea74c9abf78069487936c13/tasks');
        });

        it('should handle built-in refs', function() {
            refUtils.getRelative('/typedefinition/-1234').should.eql('/typedefinition/-1234');
            refUtils.getRelative('/typedefinition/-1234.js').should.eql('/typedefinition/-1234');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/typedefinition/-1234.js').should.eql('/typedefinition/-1234');
            refUtils.getRelative('/typedefinition/-1234/attributes').should.eql('/typedefinition/-1234/attributes');
            refUtils.getRelative('/typedefinition/-1234/attributes.js').should.eql('/typedefinition/-1234/attributes');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/typedefinition/-1234/attributes.js').should.eql('/typedefinition/-1234/attributes');
        });

        it('should support various wsapi versions', function() {
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234/tasks').should.eql('/defect/1234/tasks');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/1.43/defect/1234/tasks').should.eql('/defect/1234/tasks');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/x/defect/1234/tasks').should.eql('/defect/1234/tasks');
            
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks').should.eql('/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/defect/3493b0493ea74c9abf78069487936c13/tasks').should.eql('/defect/3493b0493ea74c9abf78069487936c13/tasks');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks').should.eql('/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b0493ea74c9abf78069487936c13/tasks').should.eql('/defect/3493b0493ea74c9abf78069487936c13/tasks');
        });

        it('should handle permissions refs', function() {
            refUtils.getRelative('/projectpermission/1234u5678p1').should.eql('/projectpermission/1234u5678p1');
            refUtils.getRelative('/projectpermission/1234u5678p1.js').should.eql('/projectpermission/1234u5678p1');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/projectpermission/1234u5678p1.js').should.eql('/projectpermission/1234u5678p1');
            refUtils.getRelative('/workspacepermission/1234u5678w1').should.eql('/workspacepermission/1234u5678w1');
            refUtils.getRelative('/workspacepermission/1234u5678w1.js').should.eql('/workspacepermission/1234u5678w1');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v2.0/workspacepermission/1234u5678w1.js').should.eql('/workspacepermission/1234u5678w1');
            
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/workspacepermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql('/workspacepermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1');
            refUtils.getRelative('https://rally1.rallydev.com/slm/webservice/v3.0/workspacepermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql('/workspacepermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1');
            refUtils.getRelative('/workspacepermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql('/workspacepermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1');
            refUtils.getRelative('/workspacepermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql('/workspacepermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1');
        });
    });

    describe('#getType', function() {

        it('should handle non-refs', function() {
            should.not.exist(refUtils.getType('blah'));
            should.not.exist(refUtils.getType(''));
            should.not.exist(refUtils.getType(null));
            should.not.exist(refUtils.getType({}));
            should.not.exist(refUtils.getType({_ref: null}));
        });

        it('should handle basic refs', function() {
            refUtils.getType('/defect/1234').should.eql('defect');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234.js').should.eql('defect');

            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b0493ea74c9abf78069487936c13').should.eql('defect');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql('defect');
            refUtils.getType('/defect/3493b0493ea74c9abf78069487936c13').should.eql('defect');
            refUtils.getType('/defect/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql('defect');
        });

        it('should handle dynatype refs', function() {
            refUtils.getType('/portfolioitem/feature/1234').should.eql('portfolioitem/feature');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234.js').should.eql('portfolioitem/feature');
            
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql('portfolioitem/feature');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b0493ea74c9abf78069487936c13').should.eql('portfolioitem/feature');
            refUtils.getType('/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql('portfolioitem/feature');
            refUtils.getType('/portfolioitem/feature/3493b0493ea74c9abf78069487936c13').should.eql('portfolioitem/feature');
        });

        it('should handle dynatype collection refs', function() {
            refUtils.getType('/portfolioitem/feature/1234/children').should.eql('portfolioitem/feature');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234/children.js').should.eql('portfolioitem/feature');
            
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13/children').should.eql('portfolioitem/feature');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b0493ea74c9abf78069487936c13/children').should.eql('portfolioitem/feature');
            refUtils.getType('/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13/children').should.eql('portfolioitem/feature');
            refUtils.getType('/portfolioitem/feature/3493b0493ea74c9abf78069487936c13/children').should.eql('portfolioitem/feature');
        });

        it('should handle collection refs', function() {
            refUtils.getType('/defect/1234/tasks').should.eql('defect');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234/tasks.js').should.eql('defect');
            
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b0493ea74c9abf78069487936c13/tasks').should.eql('defect');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks').should.eql('defect');
            refUtils.getType('/defect/3493b0493ea74c9abf78069487936c13/tasks').should.eql('defect');
            refUtils.getType('/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks').should.eql('defect');
        });

        it('should handle built-in refs', function() {
            refUtils.getType('/typedefinition/-1234').should.eql('typedefinition');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v2.0/typedefinition/-1234.js').should.eql('typedefinition');
        });

        it('should handle permissions refs', function() {
            refUtils.getType('/projectpermission/1234u5678p1').should.eql('projectpermission');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v2.0/projectpermission/1234u5678p1.js').should.eql('projectpermission');
            refUtils.getType('/workspacepermission/1234u5678w1').should.eql('workspacepermission');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v2.0/workspacepermission/1234u5678w1.js').should.eql('workspacepermission');
            
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/projectpermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql('projectpermission');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/projectpermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql('projectpermission');
            refUtils.getType('/projectpermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql('projectpermission');
            refUtils.getType('/projectpermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql('projectpermission');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/workspacepermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql('workspacepermission');
            refUtils.getType('https://rally1.rallydev.com/slm/webservice/v3.0/workspacepermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql('workspacepermission');
            refUtils.getType('/workspacepermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql('workspacepermission');
            refUtils.getType('/workspacepermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql('workspacepermission');
        });
    });

    describe('#getId', function() {

        it('should handle non-refs', function() {
            should.not.exist(refUtils.getId('blah'));
            should.not.exist(refUtils.getId(''));
            should.not.exist(refUtils.getId(null));
            should.not.exist(refUtils.getId({}));
            should.not.exist(refUtils.getId({_ref: null}));
        });

        it('should handle basic refs', function() {
            refUtils.getId('/defect/1234').should.eql('1234');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234.js').should.eql('1234');
            
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b0493ea74c9abf78069487936c13').should.eql('3493b0493ea74c9abf78069487936c13');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql('3493b049-3ea7-4c9a-bf78-069487936c13');
            refUtils.getId('/defect/3493b0493ea74c9abf78069487936c13').should.eql('3493b0493ea74c9abf78069487936c13');
            refUtils.getId('/defect/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql('3493b049-3ea7-4c9a-bf78-069487936c13');
        });

        it('should handle dynatype refs', function() {
            refUtils.getId('/portfolioitem/feature/1234').should.eql('1234');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234.js').should.eql('1234');
            
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql('3493b049-3ea7-4c9a-bf78-069487936c13');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b0493ea74c9abf78069487936c13').should.eql('3493b0493ea74c9abf78069487936c13');
            refUtils.getId('/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13').should.eql('3493b049-3ea7-4c9a-bf78-069487936c13');
            refUtils.getId('/portfolioitem/feature/3493b0493ea74c9abf78069487936c13').should.eql('3493b0493ea74c9abf78069487936c13');
        });

        it('should handle dynatype collection refs', function() {
            refUtils.getId('/portfolioitem/feature/1234/children').should.eql('1234');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v2.0/portfolioitem/feature/1234/children.js').should.eql('1234');
            
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13/children').should.eql('3493b049-3ea7-4c9a-bf78-069487936c13');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/portfolioitem/feature/3493b0493ea74c9abf78069487936c13/children').should.eql('3493b0493ea74c9abf78069487936c13');
            refUtils.getId('/portfolioitem/feature/3493b049-3ea7-4c9a-bf78-069487936c13/children').should.eql('3493b049-3ea7-4c9a-bf78-069487936c13');
            refUtils.getId('/portfolioitem/feature/3493b0493ea74c9abf78069487936c13/children').should.eql('3493b0493ea74c9abf78069487936c13');
        });

        it('should handle collection refs', function() {
            refUtils.getId('/defect/1234/tasks').should.eql('1234');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v2.0/defect/1234/tasks.js').should.eql('1234');

            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b0493ea74c9abf78069487936c13/tasks').should.eql('3493b0493ea74c9abf78069487936c13');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks').should.eql('3493b049-3ea7-4c9a-bf78-069487936c13');
            refUtils.getId('/defect/3493b0493ea74c9abf78069487936c13/tasks').should.eql('3493b0493ea74c9abf78069487936c13');
            refUtils.getId('/defect/3493b049-3ea7-4c9a-bf78-069487936c13/tasks').should.eql('3493b049-3ea7-4c9a-bf78-069487936c13');
        });

        it('should handle built-in refs', function() {
            refUtils.getId('/typedefinition/-1234').should.eql('-1234');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v2.0/typedefinition/-1234.js').should.eql('-1234');
        });

        it('should handle permissions refs', function() {
            refUtils.getId('/projectpermission/1234u5678p1').should.eql('1234u5678p1');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v2.0/projectpermission/1234u5678p1.js').should.eql('1234u5678p1');
            refUtils.getId('/workspacepermission/1234u5678w1').should.eql('1234u5678w1');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v2.0/workspacepermission/1234u5678w1.js').should.eql('1234u5678w1');
            
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/projectpermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql('1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/projectpermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql('1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1');
            refUtils.getId('/projectpermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql('1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1');
            refUtils.getId('/projectpermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql('1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/workspacepermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql('1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1');
            refUtils.getId('https://rally1.rallydev.com/slm/webservice/v3.0/workspacepermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql('1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1');
            refUtils.getId('/workspacepermission/1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1').should.eql('1637adf808304a489420fb5bdb8575d6u3497d0433ea74c2cbf78069847936c13w1');
            refUtils.getId('/workspacepermission/1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1').should.eql('1637adf8-0830-4a48-9420-fb5bdb8575d6u3497d043-3ea7-4c2c-bf78-069847936c13w1');
        });
    });
});

