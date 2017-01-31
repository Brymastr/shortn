exports.generate = existing => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const characters = 5;
  let code;
  do {
    code = '';
    for(i = 0; i < characters; i++) {
      code += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
  } while(existing.indexOf(code) > -1)
  
  return code;
};