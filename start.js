const winston = require('winston');
const childProcess = require('child_process');
const process = require('process');



const envs = {
  '-d': 'development',
  '-p': 'production',
};

function getEnv() {
  if (process.env.NODE_ENV) {
    winston.info(`NODE_ENV is set as ${process.env.NODE_ENV}`);
    return process.env.NODE_ENV;
  }
  const args = process.argv.slice(0);

  const env = args.pop();
  if (envs[env]) {
    return envs[env];
  }
  return 'production';
}

if (getEnv() === 'development') {
  childProcess.exec('webpack-dev-server --inline --progress --config build/webpack.dev.conf.js', (err, stdout) => {
    if (err) {
      throw err;
    }
    console.log(stdout);
  });
}

process.env.NODE_ENV = getEnv();

require('./server/index.js');
