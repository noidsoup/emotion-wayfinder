const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const process = require('process');
const config = require('config');
const http = require('http');
const debug = require('debug')('server:server');
const winston = require('winston');

/**
 * Initialize basic setup.
 */
const app = express();
//begin helmet specific
app.use(helmet());
app.use(helmet.referrerPolicy());
app.use(helmet.expectCt());
//end helmet specific
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/**
 * Get port from environment and store in Express.
 */
const port = config.get('port');
app.set('port', port);

/**
 * Setup route logic.
 */
app.post('/registration', require('./routes/registration'));

/**
 * Potentially for use in production
 */

if (process.env.NODE_ENV === 'production') {
  const router = express.Router();
  app.use(express.static(`${__dirname}/dist`)); // set the static files location for the static html
  app.engine('.html', require('ejs').renderFile);
  app.set('views', `${__dirname}/dist`);
  router.get('/*', (req, res, next) => { res.sendFile(`${__dirname}/dist/index.html`); });
  app.use('/', router);
}

/**
 * Clock logic.
 */
const server = http.createServer(app);

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${addr.port}`;


  debug(`Listening on ${bind}`);
}
server.on('listening', onListening);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, (err) => {
  if (err) {
    throw err;
  }
  winston.info(`App running in ${process.env.NODE_ENV || 'none'} mode on port ${port}`);
});
