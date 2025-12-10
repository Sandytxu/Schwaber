const db = require('../../db/db');

// Obtener todas las tareas de un usuario
function getTareasByUser(userId) {
    const query = `
        SELECT id, titulo, fecha, descripcion, color, completada
        FROM tareas
        WHERE user_id = ?
        ORDER BY fecha ASC
    `;
    return db.all(query, [userId]);
}

// Crear una tarea nueva
function createTarea(tarea) {
    const query = `
        INSERT INTO tareas (titulo, fecha, descripcion, color, completada, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
        tarea.titulo,
        tarea.fecha,
        tarea.descripcion,
        tarea.color,
        tarea.completada ? 1 : 0,
        tarea.user_id
    ];
    return db.run(query, params);
}

// Marcar una tarea como completada
function completarTarea(idTarea) {
    const query = `
        UPDATE tareas
        SET completada = 1
        WHERE id = ?
    `;
    return db.run(query, [idTarea]);
}

// Eliminar tarea
function deleteTarea(idTarea) {
    const query = `
        DELETE FROM tareas
        WHERE id = ?
    `;
    return db.run(query, [idTarea]);
}

module.exports = {
    getTareasByUser,
    createTarea,
    completarTarea,
    deleteTarea
};