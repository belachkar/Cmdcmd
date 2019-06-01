const inquirer = require('inquirer');
const files = require('./files');

module.exports = {
  askGithubCredentials: () => {
    const questions = [
      {
        name: 'username',
        type: 'input',
        message: 'Enter your github username or e-mail address:',
        validate: (value) => {
          return value.length ? true : false;
        }
      },
      {
        name: 'password',
        type: 'password',
        message: 'Enter your password:',
        validate: (value) => {
          return value.length ? true : 'Please enter your password.';
        }
      }
    ];
    return inquirer.prompt(questions);
  },
  askRepoDetails: () => {
    const argv = require('minimist')(process.argv.slice(2));
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the repository:',
        default: argv._[0] || files.getCurrentDirBase(),
        validate: (value) => {
          return value.length ? true : 'Please enter a name for the repository.';
        }
      },
      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: 'Optionally enter a description of the repository:'
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public or private:',
        choices: ['public', 'private'],
        default: 'public'
      }
    ];
    return inquirer.prompt(questions);
  },
  askIgnoreDefaultFiles: (pattern) => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignoreDefault',
        message: 'Select the pattern you wish to ignore:',
        choices: pattern,
        default: pattern
      }
    ];
    return inquirer.prompt(questions);
  },
  askIgnoreFiles: (filelist) => {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore:',
        choices: filelist,
        // default: ['node_modules', 'bower_components']
      }
    ];
    return inquirer.prompt(questions);
  },
};
