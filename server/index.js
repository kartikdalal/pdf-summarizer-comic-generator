const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');
const app = express();
const port = 3001;

// Setup CORS to allow requests from our React app
app.use(cors());

// Keep track of connected clients for SSE
const clients = [];

// Serve static files from specified folders
app.use('/files', express.static(path.join(__dirname, '../files')));

// Endpoint to send events when new images are detected
app.get('/api/events', (req, res) => {
  // Set headers for SSE
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  // Write an initial comment to keep the connection alive
  res.write(':\n\n');

  // Add this client to our connected clients
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };
  clients.push(newClient);

  // Remove client when they disconnect
  req.on('close', () => {
    console.log(`Client ${clientId} disconnected`);
    const index = clients.findIndex(client => client.id === clientId);
    if (index !== -1) {
      clients.splice(index, 1);
    }
  });
});

// Endpoint to get the list of images in a specific folder
app.get('/api/images/:folder', (req, res) => {
  const folderPath = path.join(__dirname, '../files', req.params.folder);
  
  try {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
      console.log(`Created folder: ${folderPath}`);
    }

    fs.readdir(folderPath, (err, files) => {
      if (err) {
        console.error('Error reading directory:', err);
        return res.status(500).json({ error: 'Failed to read directory' });
      }
      
      const imageFiles = files.filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'].includes(ext);
      });
      
      const imageUrls = imageFiles.map(file => {
        return `http://localhost:${port}/files/${req.params.folder}/${file}`;
      });
      
      res.json({ images: imageUrls });
    });
  } catch (error) {
    console.error('Error accessing directory:', error);
    res.status(500).json({ error: 'Failed to access directory' });
  }
});

// Setup file watcher for the Mock folder
const watchFolder = path.join(__dirname, '../files/Mock');

// Create the folder if it doesn't exist
if (!fs.existsSync(watchFolder)) {
  fs.mkdirSync(watchFolder, { recursive: true });
  console.log(`Created watch folder: ${watchFolder}`);
}

// Initialize watcher
const watcher = chokidar.watch(watchFolder, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// File watcher events
watcher
  .on('add', path => {
    console.log(`File ${path} has been added`);
    const fileName = path.split('/').pop();
    const ext = fileName.split('.').pop().toLowerCase();
    
    // Only notify about image files
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) {
      const imageUrl = `http://localhost:${port}/files/Mock/${fileName}`;
      notifyClients(imageUrl);
    }
  });

function notifyClients(imageUrl) {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify({ imageUrl })}\n\n`);
  });
}

// Start the server
app.listen(port, () => {
  console.log(`Local file server running at http://localhost:${port}`);
  console.log(`Monitoring folder: ${watchFolder}`);
  console.log('Place image files in this folder to see them in your app');
});
