const http = require('http');
const url = require('url');

class FileManagerServer {
  constructor(fileManager, port = 3000) {
    this.fileManager = fileManager;
    this.port = port;
  }

  start() {
    const server = http.createServer(async (req, res) => {
      const parsedUrl = url.parse(req.url, true);
      const { pathname, query } = parsedUrl;

      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      try {
        if (req.method === 'GET' && pathname === '/') {
          // Serve a simple HTML interface
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(this.getHtmlInterface());
        } else if (req.method === 'GET' && pathname === '/files') {
          // List files
          const files = await this.fileManager.listFiles();
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ files }));
        } else if (req.method === 'GET' && pathname === '/file' && query.name) {
          // Read file
          const content = await this.fileManager.readFile(query.name);
          if (content !== null) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ content, filename: query.name }));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'File not found' }));
          }
        } else if (req.method === 'POST' && pathname === '/file') {
          // Create file
          let body = '';
          req.on('data', chunk => body += chunk);
          req.on('end', async () => {
            try {
              const { filename, content } = JSON.parse(body);
              const success = await this.fileManager.createFile(filename, content);
              res.writeHead(success ? 201 : 400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ success }));
            } catch (err) {
              res.writeHead(400, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Invalid JSON' }));
            }
          });
        } else if (req.method === 'DELETE' && pathname === '/file' && query.name) {
          // Delete file
          const success = await this.fileManager.deleteFile(query.name);
          res.writeHead(success ? 200 : 404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Not found' }));
        }
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    });

    server.listen(this.port, () => {
      console.log(`File Manager Server running at http://localhost:${this.port}`);
    });

    return server;
  }

  getHtmlInterface() {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>File Manager Pro</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            line-height: 1.6;
        }

        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
            overflow: hidden;
            animation: slideUp 0.8s ease-out;
        }

        @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .header {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            color: white;
            padding: 32px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 8px;
            position: relative;
            z-index: 1;
        }

        .header p {
            opacity: 0.9;
            font-size: 1.1rem;
            position: relative;
            z-index: 1;
        }

        .content {
            padding: 32px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 24px;
        }

        .section {
            background: white;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
            border: 1px solid rgba(0, 0, 0, 0.05);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, #667eea, #764ba2);
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .section:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
        }

        .section:hover::before {
            opacity: 1;
        }

        .section h3 {
            color: #2d3748;
            font-size: 1.4rem;
            font-weight: 600;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .files-section {
            grid-column: 1 / -1;
        }

        .form-group {
            margin-bottom: 20px;
        }

        .form-group label {
            display: block;
            margin-bottom: 8px;
            color: #4a5568;
            font-weight: 500;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        input, textarea, button {
            font-family: inherit;
            border: 2px solid #e2e8f0;
            border-radius: 12px;
            padding: 12px 16px;
            font-size: 1rem;
            transition: all 0.3s ease;
            width: 100%;
            outline: none;
        }

        input:focus, textarea:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            transform: translateY(-1px);
        }

        textarea {
            height: 120px;
            resize: vertical;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
        }

        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        button:active {
            transform: translateY(0);
        }

        .btn-secondary {
            background: #718096;
            color: white;
            padding: 8px 16px;
            font-size: 0.9rem;
            margin: 0 4px;
            width: auto;
            display: inline-block;
        }

        .btn-danger {
            background: linear-gradient(135deg, #e53e3e 0%, #c53030 100%);
        }

        .btn-success {
            background: linear-gradient(135deg, #38a169 0%, #2f855a 100%);
        }

        .file-list {
            list-style: none;
            padding: 0;
            max-height: 400px;
            overflow-y: auto;
        }

        .file-list::-webkit-scrollbar {
            width: 6px;
        }

        .file-list::-webkit-scrollbar-track {
            background: #f7fafc;
            border-radius: 3px;
        }

        .file-list::-webkit-scrollbar-thumb {
            background: #cbd5e0;
            border-radius: 3px;
        }

        .file-item {
            padding: 16px;
            margin: 8px 0;
            background: #f7fafc;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.3s ease;
            border: 2px solid transparent;
        }

        .file-item:hover {
            background: #edf2f7;
            border-color: #e2e8f0;
            transform: translateX(4px);
        }

        .file-info {
            flex: 1;
        }

        .file-name {
            font-weight: 600;
            color: #2d3748;
            font-size: 1.1rem;
            margin-bottom: 4px;
        }

        .file-meta {
            color: #718096;
            font-size: 0.9rem;
        }

        .file-actions {
            display: flex;
            gap: 8px;
        }

        .result-message {
            margin-top: 16px;
            padding: 12px 16px;
            border-radius: 8px;
            font-weight: 500;
            animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .error {
            background: #fed7d7;
            color: #c53030;
            border: 1px solid #feb2b2;
        }

        .success {
            background: #c6f6d5;
            color: #2f855a;
            border: 1px solid #9ae6b4;
        }

        .file-content {
            background: #1a202c;
            color: #e2e8f0;
            padding: 20px;
            border-radius: 12px;
            font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
            font-size: 0.9rem;
            line-height: 1.6;
            max-height: 300px;
            overflow-y: auto;
            margin-top: 16px;
            border: 2px solid #2d3748;
        }

        .file-content::-webkit-scrollbar {
            width: 8px;
        }

        .file-content::-webkit-scrollbar-track {
            background: #2d3748;
            border-radius: 4px;
        }

        .file-content::-webkit-scrollbar-thumb {
            background: #4a5568;
            border-radius: 4px;
        }

        .empty-state {
            text-align: center;
            padding: 40px;
            color: #718096;
        }

        .empty-state svg {
            width: 64px;
            height: 64px;
            margin-bottom: 16px;
            opacity: 0.5;
        }

        .loading {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 2px solid #e2e8f0;
            border-radius: 50%;
            border-top-color: #667eea;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
            .content {
                grid-template-columns: 1fr;
                padding: 20px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .file-item {
                flex-direction: column;
                align-items: flex-start;
                gap: 12px;
            }
            
            .file-actions {
                width: 100%;
                justify-content: flex-end;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>File Manager Pro</h1>
            <p>Manage your files efficiently</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h3>Create File</h3>
                <div class="form-group">
                    <label for="createFilename">Filename</label>
                    <input type="text" id="createFilename" placeholder="e.g. -  myfile.txt">
                </div>
                <div class="form-group">
                    <label for="createContent">Content (Optional)</label>
                    <textarea id="createContent" placeholder="Enter your file content here..."></textarea>
                </div>
                <button onclick="createFile()"> Create File</button>
                <div id="createResult"></div>
            </div>

            <div class="section">
                <h3>Read File</h3>
                <div class="form-group">
                    <label for="readFilename">Filename</label>
                    <input type="text" id="readFilename" placeholder="Enter filename to read">
                </div>
                <button onclick="readFile()">Read File</button>
                <pre id="fileContent" class="file-content" style="display: none;"></pre>
            </div>

            <div class="section files-section">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3>Your Files</h3>
                    <button onclick="listFiles()" class="btn-secondary">Refresh</button>
                </div>
                <ul id="fileList" class="file-list">
                    <li class="empty-state">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                        <p>No files found. Create your first file!</p>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <script>
        let isLoading = false;

        function showLoading(buttonId) {
            const button = document.getElementById(buttonId) || event.target;
            const originalText = button.innerHTML;
            button.innerHTML = '<span class="loading"></span> Loading...';
            button.disabled = true;
            return originalText;
        }

        function hideLoading(button, originalText) {
            button.innerHTML = originalText;
            button.disabled = false;
        }

        async function createFile() {
            const filename = document.getElementById('createFilename').value.trim();
            const content = document.getElementById('createContent').value;
            const result = document.getElementById('createResult');
            const button = event.target;
            
            if (!filename) {
                result.innerHTML = '<div class="result-message error">Please enter a filename</div>';
                return;
            }

            const originalText = showLoading();
            
            try {
                const response = await fetch('/file', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename, content })
                });
                const data = await response.json();
                
                if (data.success) {
                    result.innerHTML = '<div class="result-message success">File created successfully!</div>';
                    document.getElementById('createFilename').value = '';
                    document.getElementById('createContent').value = '';
                    setTimeout(() => listFiles(), 500);
                } else {
                    result.innerHTML = '<div class="result-message error">Failed to create file</div>';
                }
            } catch (err) {
                result.innerHTML = '<div class="result-message error">Error: ' + err.message + '</div>';
            } finally {
                hideLoading(button, originalText);
            }
        }

        async function listFiles() {
            const fileList = document.getElementById('fileList');
            
            try {
                fileList.innerHTML = '<li class="empty-state"><div class="loading"></div><p>Loading files...</p></li>';
                
                const response = await fetch('/files');
                const data = await response.json();
                
                if (data.files && data.files.length > 0) {
                    fileList.innerHTML = data.files.map(file => 
                        \`<li class="file-item">
                            <div class="file-info">
                                <div class="file-name">\${file.name}</div>
                                <div class="file-meta">\${file.size} bytes Modified: \${file.modified}</div>
                            </div>
                            <div class="file-actions">
                                <button onclick="readFileByName('\${file.name}')" class="btn-secondary btn-success">Read</button>
                                <button onclick="deleteFile('\${file.name}')" class="btn-secondary btn-danger">Delete</button>
                            </div>
                        </li>\`
                    ).join('');
                } else {
                    fileList.innerHTML = \`
                        <li class="empty-state">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                            </svg>
                            <p>No files found. Create your first file!</p>
                        </li>
                    \`;
                }
            } catch (err) {
                fileList.innerHTML = '<li class="empty-state"><p>Error loading files: ' + err.message + '</p></li>';
            }
        }

        async function readFile() {
            const filename = document.getElementById('readFilename').value.trim();
            if (!filename) {
                alert('Please enter a filename');
                return;
            }
            readFileByName(filename);
        }

        async function readFileByName(filename) {
            const contentDiv = document.getElementById('fileContent');
            
            try {
                contentDiv.style.display = 'block';
                contentDiv.textContent = 'Loading file content...';
                
                const response = await fetch(\`/file?name=\${encodeURIComponent(filename)}\`);
                const data = await response.json();
                
                if (response.ok) {
                    contentDiv.textContent = data.content || '(Empty file)';
                } else {
                    contentDiv.textContent = 'Error: ' + data.error;
                    contentDiv.style.background = '#fed7d7';
                    contentDiv.style.color = '#c53030';
                }
            } catch (err) {
                contentDiv.textContent = 'Error: ' + err.message;
                contentDiv.style.background = '#fed7d7';
                contentDiv.style.color = '#c53030';
            }
        }

        async function deleteFile(filename) {
            if (!confirm(\`Are you sure you want to delete '\${filename}'?\n\nThis action cannot be undone.\`)) return;
            
            try {
                const response = await fetch(\`/file?name=\${encodeURIComponent(filename)}\`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                
                if (data.success) {
                    // Show success message briefly
                    const tempDiv = document.createElement('div');
                    tempDiv.className = 'result-message success';
                    tempDiv.innerHTML = 'File deleted successfully!';
                    tempDiv.style.position = 'fixed';
                    tempDiv.style.top = '20px';
                    tempDiv.style.right = '20px';
                    tempDiv.style.zIndex = '1000';
                    document.body.appendChild(tempDiv);
                    
                    setTimeout(() => {
                        document.body.removeChild(tempDiv);
                    }, 3000);
                    
                    listFiles();
                } else {
                    alert('Failed to delete file');
                }
            } catch (err) {
                alert('Error: ' + err.message);
            }
        }

        // Load files on page load
        document.addEventListener('DOMContentLoaded', () => {
            listFiles();
        });

        // Auto-clear messages after 5 seconds
        setInterval(() => {
            const messages = document.querySelectorAll('.result-message');
            messages.forEach(msg => {
                if (msg.parentNode) {
                    msg.style.opacity = '0';
                    setTimeout(() => {
                        if (msg.parentNode) msg.parentNode.removeChild(msg);
                    }, 300);
                }
            });
        }, 5000);
    </script>
</body>
</html>
    `;
  }
}

module.exports = FileManagerServer;