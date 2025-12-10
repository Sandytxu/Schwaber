const {
    findUserByUsername,
    createUser,
    findCalendarByUserID,
    createDefaultCalendarForUser
} = require('../../../db/user.repository');
const bcrypt = require('bcrypt');
const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Falta usuario y contraseña.');
    }
    const user = findUserByUsername(username);
    if (!user) {
        await createUser(username, password);
        req.session.userID = user.id;
        let calendar = findCalendarByUserID(user.id);
        if (!calendar) {
            const calendarId = createDefaultCalendarForUser(user.id);
            calendar = { id: calendarId };
        }
        req.session.calendarID = calendar.id;
        return res.status(200).send('ok');
        //return res.status(401).send('Usuario o contraseña incorrectos.');
    }
    const passwordCorrect = bcrypt.compareSync(password, user.password_hash);
    if (!passwordCorrect) {
        return res.status(401).send('Usuario o contraseña incorrectos.');
    }
    //Cargar calendario
    let calendar = await findCalendarByUserID(user.id);
    if (!calendar) {
        const calendarId = await createDefaultCalendarForUser(user.id);
        calendar = { id: calendarId };
    }
    //Guardar en sesión
    req.session.userID = user.id;
    req.session.calendarID = calendar.id;
    //Redirigir al calendario
    return res.status(200).send('ok');
}

module.exports = login;