const FileManager = require('./core/FileManager');
const FileManagerCLI = require('./cli/FileManagerCLI');

// Main execution
if (require.main === module) {
  const fileManager = new FileManager();
  const cli = new FileManagerCLI(fileManager);
  cli.start();
}

module.exports = {
  FileManager,
  FileManagerCLI
}; 