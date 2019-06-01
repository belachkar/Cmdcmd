#!/usr/bin/env node
const clear = require('clear');
const figlet = require('figlet');

const github = require('./lib/github');
const files = require('./lib/files');
const repo = require('./lib/repo');
const dbg = require('./lib/utils').debugMsg;

clear();

dbg.banner(
  figlet.textSync('Cmdcmd', { horizontalLayout: 'full' })
);

if (files.isDirExists('.git')) {
  dbg.err('Already a git repository!');
  process.exit();
}

const run = async () => {
  try {
    let token = await getGithubToken();
    github.githubAuth(token);

    // Create remote repository
    const url = await repo.createRemoteRepo();

    // Create .gitignore file
    await repo.createGitignore();

    // Set up local repository and push to remote
    const done = await repo.setupRepo(url);
    if (done) {
      dbg.ok('All done!');
    }
  } catch (err) {
    dbg.err(err);
  }
};

const getGithubToken = async () => {

  // Fetch token from config store
  let token = github.getStoredGithubToken();
  return token ? token : await github.setGithubCredentials();
};

run();
