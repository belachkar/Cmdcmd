const _ = require('lodash');
const fs = require('fs');
const git = require('simple-git')();
const CLI = require('clui');
const Spinner = CLI.Spinner;
const touch = require('touch');

const inquirer = require('./inquirer');
const gh = require('./github');
const dbg = require('./utils').debugMsg;
const gitign = require('./gitignore');

module.exports = {
  createRemoteRepo: async () => {
    const answers = await inquirer.askRepoDetails();

    const data = {
      name: answers.name,
      description: answers.description,
      private: (answers.visibility === 'private')
    };

    return await createRepoForAuthenticatedUser(data);

  },
  createGitignore: async () => {
    const filelist = _.without(fs.readdirSync('.'), '.git', '.gitignore', 'node_modules');

    let gitignoreFileContent = '';
    const patterns = _.keys(gitign);
    const defaultGitIgnorAnswers = await inquirer.askIgnoreDefaultFiles(patterns);
    const GitIgnorAnswers = await inquirer.askIgnoreFiles(filelist);
    if (defaultGitIgnorAnswers.ignoreDefault.length) {
      const answers = defaultGitIgnorAnswers.ignoreDefault;
      console.log(answers);
      answers.forEach(answer => {
        gitignoreFileContent += gitign[answer] + '\n\n';
      });
    }
    if (GitIgnorAnswers.ignore.length) gitignoreFileContent += '# Others\n' + GitIgnorAnswers.ignore.join('\n');
    if (gitignoreFileContent) {
      fs.writeFileSync('.gitignore', gitignoreFileContent);
    } else {
      touch('.gitignore');
    }
  },
  setupRepo: async (url) => {
    const status = new Spinner('Initializing local repository and pushing to remote...');
    status.start();

    try {
      await git
        .init()
        .add('.gitignore')
        .add('./*')
        .commit('Initial commit')
        .addRemote('origin', url)
        .push('origin', 'master');
      return true;
    } catch (err) {
      status.stop();
      dbg.err(err);
    } finally {
      status.stop();
    }
  }
};

const createRepoForAuthenticatedUser = async (data) => {
  const status = new Spinner('Creating remote repository...');
  status.start();

  try {
    const github = gh.getInstance();
    const response = await github.repos.createForAuthenticatedUser(data);
    return response.data.clone_url;
  } catch (err) {
    status.stop();
    const errs = err.errors;
    if (errs) {
      if (Array.isArray(errs)) {
        errs.forEach(err => dbg.err(err));
      } else {
        dbg.err(err);
      }
    } else {
      dbg.err(err);
    }
    throw err;
  } finally {
    status.stop();
  }
};
