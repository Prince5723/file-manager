# File System Manager

A command-line and web-based file management system built with Node.js.

## Features

- Create, read, and delete files
- List all files in the directory
- Get detailed file information
- Web interface for file management
- Command-line interface for file operations

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd file-manager
```

## Usage

### Command Line Interface

Start the CLI:
```bash
npm start
```

Available commands:
- `create <filename> [content]` - Create a new file
- `read <filename>` - Read file content
- `delete <filename>` - Delete a file
- `list` - List all files
- `info <filename>` - Get file information
- `server [port]` - Start HTTP server (default port: 3000)
- `help` - Show help
- `exit` - Exit the program

### Web Interface

Start the web server:
```bash
npm start
server 3000
```

Then open your browser and navigate to `http://localhost:3000`

## Project Structure

```
file-system/
├── src/
│   ├── core/
│   │   └── FileManager.js
│   ├── server/
│   │   └── FileManagerServer.js
│   ├── cli/
│   │   └── FileManagerCLI.js
│   └── index.js
├── package.json
└── README.md
```

## License

ISC 