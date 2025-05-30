const readline = require('readline');
const FileManagerServer = require('../server/FileManagerServer');


class FileManagerCLI {
  constructor(fileManager) {
    this.fileManager = fileManager;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  }

  async start() {
    console.log('=== File Management Tool ===');
    console.log('Available commands:');
    console.log('  create <filename> [content] - Create a new file');
    console.log('  read <filename>            - Read file content');
    console.log('  delete <filename>          - Delete a file');
    console.log('  list                       - List all files');
    console.log('  info <filename>            - Get file information');
    console.log('  server [port]              - Start HTTP server');
    console.log('  help                       - Show this help');
    console.log('  exit                       - Exit the program');
    console.log('');

    this.promptUser();
  }

  promptUser() {
    this.rl.question('file-manager> ', async (input) => {
      const args = input.trim().split(' ');
      const command = args[0].toLowerCase();

      switch (command) {
        case 'create':
          if (args.length < 2) {
            console.log('Usage: create <filename> [content]');
          } else {
            const filename = args[1];
            const content = args.slice(2).join(' ');
            await this.fileManager.createFile(filename, content);
          }
          break;

        case 'read':
          if (args.length < 2) {
            console.log('Usage: read <filename>');
          } else {
            await this.fileManager.readFile(args[1]);
          }
          break;

        case 'delete':
          if (args.length < 2) {
            console.log('Usage: delete <filename>');
          } else {
            await this.fileManager.deleteFile(args[1]);
          }
          break;

        case 'list':
          await this.fileManager.listFiles();
          break;

        case 'info':
          if (args.length < 2) {
            console.log('Usage: info <filename>');
          } else {
            await this.fileManager.getFileInfo(args[1]);
          }
          break;

        case 'server':
          const port = args[1] ? parseInt(args[1]) : 3000;
          const server = new FileManagerServer(this.fileManager, port);
          server.start();
          break;

        case 'help':
          console.log('Available commands:');
          console.log('  create <filename> [content] - Create a new file');
          console.log('  read <filename>            - Read file content');
          console.log('  delete <filename>          - Delete a file');
          console.log('  list                       - List all files');
          console.log('  info <filename>            - Get file information');
          console.log('  server [port]              - Start HTTP server');
          console.log('  help                       - Show this help');
          console.log('  exit                       - Exit the program');
          break;

        case 'exit':
          console.log('Goodbye!');
          this.rl.close();
          return;

        default:
          if (command) {
            console.log(`Unknown command: ${command}. Type 'help' for available commands.`);
          }
          break;
      }

      this.promptUser();
    });
  }
}

module.exports = FileManagerCLI; 