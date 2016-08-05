var chai = require('chai');
var mocha = require('mocha');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var app = server.app;

chai.use(chaiHttp);

describe('Shelter Dog App', function() {
    it('server is on!', function(done) {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
    it('connect to dashboard page',function(done) {
        chai.request(app)
        .get('/dashboard.html')
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });
    it('connect to search results page',function(done) {
        chai.request(app)
        .get('/search-results.html')
        .end(function(err, res) {
            res.should.have.status(200);
            res.should.be.html;
            done();
        });
    });
});
