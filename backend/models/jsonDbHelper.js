const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/local_db.json');

function readDB() {
  if (!fs.existsSync(path.dirname(dbPath))) {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], tasks: [], notes: [] }, null, 2));
  }
  try {
    const content = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(content || '{"users":[],"tasks":[],"notes":[]}');
  } catch (error) {
    console.error('Error reading JSON DB, resetting...', error);
    return { users: [], tasks: [], notes: [] };
  }
}

function writeDB(data) {
  try {
    if (!fs.existsSync(path.dirname(dbPath))) {
      fs.mkdirSync(path.dirname(dbPath), { recursive: true });
    }
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing JSON DB:', error);
  }
}

module.exports = {
  readDB,
  writeDB
};
