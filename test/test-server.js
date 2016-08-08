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

describe('Testing Routes', function() {
    it('GET route for saved breeds', function(done) {
        chai.request(app)
        .get('/breeds')
        .end(function(err, res){
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('name');
            res.body[0].name.should.be.a('string');
            done();
        });
    });
    it('GET route for saved shelters', function(done) {
        chai.request(app)
        .get('/shelters')
        .end(function(err, res){
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('name');
            res.body[0].name.should.be.a('string');
            done();
        });
    });
    it('GET route for saved profiles', function(done) {
        chai.request(app)
        .get('/profiles')
        .end(function(err, res){
            res.should.be.json;
            res.body.should.be.a('array');
            res.body[0].should.be.a('object');
            res.body[0].should.have.property('name');
            res.body[0].should.have.property('breed');
            res.body[0].should.have.property('age');
            res.body[0].should.have.property('sex');
            res.body[0].should.have.property('shelter');
            res.body[0].name.should.be.a('string');
            res.body[0].breed.should.be.a('string');
            res.body[0].age.should.be.a('string');
            res.body[0].sex.should.be.a('string');
            res.body[0].shelter.should.be.a('string');
            done();
        });
    });
});
