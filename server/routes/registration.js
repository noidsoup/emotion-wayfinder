const config = require('config');
const winston = require('winston');

const registration = (req, res, next) => {
  return winston.info(req);
};

module.exports = registration;
