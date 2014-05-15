var expect = require('chai').expect;

var getResourceURL = require('../lib/url-utils').getResourceURL;

describe('#url', function () {
  it('should return the absolute url up to the id of the resource', function () {
    expect(getResourceURL('http://test.fr/authors/1', 'authors')).to.eql('http://test.fr/authors/');
    expect(getResourceURL('http://test.fr/authors/1/', 'authors')).to.eql('http://test.fr/authors/');
  });

  it('should return the same url if there is no resource id', function () {
    expect(getResourceURL('http://test.fr/authors/', 'authors')).to.eql('http://test.fr/authors/');
    expect(getResourceURL('http://test.fr/authors', 'authors')).to.eql('http://test.fr/authors/');
  });

  it('should return the absolute url up to the query of the resource', function () {
    expect(getResourceURL('http://test.fr/authors/?name=test', 'authors')).to.eql('http://test.fr/authors/');
    expect(getResourceURL('http://test.fr/authors?name=test', 'authors')).to.eql('http://test.fr/authors/');
  });
});
