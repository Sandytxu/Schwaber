const db = require('./db');
const bcrypt = require('bcryptjs');

// 🔹 Buscar usuario por username
function findUserByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
}

// 🔹 Crear nuevo usuario
function createUser(username, passwordPlain) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(passwordPlain, salt);

    const stmt = db.prepare(`
    INSERT INTO users (username, password_hash)
    VALUES (?, ?)
  `);

    const info = stmt.run(username, passwordHash);
    return info.lastInsertRowid;
}

// Traer calendario principal del usuario
function findCalendarByUserID(userID) {
    const stmt = db.prepare('SELECT * FROM calendars WHERE user_id = ? ORDER BY id LIMIT 1');
    return stmt.get(userID);
}
function createDefaultCalendarForUser(userID) {
    const insertCal = db.prepare('INSERT INTO calendars (user_id,name,description) VALUES (?,?,?)');//Faltaría ver cómo meter la time zone
    const info = insertCal.run(userID, 'Calendario principal', 'Calendario creado por defecto');
    return info.lastInsertRowid;
}
module.exports = {
    findUserByUsername,
    createUser,
    findCalendarByUserID,
    createDefaultCalendarForUser
};
