var chai = require('chai');
var mocha = require('mocha');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var app = server.app;

var Breed = require('../models/breeds.js');
var Shelter = require('../models/shelters.js');
var Profile = require('../models/profiles.js');

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
    it('connect to dashboard page', function(done) {
        chai.request(app)
            .get('/dashboard.html')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
    it('connect to search results page', function(done) {
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
    Breed.create({
        name: 'black lab'
    });
    Shelter.create({
        name: 'Pitt Pups'
    });
    Profile.create({
        name: 'rango',
        breed: 'cattle dog',
        age: 'young',
        sex: 'male',
        shelter: 'south hills resort'
    });
    it('GET route for saved BREEDS', function(done) {
        chai.request(app)
            .get('/breeds')
            .end(function(err, res) {
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                done();
            });
    });
    it('POST route for saved BREEDS', function(done) {
        chai.request(app)
            .post('/breeds')
            .send({
                'name': 'cattle dog'
            })
            .end(function(err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.name.should.equal('cattle dog');
                res.body.name.should.be.a('string');
                done();
            });
    });
    it('DELETE route for saved BREEDS', function(done) {
        chai.request(app)
            .get('/breeds')
            .end(function(err, res) {
                chai.request(app)
                    .delete('/breeds/' + res.body[0]._id)
                    .end(function(err, res) {
                        res.should.be.json;
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        done();
                    });
            });
    });
    it('GET route for saved SHELTERS', function(done) {
        chai.request(app)
            .get('/shelters')
            .end(function(err, res) {
                res.should.be.json;
                res.body.should.be.a('array');
                res.body[0].should.be.a('object');
                res.body[0].should.have.property('name');
                res.body[0].name.should.be.a('string');
                done();
            });
    });
    it('POST route for saved SHELTERS', function(done) {
        chai.request(app)
            .post('/shelters')
            .send({
                'name': 'SPCA'
            })
            .end(function(err, res) {
                res.should.be.json;
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.name.should.equal('SPCA');
                res.body.name.should.be.a('string');
                done();
            });
    });
    it('DELETE route for saved SHELTERS', function(done) {
        chai.request(app)
            .get('/breeds')
            .end(function(err, res) {
                chai.request(app)
                    .delete('/shelters/' + res.body[0]._id)
                    .end(function(err, res) {
                        res.should.be.json;
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        done();
                    });
            });
    });
    it('GET route for saved PROFILES', function(done) {
        chai.request(app)
            .get('/profiles')
            .end(function(err, res) {
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
