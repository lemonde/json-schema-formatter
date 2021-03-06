var expect = require('chai').expect;

var format = require('../lib/formatter').format;

describe('JSON Schema formatter', function () {
  describe('#format', function () {
    var data, options;

    beforeEach(function () {
      data = [{
        id: 2,
        test: 1,
        value: 'test'
      }];

      options = {
        body: data,
        url: 'http://domain/test/',
        name: 'test'
      };
    });

    it('should return a JSON schema string from a resource object', function () {
      format(options, function (err, resource) {
        expect(JSON.parse(resource)).to.eql({
          metas: {
            self: {
              href: 'http://domain/test/'
            }
          },
          test: [{
            id: 2,
            test: 1,
            value: 'test',
            href: 'http://domain/test/2'
          }]
        });
      });
    });

    it('should return unencoded urls', function () {

      options.url = 'http://domain/test/?test=1%2C2';

      format(options, function (err, resource) {
        expect(JSON.parse(resource)).to.eql({
          metas: {
            self: {
              href: 'http://domain/test/?test=1,2'
            }
          },
          test: [{
            id: 2,
            test: 1,
            value: 'test',
            href: 'http://domain/test/2'
          }]
        });
      });
    });

    it('should return a JSON schema string from a resource object without trailing slash', function () {

      options.url = 'http://domain/test',

      format(options, function (err, resource) {
        expect(JSON.parse(resource)).to.eql({
          metas: {
            self: {
              href: 'http://domain/test'
            }
          },
          test: [{
            id: 2,
            test: 1,
            value: 'test',
            href: 'http://domain/test/2'
          }]
        });
      });
    });

    it('should return a JSON schema object with a resource url with an id', function () {

      options.url = 'http://domain/test/1';

      format(options, function (err, resource) {
        expect(JSON.parse(resource)).to.eql({
          metas: {
            self: {
              href: 'http://domain/test/1'
            }
          },
          test: [{
            id: 2,
            test: 1,
            value: 'test',
            href: 'http://domain/test/2'
          }]
        });
      });
    });

    it('should normalize single resource into array', function () {

      options.url = 'http://domain/test/';
      options.body = 'should be array';

      format(options, function (err, resource) {
        expect(JSON.parse(resource).test)
        .to.eql(['should be array']);
      });
    });

    it('should format provided metadata', function () {
      options.metadata = { myMeta: 'data' };
      format(options, function (err, resource) {
        expect(JSON.parse(resource).metas).to.eql({
          self: {
            href: 'http://domain/test/'
          },
          myMeta: 'data'
        });
      });

    });

    it('should convert a null body to an empty array', function () {
      options.body = null;
      format(options, function (err, resource) {
        expect(JSON.parse(resource).test).to.eql([]);
      });
    });

    it('should format related resources recursively', function () {
      options.withRelated = [
        {
          name: 'authors',
          url: 'http://domain/authors/'
        }
      ];
      options.body = [{
        id: 2,
        test: 1,
        value: 'test',
        authors: {
          id: 1
        }
      }];
      format(options, function (err, resource) {
        expect(JSON.parse(resource)).to.eql({
          metas: {
            self: {
              href: 'http://domain/test/'
            }
          },
          links: {
            'test.authors': {
              href: 'http://domain/authors/{test.authors}'
            }
          },
          test: [{
            id: 2,
            test: 1,
            value: 'test',
            href: 'http://domain/test/2',
            links: {
              authors: [1]
            }
          }]
        });
      });
    });
    it('should be able to expand related resources', function () {
      options.withRelated = [
        {
          name: 'authors',
          url: 'http://domain/authors/',
          expand: true
        }
      ];
      options.body = [{
        id: 2,
        test: 1,
        value: 'test',
        authors: {
          id: 1
        }
      }];
      format(options, function (err, resource) {
        expect(JSON.parse(resource)).to.eql({
          metas: {
            self: {
              href: 'http://domain/test/'
            }
          },
          links: {
            'test.authors': {
              href: 'http://domain/authors/{test.authors}'
            }
          },
          test: [{
            id: 2,
            test: 1,
            value: 'test',
            href: 'http://domain/test/2',
            links: {
              authors: [{
                id: 1,
                href: 'http://domain/authors/1'
              }]
            }
          }]
        });
      });
    });
  });

});
