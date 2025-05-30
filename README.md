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

## Output

Terminal - 

<img width="1107" alt="Screenshot 2025-05-30 at 9 28 59 PM" src="https://github.com/user-attachments/assets/8a20a8a6-f91d-4c0e-a488-1cea7fbe9441" />

Browser - 

<img width="1375" alt="Screenshot 2025-05-30 at 9 28 27 PM" src="https://github.com/user-attachments/assets/1e904e6a-ba3f-4ccb-a5cc-473ff24774d9" />


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
