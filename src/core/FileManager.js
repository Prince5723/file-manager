const fs = require('fs').promises;
const path = require('path');

class FileManager {
  constructor(baseDir = './files') {
    this.baseDir = path.resolve(baseDir);
    this.ensureBaseDirectory();
  }

  async ensureBaseDirectory() {
    try {
      await fs.access(this.baseDir);
    } catch {
      await fs.mkdir(this.baseDir, { recursive: true });
      console.log(`Created base directory: ${this.baseDir}`);
    }
  }

  // Create a new file
  async createFile(filename, content = '') {
    try {
      const filePath = path.join(this.baseDir, filename);
      
      // Check if file already exists
      try {
        await fs.access(filePath);
        throw new Error(`File '${filename}' already exists`);
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
      }

      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✓ File '${filename}' created successfully`);
      return true;
    } catch (err) {
      console.error(`✗ Error creating file: ${err.message}`);
      return false;
    }
  }

  // Read a file
  async readFile(filename) {
    try {
      const filePath = path.join(this.baseDir, filename);
      const content = await fs.readFile(filePath, 'utf8');
      console.log(`\n--- Content of '${filename}' ---`);
      console.log(content);
      console.log(`--- End of '${filename}' ---\n`);
      return content;
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error(`✗ File '${filename}' not found`);
      } else {
        console.error(`✗ Error reading file: ${err.message}`);
      }
      return null;
    }
  }

  // Delete a file
  async deleteFile(filename) {
    try {
      const filePath = path.join(this.baseDir, filename);
      await fs.unlink(filePath);
      console.log(`✓ File '${filename}' deleted successfully`);
      return true;
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error(`✗ File '${filename}' not found`);
      } else {
        console.error(`✗ Error deleting file: ${err.message}`);
      }
      return false;
    }
  }

  // List all files in the base directory
  async listFiles() {
    try {
      const files = await fs.readdir(this.baseDir);
      const fileStats = await Promise.all(
        files.map(async (file) => {
          const filePath = path.join(this.baseDir, file);
          const stats = await fs.stat(filePath);
          return {
            name: file,
            size: stats.size,
            modified: stats.mtime.toLocaleString(),
            isFile: stats.isFile()
          };
        })
      );

      const actualFiles = fileStats.filter(f => f.isFile);
      
      if (actualFiles.length === 0) {
        console.log('No files found in the directory');
        return [];
      }

      console.log('\n--- Files in directory ---');
      actualFiles.forEach(file => {
        console.log(`${file.name} (${file.size} bytes, modified: ${file.modified})`);
      });
      console.log('--- End of file list ---\n');
      
      return actualFiles;
    } catch (err) {
      console.error(`✗ Error listing files: ${err.message}`);
      return [];
    }
  }

  // Get file info
  async getFileInfo(filename) {
    try {
      const filePath = path.join(this.baseDir, filename);
      const stats = await fs.stat(filePath);
      
      const info = {
        name: filename,
        path: filePath,
        size: stats.size,
        created: stats.birthtime.toLocaleString(),
        modified: stats.mtime.toLocaleString(),
        accessed: stats.atime.toLocaleString(),
        isFile: stats.isFile(),
        extension: path.extname(filename)
      };

      console.log(`\n--- File Info for '${filename}' ---`);
      Object.entries(info).forEach(([key, value]) => {
        console.log(`${key}: ${value}`);
      });
      console.log('--- End of file info ---\n');
      
      return info;
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.error(`✗ File '${filename}' not found`);
      } else {
        console.error(`✗ Error getting file info: ${err.message}`);
      }
      return null;
    }
  }
}

module.exports = FileManager; 