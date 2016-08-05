var chai = require('chai');
var mocha = require('mocha');
var chaiHttp = require('chai-http');
var server = require('../server');
var app = server.app;

chai.use(chaiHttp);

describe('name', function() {
    it('server is on!', function() {
        chai.request(app)
            .get('/')
            .end(function(err, res) {
                expect(res).to.have.status(200);
            });
    });
});
