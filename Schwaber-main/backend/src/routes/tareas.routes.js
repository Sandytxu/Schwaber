const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareas.controller');
const auth = require('../middlewares/auth.middleware'); // si usáis auth

// Obtener todas las tareas del usuario
router.get('/', auth, tareasController.getTareas);

// Crear una nueva tarea
router.post('/', auth, tareasController.createTarea);

// Completar tarea
router.put('/:id/completar', auth, tareasController.completarTarea);

// Eliminar tarea
router.delete('/:id', auth, tareasController.eliminarTarea);

module.exports = router;
