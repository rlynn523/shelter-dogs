var chai = require('chai');
var mocha = require('mocha');
var chaiHttp = require('chai-http');
var server = require('../server');
var app = server.app;

chai.use(chaiHttp);

describe('Shelter Dog App', function() {
    it('server is on!', function() {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                expect(res).to.have.status(200);
                expect(res).to.be.html;
            });
    });
    it('connect to dashboard page',function() {
        chai.request(app)
        .get('/dashboard.html')
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });
    it('connect to search results page',function() {
        chai.request(app)
        .get('/search-results.html')
        .end(function(err, res) {
            expect(res).to.have.status(200);
            expect(res).to.be.html;
        });
    });
});
