var expect = require('chai').expect;

var parse = require('../lib/parser');

describe('JSON Schema parser', function () {
  describe('#parse', function () {
    var data, options;

    beforeEach(function () {
      data = {
        resources: [{
          id: 2,
          test: 1,
          value: 'test'
        }]
      };

      options = {
        body: JSON.stringify(data),
        name: 'resources'
      };
    });

    it('should turn a JSON Schema string into a Javascript Object', function () {
      parse(options, function (err, resource) {
        expect(resource).to.eql([{
          id: 2,
          test: 1,
          value: 'test'
        }]);
      });
    });
  });
});

