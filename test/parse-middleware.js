
var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;

var parseMiddleware = require('../lib/parse-middleware');

describe('parser middleware', function () {
  var app;

  beforeEach(function () {
    app = express();
  });

  it('should format the JSON SCHEMA resource into a JavaScript object', function (done) {

    app.get('/resource', function (req, res, next) {
      res.body = JSON.stringify({
        metas: {

        },
        resources: [{
          id: 1,
          data: 'test'
        }]
      });
      next();
    });

    app.get('/resource', parseMiddleware({
      name: 'resources'
    }));

    app.get('/resource', function (req, res, next) {
      res.send(res.body);
    });


    function check(res) {
     expect(res.body).to.eql([{
        id: 1,
        data: 'test'
      }]);
    }

    request(app)
    .get('/resource')
    .expect(check)
    .end(done);
  });
});
