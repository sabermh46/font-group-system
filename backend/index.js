const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Initialize dependencies
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
const db = new Database('./db/database.sqlite');
db.exec(fs.readFileSync('./db/init.sql', 'utf-8'));

// App setup
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Dependency injection
app.use('/api/fonts', require('./routes/fonts')(db));
app.use('/api/groups', require('./routes/groups')(db));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));