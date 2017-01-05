const Site = require('./Site');
this.alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
this.characters = 5;

exports.generate = existing => {
  let code;
  do {
    code = '';
    for(i = 0; i < this.characters; i++) {
      code += this.alphabet[Math.floor(Math.random() * this.alphabet.length)];
    }
  } while(existing.indexOf(code) > -1)
  
  return code;
};