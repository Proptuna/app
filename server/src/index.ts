import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Serve static files from the client build directory
const clientBuildPath = path.resolve(__dirname, '../../dist/client');
app.use(express.static(clientBuildPath));

// Serve the index.html for any other requests (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
