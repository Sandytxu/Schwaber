import React, { useState, useEffect } from "react";
import CalendarView from "./CalendarView";
import IcsUploader from "./IcsUploader";
import { getEvents } from '../../services/services';

const { REACT_APP_BACKEND_URL } = process.env;

function Home({ redirect = true }) {
  const [events, setEvents] = useState([]);

  const handleEventsLoaded = (newEvents) => {
    setEvents(newEvents);
  };

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const eventsData = await getEvents();
        console.log(eventsData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchUserData();

  }, []);
  return (
    
    <div style={{ marginLeft: "auto", marginRight: "auto", marginTop: "2rem", width: "80%", textAlign: "center", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 12px 18px rgba(0, 0, 0, 0.5)"}}>
      <div id="font-titulo">Calendario</div>
      
      <CalendarView events={events} />

      <IcsUploader 
        onEventsLoaded={handleEventsLoaded}
        backendUrl={REACT_APP_BACKEND_URL  || "http://localhost:4000"}
      />
    </div>
  );
}

export default Home;