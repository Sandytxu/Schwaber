import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import esES from "date-fns/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarView.css";

const locales = { es: esES };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // lunes
  getDay,
  locales,
});

const CATEGORY_COLORS = {
  "ESTADÍSTICA (6355 #90O)": "#B08982",
  "INFORMÁTICA BÁSICA (6346 #90O)": "#FF9800",
  "FUNDAMENTOS DEONTOLÓGICOS Y JURÍDICOS (6344 #90O)": "#9C27B0",
  default: "#607D8B",
};

// Estilo de cada evento según su categoría
const eventStyleGetter = (event) => {
  const bg = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.default;

  return {
    style: {
      backgroundColor: bg,
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "11px",
      padding: "0 2px",
    },
  };
};

export default function CalendarView({ events }) {
  const mappedEvents = events.map((e) => ({
    ...e,
    start: new Date(e.start),
    end: new Date(e.end),
  }));

  const handleSelectEvent = (event) => {
    alert(
      `${event.title}\n\n` +
      `Asignatura: ${event.category || "—"}\n\n` +
      `${event.description || ""}`
    );
  };

  // Capitaliza la primera letra de una cadena
  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

  // formateo customizado para español
  const formats = {
    monthHeaderFormat: (date) => capitalize(format(date, "LLLL yyyy", { locale: esES })),
    dayHeaderFormat: (date) => capitalize(format(date, "EEEE, d 'de' LLLL", { locale: esES })),
    weekdayFormat: (date) => capitalize(format(date, "EEEE", { locale: esES })),
  };

  return ( // importante usar tamaño de 70 vh para que se vea bien, mas de eso y tenemos scroll en la pagina
    <div style={{ height: "70vh", padding: "2rem", marginBottom: "2rem" }}>
      <Calendar
        localizer={localizer}
        events={mappedEvents}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        defaultView="month"
        views={["month", "week", "day"]}
        culture="es"
        formats={formats}
        messages={{ // traducciones al español
          month: 'Mes', 
          week: 'Semana',
          day: 'Día',
          today: 'Hoy',
          previous: 'Anterior',
          next: 'Siguiente'
        }}
        popup
        onSelectEvent={handleSelectEvent}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}