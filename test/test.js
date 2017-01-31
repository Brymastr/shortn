const 
  assert = require('assert'),
  should = require('should'),
  shortid = require('../shortid'),
  existing = require('./existing.json');

describe('shortid', function() {
  describe('generate()', function() {

    it('should return a five character code', function() {
      return shortid.generate([])
        .then(code => {
          code.length.should.be.exactly(5);
        });
    });

    it('should always return a unique code given a list of existing codes', function() {
      const promises = [];
      for(let i = 0; i < 1000; i++)
        promises.push(shortid.generate(existing.codes));
      
      return Promise.all(promises)
        .then(codes => {
          let unique = codes.filter((v, i, a) => a.indexOf(v) === i);
          unique.length.should.be.exactly(codes.length);
        });
    });

  });
});