var expect = require('chai').expect;

var getResourceURL = require('../lib/url-utils').getResourceURL;
var parseExpand = require('../lib/url-utils').parseExpand;

describe('url utils', function () {
  describe('#getResourceURL', function () {
    it('should return the absolute url up to the id of the resource', function () {
      expect(getResourceURL('http://test.fr/authors/1', 'authors')).to.eql('http://test.fr/authors');
      expect(getResourceURL('http://test.fr/authors/1/', 'authors')).to.eql('http://test.fr/authors');
    });

    it('should return the same url if there is no resource id', function () {
      expect(getResourceURL('http://test.fr/authors/', 'authors')).to.eql('http://test.fr/authors');
      expect(getResourceURL('http://test.fr/authors', 'authors')).to.eql('http://test.fr/authors');
    });

    it('should return the absolute url up to the query of the resource', function () {
      expect(getResourceURL('http://test.fr/authors/?name=test', 'authors')).to.eql('http://test.fr/authors');
      expect(getResourceURL('http://test.fr/authors?name=test', 'authors')).to.eql('http://test.fr/authors');
    });

    it('should work with camelcase resource name', function () {
      expect(getResourceURL('http://test.fr/article-authors/?name=test', 'articleAuthors'))
      .to.eql('http://test.fr/article-authors');
      expect(getResourceURL('http://test.fr/article-authors?name=test', 'articleAuthors'))
      .to.eql('http://test.fr/article-authors');
    });
  });

  describe('#parseExpand', function () {
    it('should split comma separated values', function () {
      expect(parseExpand('articles.authors,articles.medias'))
      .to.eql(['articles.authors', 'articles.medias']);
    });

    it('should decode query value', function () {
      expect(parseExpand('article.authors%2Cauthors.article'))
      .to.eql(['article.authors', 'authors.article']);
    });
  });
});
