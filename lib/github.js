const Octokit = require('@octokit/rest');
const Configstore = require('configstore');
const CLI = require('clui');
const Spinner = CLI.Spinner;

const pkg = require('../package.json');
const inquirer = require('./inquirer');
const dbg = require('./utils').debugMsg;

const conf = new Configstore(pkg.name);
let octokit = null;

module.exports = {

  getInstance: () => {
    return octokit;
  },
  getStoredGithubToken: () => {
    return conf.get('github.token');
  },
  githubAuth: (token) => {
    octokit = new Octokit({
      auth: token
    });
  },
  deleteStoredGithubToken: () => {
    conf.delete('github.token');
  },
  setGithubCredentials: async () => {
    try {
      const credentials = await inquirer.askGithubCredentials();
      octokit = new Octokit({
        auth: credentials
      });
      return await registerNewToken();
    } catch (err) {
      dbg.err(err);
    }
  },
};

const registerNewToken = async () => {
  const status = new Spinner('Authenticating you, please wait...');
  status.start();

  try {
    const response = await octokit.oauthAuthorizations.createAuthorization({
      scopes: ['user', 'repo'],
      note: 'Cmdcmd, the command line tool'
    });
    const token = response && response.data && response.data.token ? response.data.token : null;
    if (token) {
      conf.set('github.token', token);
      return token;
    } else {
      throw new Error('Missing token', 'Github token was not found in the response');
    }
  } catch (err) {
    dbg.err(err);
  } finally {
    status.stop();
  }
};
