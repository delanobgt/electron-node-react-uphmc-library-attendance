const bcrypt = require("bcryptjs");

module.exports.compare = (password, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

module.exports.genSalt = rounds => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(rounds, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};

module.exports.hash = (password, saltRound) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRound, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
};
