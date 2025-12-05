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
      />
    </div>
  );
}