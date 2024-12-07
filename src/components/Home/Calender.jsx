// // // exports default ColoredDateCellWrapper;
// import React, { useCallback, useState, useEffect } from "react";
// import { Calendar, Views, momentLocalizer } from "react-big-calendar";
// import moment from "moment";
// import axios from "axios";
// import "react-big-calendar/lib/css/react-big-calendar.css";

// const localizer = momentLocalizer(moment);

// export default function MyCalendar({ userId }) {
//   const [events, setEvents] = useState([]);
//   const [showModal, setShowModal] = useState(false);
//   const [modalData, setModalData] = useState({
//     title: "",
//     start: new Date(),
//     end: new Date(),
//     desc: "",
//   });

//   // Fetch events from the database for the logged-in user

//   const fetchAllEvents = async (userId) => {
//     try {
//       const res = await axios.get(
//         `http://localhost:5000/task/getEvents/${userId}`
//       );

//       const transformedEvents = res.data.map((event) => ({
//         id: event.id,
//         title: event.title,
//         start: new Date(event.start), // Convert ISO string to Date
//         end: new Date(event.end), // Convert ISO string to Date
//         desc: event.desc,
//       }));

//       setEvents(transformedEvents);
//       // setEvents(res.data);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAllEvents(userId);
//   }, [userId]);

//   // Create a new event
//   const handleSelectSlot = useCallback(
//     ({ start, end }) => {
//       const title = window.prompt("Enter Event Title:");
//       const desc = window.prompt("Enter Event Desc:");

//       if (title || desc) {
//         const newEvent = {
//           title,
//           start: moment(start).format("YYYY-MM-DD HH:mm:ss"), // Convert to MySQL-friendly format
//           end: moment(end).format("YYYY-MM-DD HH:mm:ss"),
//           desc,
//           userId,
//         };

//         console.log(newEvent);

//         axios
//           .post("http://localhost:5000/task/events", newEvent)
//           .then((response) => {
//             setEvents((prevEvents) => [...prevEvents, response.data]);
//           })
//           .catch((error) => console.error("Error saving event:", error));
//       }
//     },
//     [userId]
//   );

//   // Edit an event
//   const handleSelectEvent = useCallback((event) => {
//     const newTitle = window.prompt("Edit Event Title:", event.title);
//     if (newTitle) {
//       const updatedEvent = { ...event, title: newTitle };
//       axios
//         .put(`http://localhost:5000/task/events/${event.id}`, updatedEvent)
//         .then(() => {
//           setEvents((prevEvents) =>
//             prevEvents.map((evt) => (evt.id === event.id ? updatedEvent : evt))
//           );
//         })
//         .catch((error) => console.error("Error updating event:", error));
//     }
//   }, []);

//   return (
//     <div className="h-screen w-screen p-5">
//       <Calendar
//         localizer={localizer}
//         defaultDate={new Date()}
//         defaultView={Views.WEEK}
//         events={events}
//         onSelectSlot={handleSelectSlot}
//         onSelectEvent={handleSelectEvent}
//         selectable={true}
//         dayLayoutAlgorithm={"no-overlap"}
//       />
//     </div>
//   );
// }

import React, { useState, useEffect } from "react";
import { Calendar, Views, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios";
import "react-big-calendar/lib/css/react-big-calendar.css";
import EventModal from "../Modal/EventModal";

const localizer = momentLocalizer(moment);

export default function MyCalendar({ userId }) {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({
    id: null,
    title: "",
    start: new Date(),
    end: new Date(),
    desc: "",
  });

  // Fetch events from the database
  const fetchAllEvents = async (userId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/task/getEvents/${userId}`
      );
      const transformedEvents = res.data.map((event) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.start),
        end: new Date(event.end),
        desc: event.description,
      }));
      setEvents(transformedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchAllEvents(userId);
  }, [userId]);

  // Open the modal
  const handleOpenModal = (event = null) => {
    if (event) {
      setModalData({ ...event });
    } else {
      setModalData({
        id: null,
        title: "",
        start: new Date(),
        end: new Date(),
        desc: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // Save or update event
  const handleSaveEvent = async () => {
    const { id, title, start, end, desc } = modalData;
    const eventToSave = {
      title,
      start: moment(start).format("YYYY-MM-DD HH:mm:ss"),
      end: moment(end).format("YYYY-MM-DD HH:mm:ss"),
      desc,
      userId,
    };

    if (id) {
      await axios
        .put(`http://localhost:5000/task/events/${id}`, eventToSave)
        .then(() => {
          setEvents((prevEvents) =>
            prevEvents.map((evt) =>
              evt.id === id ? { ...evt, ...eventToSave } : evt
            )
          );
          handleCloseModal();
        })
        .catch((error) => console.error("Error updating event:", error));
    } else {
      await axios
        .post("http://localhost:5000/task/events", eventToSave)
        .then((response) => {
          setEvents((prevEvents) => [...prevEvents, response.data]);
          handleCloseModal();
        })
        .catch((error) => console.error("Error saving event:", error));
    }
  };

  // Delete an event
  const handleDeleteEvent = async (eventId) => {
    await axios
      .delete(`http://localhost:5000/task/events/${eventId}`)
      .then(() => {
        setEvents((prevEvents) =>
          prevEvents.filter((evt) => evt.id !== eventId)
        );
      })
      .catch((error) => console.error("Error deleting event:", error));
  };

  return (
    <div className="h-screen w-screen bg-white shadow-md rounded-lg p-8">
      <Calendar
        localizer={localizer}
        defaultDate={new Date()}
        defaultView={Views.MONTH}
        events={events}
        onSelectSlot={({ start, end }) => handleOpenModal({ start, end })}
        onSelectEvent={(event) => handleOpenModal(event)}
        selectable={true}
        dayLayoutAlgorithm="no-overlap"
      />
      <EventModal
        show={showModal}
        onHide={handleCloseModal}
        data={modalData}
        onChange={(field, value) =>
          setModalData((prevData) => ({ ...prevData, [field]: value }))
        }
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
