
var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;

var formatMiddleware = require('../lib/middleware');

describe('middleware', function () {

  var app = express();

  app.get('/resource', function (req, res, next) {
    res.body = {
      id: 1,
      data: 'test'
    };
    next();
  });

  it('should format the resource into JSON SCHEMA', function (done) {

    app.get('/resource', formatMiddleware({
      domain: 'http://test.fr',
      name: 'resource'
    }));

    function check(res) {
     expect(res.body).to.eql({
        metas: {
          self: {
            href: 'http://test.fr/resource'
          }
        },
        resource: [{
          href: 'http://test.fr/resource/1',
          id: 1,
          data: 'test'
        }]
      });
    }

    request(app)
    .get('/resource')
    .expect(200)
    .expect(check)
    .end(done);
  });
});
