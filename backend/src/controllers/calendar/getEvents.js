const {
    getCalendarEvents
} = require('../../../db/calendar.repository');

const getEvents = async (req, res) => {
    const events = await getCalendarEvents(req.session.calendarID);
    res.json(events);
}

module.exports = getEvents;