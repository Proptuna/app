import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize SQLite database
let db: Database<sqlite3.Database, sqlite3.Statement>;
async function initializeDatabase(): Promise<void> {
  // Use data directory from environment variable or default location
  const dataDir = process.env.DATA_DIR || process.cwd();
  const dbPath = path.join(dataDir, 'waitlist.db');
    
  db = await open({
    filename: dbPath,
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

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Serve static assets from the client/static directory
app.use('/static', express.static(path.join(__dirname, '../../client/static')));

// Serve files from public directory
const publicPath = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, 'public')
  : path.join(__dirname, 'public');
app.use('/public', express.static(publicPath));

// API routes
app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Hello from server!' });
});

// Waitlist endpoint
app.post('/api/waitlist', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address' });
  }

  try {
    await db.run('INSERT INTO waitlist (email) VALUES (?)', [email]);
    res.json({ message: 'Thank you for joining the waitlist!' });
  } catch (err: unknown) {
    if (err instanceof Error && 'code' in err && err.code === 'SQLITE_CONSTRAINT') {
      return res.status(400).json({ error: 'This email is already on the waitlist' });
    }
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});

// Serve static files from the client build directory
const clientBuildPath = path.resolve(__dirname, '../../dist/client');
app.use(express.static(clientBuildPath));

// Serve the index.html for any other requests (SPA fallback)
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(clientBuildPath, 'index.html'));
});

// Initialize database and start server
initializeDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}).catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
