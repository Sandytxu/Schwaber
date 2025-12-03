const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const isAuthenticated = require('./middlewares/isAuthenticated.js');
const auth = require('./routes/auth.js');
const health = require('./routes/health.js');
const {
    findUserByUsername,
    createUser,
    findCalendarByUserID,
    createDefaultCalendarForUser
} = require('../db/user.repository');


const dbPath = path.join(__dirname, '..', 'db', 'calendarios.db');
const db = new Database(dbPath);

db.pragma('foreign_keys = ON');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
/*config */
dotenv.config();
//Sesiones
app.use(
    session({
        secret: 'patatasConChorizo', // En producción se cambiaria por un .env variable para tener seguridad
        resave: false,
        saveUninitialized: false,
    })
);








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

    if (!username || !password) {
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

    if (!username || !password) {
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


app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
//Rutas
app.get('/', (req, res) => {
    if (!req.session.userID) {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, '..', 'public')));



app.use('/api/v1/health', isAuthenticated, health);
app.use('/api/v1/auth', auth);


//arrancar servidor
app.listen(PORT, () => {
    console.log(`Servidor arrancado en http://localhost:${PORT}`);
});