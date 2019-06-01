module.exports = {
  compiledOutput: `# compiled output
/dist
/tmp
/out-tsc`,
  dependencies: `# dependencies
/node_modules
/bower_components`,
  profilingFiles: `# profiling files
chrome-profiler-events.json
speed-measure-plugin.json`,
  IDEsAndEditors: `# IDEs and editors
/.idea
.project
.classpath
.c9/
*.launch
.settings/
*.sublime-workspace`,
  IDE_VSCode: `# IDE - VSCode
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.history/*`,
  misc: `# misc
/.sass-cache
/connect.lock
/coverage
/libpeerconnection.log
npm-debug.log
yarn-error.log
testem.log
/typings`,
  systemFiles: `# System Files
.DS_Store
Thumbs.db`,
  firebase: `#firebase
.firebase*
firebase*`
};
