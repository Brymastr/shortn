const Site = require('./site');
this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
this.characters = 5;

exports.generate = (code, next) => {
  code = make();
  
  Site.find({code: code}, (err, sites) => {
    sites.length > 0 ? this.generate() : next(code);
  });
};

exports.make = () => {
  let code;
  for(i = 0; i < this.characters; i++) {
    code += Math.random() * alphabet.length;
  }
  return code;
}