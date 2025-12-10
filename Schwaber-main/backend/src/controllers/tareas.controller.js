const tareasRepo = require('../repositories/tareas.repository');

// Obtener tareas del usuario
async function getTareas(req, res) {
    try {
        const userId = req.user.id; // viene del token
        const tareas = await tareasRepo.getTareasByUser(userId);
        res.json(tareas);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error obteniendo tareas' });
    }
}

// Crear tarea
async function createTarea(req, res) {
    try {
        const userId = req.user.id;

        const nueva = {
            titulo: req.body.titulo,
            fecha: req.body.fecha,
            descripcion: req.body.descripcion,
            color: req.body.color,
            completada: 0,
            user_id: userId
        };

        await tareasRepo.createTarea(nueva);
        res.json({ message: 'Tarea creada correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error creando tarea' });
    }
}

// Completar tarea
async function completarTarea(req, res) {
    try {
        const idTarea = req.params.id;
        await tareasRepo.completarTarea(idTarea);
        res.json({ message: 'Tarea completada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error completando tarea' });
    }
}

// Eliminar tarea
async function eliminarTarea(req, res) {
    try {
        const idTarea = req.params.id;
        await tareasRepo.deleteTarea(idTarea);
        res.json({ message: 'Tarea eliminada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error eliminando tarea' });
    }
}

module.exports = {
    getTareas,
    createTarea,
    completarTarea,
    eliminarTarea
};
