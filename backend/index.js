const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Create uploads folder if missing
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');

// Init DB
const db = new Database('./db/database.sqlite');
const initSql = fs.readFileSync('./db/init.sql', 'utf-8');
db.exec(initSql);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/fonts', require('./routes/fonts')(db));
app.use('/api/groups', require('./routes/groups')(db));

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
