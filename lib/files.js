const path = require('path');
const fs = require('fs');

module.exports = {
  getCurrentDirBase: () => {
    return path.basename(process.cwd());
  },
  isDirExists: (filePath) => {
    try {
      return fs.statSync(filePath).isDirectory();
    } catch (err) {
      return false;
    }
  }
};
