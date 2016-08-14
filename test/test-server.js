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
    it('connect to search pets page', function(done) {
        chai.request(app)
            .get('/search-pets.html')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
    it('connect to search shelters page', function(done) {
        chai.request(app)
            .get('/search-shelters.html')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.html;
                done();
            });
    });
});

describe('Testing Routes', function() {
    // need to create function to clean after running tests
    before(function(done) {
        // change to use promises
        Breed.create({
            name: 'black lab'
        }, function() {
            Shelter.create({
                name: 'Pitt Pups',
                address: '123 Rango Lane',
                email: 'rangorocks@gmail.com'
            }, function() {
                Profile.create({
                    name: 'rango',
                    breed: 'cattle dog',
                    age: 'young',
                    description: 'male',
                }, function() {
                    done();
                });
            });
        });
    });
    after(function(done) {
        Breed.remove(function() {
            Shelter.remove(function() {
                Profile.remove(function() {
                    done();
                });
            });
        });
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
                res.body[0].should.have.property('address');
                res.body[0].should.have.property('email');
                res.body[0].name.should.be.a('string');
                res.body[0].address.should.be.a('string');
                res.body[0].email.should.be.a('string');
                done();
            });
    });
    it('POST route for saved SHELTERS', function(done) {
        chai.request(app)
            .post('/shelters')
            .send({
                'name': 'SPCA',
                'address': '123 Rango Lane',
                'email': 'rangorocks@gmail.com'
            })
            .end(function(err, res) {
                res.should.be.json;
                res.should.have.status(201);
                res.body.should.be.a('object');
                res.body.name.should.equal('SPCA');
                res.body.address.should.equal('123 Rango Lane');
                res.body.email.should.equal('rangorocks@gmail.com');
                res.body.name.should.be.a('string');
                res.body.address.should.be.a('string');
                res.body.email.should.be.a('string');
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
                res.body[0].should.have.property('description');
                res.body[0].name.should.be.a('string');
                res.body[0].breed.should.be.a('string');
                res.body[0].age.should.be.a('string');
                res.body[0].description.should.be.a('string');
                done();
            });
    });
    it('POST route for saved PROFILES', function(done) {
        chai.request(app)
            .post('/profiles')
            .send({
                name: 'rango',
                breed: 'cattle dog',
                age: 'young',
                description: 'male'
            })
            .end(function(err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.name.should.equal('rango');
                res.body.breed.should.equal('cattle dog');
                res.body.age.should.equal('young');
                res.body.description.should.equal('male');
                res.body.name.should.be.a('string');
                res.body.breed.should.be.a('string');
                res.body.age.should.be.a('string');
                res.body.description.should.be.a('string');
                done();
            });
    });
    it('DELETE route for saved PROFILES', function(done) {
        chai.request(app)
            .get('/profiles')
            .end(function(err, res) {
                chai.request(app)
                    .delete('/profiles/' + res.body[0]._id)
                    .end(function(err, res) {
                        res.should.be.json;
                        res.should.have.status(200);
                        res.body.should.be.a('object');
                        done();
                    });
            });
    });
});