const db = require('./db');

function getCalendarEvents(calendar_id) {
    // 1. Validación básica
    if (!calendar_id) {
        throw new Error("El calendar_id es obligatorio");
    }
    // 2. Consulta SQL con alias (AS) para renombrar las columnas al vuelo
    const stmt = db.prepare(`
        SELECT 
            id,
            summary AS title,       
            dtstart_ics AS start,   
            dtend_ics AS "end",     
            description,
            category
        FROM events 
        WHERE calendar_id = ?
    `);

    // 3. .all() devuelve un array con todos los resultados encontrados
    return stmt.all(calendar_id);
}
function registerEvent(calendar_id, uid, title, start, end, description, category) {

    // 1. CONVERSIÓN DE SEGURIDAD:
    // Si 'start' es un objeto Date, lo convertimos a texto ISO. Si ya es texto, lo dejamos igual.
    const startString = (start instanceof Date) ? start.toISOString() : start;
    const endString = (end instanceof Date) ? end.toISOString() : end;

    // 2. Ahora sí podemos usar .substring() porque startString es seguro que es TEXTO
    let dayKey = '';
    if (startString) {
        dayKey = startString.substring(0, 10).replace(/-/g, ''); // Resultado: "20251201"
    } else {
        throw new Error("La fecha de inicio (start) es obligatoria");
    }

    const stmt = db.prepare(`
        INSERT INTO events (
            calendar_id, 
            uid, 
            summary, 
            description, 
            category, 
            dtstart_ics, 
            dtend_ics, 
            day_key, 
            all_day
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 3. Pasamos las variables convertidas (startString y endString)
    return stmt.run(
        calendar_id,
        uid || null,
        title || 'Sin Título',
        description || null,
        category || 'General',
        startString,
        endString,
        dayKey,
        0
    );
}

module.exports = {
    registerEvent,
    getCalendarEvents
};
