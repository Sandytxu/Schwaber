const path = require('path');
const express = require('express');
const session = require('express-session');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, '..', 'db', 'calendarios.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));

//Sesiones
app.use(
    session({
        secret: 'patatasConChorizo', // En producción se cambiaria por un .env variable para tener seguridad
        resave: false,
        saveUninitialized: false,
    })
);

// Funciones para la bd
// Buscar user por nombre
function findUserByUsername(username) {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
    return stmt.get(username);
}

// Crear nuevo usuario
function createUser(username, passwordPlain) {
    // Hashear la contraseña antes de guardarla
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(passwordPlain, salt);
    const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
    const info = stmt.run(username, passwordHash);
    return info.lastInsertRowid;
}

// Crear calendario por defecto para usuario
function createDefaultCalendarForUser(userID) {
    const insertCal = db.prepare('INSERT INTO calendars (user_id,name,description) VALUES (?,?,?)');//Faltaría ver cómo meter la time zone
    const info = insertCal.run(userID, 'Calendario principal', 'Calendario creado por defecto');
    return info.lastInsertRowid;
}

// Traer calendario principal del usuario
function findCalendarByUserID(userID) {
    const stmt = db.prepare('SELECT * FROM calendars WHERE user_id = ? ORDER BY id LIMIT 1');
    return stmt.get(userID);
}

// Middleware para proteger rutas
function requireLogin(req, res, next) {
    if (!req.session.userID) {
        return res.redirect('/login.html');
    }
    next();
}

//Autentificación
//Registro
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).send('Falta usuario y contraseña.');
    }

    // Comprobar si existe
    const existingUser = findUserByUsername(username);
    if (existingUser) {
        return res.status(400).send('El usuario ya existe.');
    }

    //crear usuario y calendario por defecto
    const userID = createUser(username, password);
    const calendarId = createDefaultCalendarForUser(userID);

    //Guardar en sesión
    req.session.userID = userID;
    req.session.calendarID = calendarId;
    //Redirigir al calendario
    res.redirect('/');
});

//Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if(!username || !password) {
        return res.status(400).send('Falta usuario y contraseña.');
    }
    const user = findUserByUsername(username);
    if (!user) {
        return res.status(401).send('Usuario o contraseña incorrectos.');
    }

    const passwordCorrect = bcrypt.compareSync(password, user.password_hash);
    if (!passwordCorrect) {
        return res.status(401).send('Usuario o contraseña incorrectos.');
    }

    //Cargar calendario
    let calendar = findCalendarByUserID(user.id);
    if (!calendar) {
        const calendarId = createDefaultCalendarForUser(user.id);
        calendar = { id: calendarId };
    }

    //Guardar en sesión
    req.session.userID = user.id;
    req.session.calendarID = calendar.id;
    //Redirigir al calendario
    res.redirect('/');
});

//Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login.html');
    });
});

//Rutas
app.get('/', (req, res) => {
    if (!req.session.userID) {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, '..', 'public')));

//arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor arrancado en http://localhost:${PORT}`);
});