PRAGMA foreign_keys = ON;

----------------------------------------
-- Tabla de usuarios -------------------
----------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL
);

----------------------------------------
-- Tabla de calendarios ----------------
----------------------------------------
CREATE TABLE IF NOT EXISTS calendars (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    timezone TEXT, --Necesario para cuadrar horas.
    source_file TEXT, --ruta del .ics cargado

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

---Va a ser algo recurrente
CREATE INDEX IF NOT EXISTS idx_calendars_user
    ON calendars(user_id);

----------------------------------------
-- Tabla de eventos --------------------
----------------------------------------
CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    calendar_id INTEGER NOT NULL,

    --ICS
    uid TEXT, --UID del VEVENT
    class TEXT, 
    dtstamp TEXT, --DTSTAMP en formato ICS (YYYMMDDTHHMMSSZ)
    last_modified TEXT, -- Igual formato
    dtstart_ics TEXT NOT NULL, -- Igual formato
    dtend_ics TEXT NOT NULL, -- Igual formato
    categories_raw TEXT, -- Tal cual la da el ics

    -- Parseados para el html
    summary TEXT NOT NULL, --Titulo
    description TEXT,
    category TEXT NOT NULL,
    day_key TEXT NOT NULL, -- YYYMMDD
    all_day INTEGER NOT NULL DEFAULT 0, --Booleano

    create_at TEXT NOT NULL DEFAULT (datetime('now')),

    FOREIGN KEY (calendar_id) REFERENCES calendars(id) ON DELETE CASCADE
);

-- Índices para las consultas de calendario y dia / categoría
CREATE INDEX IF NOT EXISTS idx_evets_calendar_day
    ON events(calendar_id, day_key);

CREATE INDEX IF NOT EXISTS idx_events_calendar_category
    ON events(calendar_id, category);