const chalk = require('chalk');

module.exports = {

  debugMsg: {
    err: (err) => {
      let msg = typeof (err === 'object') && err.message ? err.message : err;
      console.error(chalk.red(`Err: ${msg}`));
    },
    ok: (msg) => {
      console.log(chalk.green(msg));
    },
    info: (msg) => {
      console.log(chalk.blue(msg));
    },
    banner: (msg) => {
      console.log(chalk.yellow(msg));
    }
  }
};
