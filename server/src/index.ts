import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Initialize SQLite database
let db;
async function initializeDatabase() {
  db = await open({
    filename: './waitlist.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS waitlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Serve static assets from the client/static directory
app.use('/static', express.static(path.join(__dirname, '../../client/static')));

// Serve files from public directory
app.use('/public', express.static(path.join(__dirname, 'public')));

// API routes
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Waitlist endpoint
app.post('/api/waitlist', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  try {
    await db.run('INSERT INTO waitlist (email) VALUES (?)', [email]);
    res.json({ message: 'Thank you for joining the waitlist!' });
  } catch (err) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'This email is already on the waitlist' });
    }
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Serve static files from the client build directory
const clientBuildPath = path.resolve(__dirname, '../../dist/client');
app.use(express.static(clientBuildPath));

// Serve the index.html for any other requests (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
