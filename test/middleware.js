
var request = require('supertest');
var express = require('express');
var expect = require('chai').expect;

var formatMiddleware = require('../lib/middleware');

describe('formatter middleware', function () {
  var app;

  beforeEach(function () {
    app = express();
  });

  it('should format the resource into JSON SCHEMA', function (done) {

    app.get('/resource', function (req, res, next) {
      res.body = {
        id: 1,
        data: 'test'
      };
      next();
    });

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
    .expect(check)
    .end(done);
  });

  it('should format resource with metadata', function (done) {

    app.get('/resource', function (req, res, next) {
      res.body = {
        id: 1,
        data: 'test'
      };
      res.metadata = {
        myMeta: 'data'
      };
      next();
    });

    app.get('/resource', formatMiddleware({
      domain: 'http://test.fr',
      name: 'resource'
    }));

    function check(res) {
     expect(res.body).to.eql({
        metas: {
          myMeta: 'data',
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
    .expect(check)
    .end(done);
  });

  it('should return a json content type', function (done) {
    app.get('/resource', function (req, res, next) {
      res.body = {
        id: 1,
        data: 'test'
      };
      next();
    });

    app.get('/resource', formatMiddleware({
      domain: 'http://test.fr',
      name: 'resource'
    }));

    request(app)
    .get('/resource')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .end(done);

  });

  it('should format resource recursively using withRelated', function (done) {
    app.get('/resource', function (req, res, next) {
      res.body = {
        id: 1,
        data: 'test',
        authors: {
          id: 1
        }
      };
      next();
    });

    app.get('/resource', formatMiddleware({
      domain: 'http://test.fr',
      name: 'resource',
      withRelated: [
        {
        name: 'authors',
        url: 'http://test.fr/authors/'
        }
      ]
    }));

    function check(res) {
     expect(res.body).to.eql({
        metas: {
          self: {
            href: 'http://test.fr/resource'
          }
        },
        links: {
          'resource.authors': 'http://test.fr/authors/{resource.authors}'
        },
        resource: [{
          href: 'http://test.fr/resource/1',
          id: 1,
          data: 'test',
          links: {
            authors: [1]
          }
        }]
      });
    }

    request(app)
    .get('/resource')
    .expect(check)
    .end(done);
  });
});
