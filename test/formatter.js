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

      expect(JSON.parse((format(options)))).to.eql({
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

    it('should return a JSON schema string from a resource object without trailing slash', function () {

      options.url = 'http://domain/test',

      expect(JSON.parse((format(options)))).to.eql({
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

    it('should return a JSON schema object with a resource url with an id', function () {

      options.url = 'http://domain/test/1';

      expect(JSON.parse((format(options)))).to.eql({
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

    it('should normalize single resource into array', function () {

      options.url = 'http://domain/test/';
      options.body = 'should be array';

      expect(JSON.parse((format(options))).test)
      .to.eql(['should be array']);
    });

    it('should format provided metadata', function () {
      options.metadata = { myMeta: 'data' };
      expect(JSON.parse((format(options))).metas).to.eql({
        self: {
          href: 'http://domain/test/'
        },
        myMeta: 'data'
      });

    });
  });
});
