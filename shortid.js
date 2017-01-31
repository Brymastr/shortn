exports.generate = existing => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const characters = 5;
  let code;
  return new Promise((fulfill, reject) => {
    do {
      code = '';
      for(let i = 0; i < characters; i++)
        code += alphabet[Math.floor(Math.random() * alphabet.length)];
    } while(existing.indexOf(code) > -1);
    code ? fulfill(code) : reject();
  });
};