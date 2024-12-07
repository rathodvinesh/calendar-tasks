// const db = require("../config/dbConfig"); // Import your database connection
// // const { v4: uuidv4 } = require("uuid"); // For unique IDs if needed

// // Create a new event
// const createEvent = async (req, res) => {
//   try {
//     const { title, start, end, description, firebaseUid } = req.body;

//     if (!title || !start || !end || !firebaseUid) {
//       return res
//         .status(400)
//         .json({ message: "All required fields must be provided" });
//     }

//     const query = `
//       INSERT INTO events (title, start, end, description, firebaseUid)
//       VALUES (?, ?, ?, ?, ?)
//     `;

//     const values = [title, start, end, description || null, firebaseUid];
//     const [result] = await db.execute(query, values);

//     res.status(201).json({
//       message: "Event created successfully",
//       event: {
//         id: result.insertId,
//         title,
//         start,
//         end,
//         description,
//         firebaseUid,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Get all events for a specific user
// const getEvents = async (req, res) => {
//   try {
//     const { firebaseUid } = req.query;

//     if (!firebaseUid) {
//       return res.status(400).json({ message: "firebaseUid is required" });
//     }

//     const query = `SELECT * FROM events WHERE firebaseUid = ?`;
//     const [events] = await db.execute(query, [firebaseUid]);

//     res.status(200).json(events);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Get a specific event by ID
// const getEvent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const query = `SELECT * FROM events WHERE id = ?`;
//     const [events] = await db.execute(query, [id]);

//     if (events.length === 0) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     res.status(200).json(events[0]);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Update a specific event by ID
// const updateEvent = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, start, end, description } = req.body;

//     const query = `
//       UPDATE events
//       SET title = ?, start = ?, end = ?, description = ?
//       WHERE id = ?
//     `;

//     const values = [title, start, end, description || null, id];
//     const [result] = await db.execute(query, values);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     res.status(200).json({ message: "Event updated successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// // Delete a specific event by ID
// const deleteEvent = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const query = `DELETE FROM events WHERE id = ?`;
//     const [result] = await db.execute(query, [id]);

//     if (result.affectedRows === 0) {
//       return res.status(404).json({ message: "Event not found" });
//     }

//     res.status(200).json({ message: "Event deleted successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

// module.exports = {
//   createEvent,
//   getEvents,
//   getEvent,
//   updateEvent,
//   deleteEvent,
// };

const db = require("../config/dbConfig"); // Assuming a db.js file exports the MySQL connection
const asyncHandler = require("express-async-handler");
const { use } = require("../routes/eventRoutes");

// Create a new event
const createEvent = (req, res) => {
  console.log("Request Body:", req.body); // Check what you're receiving

  const { title, start, end, userId, desc } = req.body;
  console.log(title, start, end, userId, desc); // Log each property

  if (!title || !start || !end || !userId) {
    return res.status(400).json({ error: "Required fields are missing." });
  }

  const query = `
    INSERT INTO events (title, start, end, firebaseUid, description)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [title, start, end, userId, desc || ""], (err, result) => {
    if (err) {
      console.error("Error inserting event:", err);
      return res.status(500).json({ error: "Database error." });
    }

    // Check if no events are found
    if (res.length === 0) {
      return res.status(404).json({ message: "No events found for this user" });
    }
    res
      .status(201)
      .json({ id: result.insertId, title, start, end, userId, desc });
  });
};

// Fetch all events for a specific user
// const getEvents = (req, res) => {
//   const { userId } = req.params; // Extract userId from req.params directly
//   console.log("Fetching events for user:", userId);

//   if (!userId) {
//     return res.status(400).json({ error: "User ID is required." });
//   }

//   const query = `
//     SELECT * FROM events WHERE firebaseUid = ?
//   `;

//   db.query(query, [userId], (err, results) => {
//     if (err) {
//       console.error("Error fetching events:", err);
//       return res.status(500).json({ error: "Database error." });
//     }
//     res.status(200).json(results); // Return the events data as JSON
//   });
// };

const getEvents = (req, res) => {
  const { userId } = req.params;
  console.log("Fetching events for user:", userId);

  if (!userId) {
    return res.status(400).json({ error: "User ID is required." });
  }

  const query = `
    SELECT id, title, start, end , description
    FROM events
    WHERE firebaseUid = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error("Error fetching events:", err);
      return res.status(500).json({ error: "Database error." });
    }

    // Ensure start and end times are ISO strings (optional but recommended)
    const formattedResults = results.map((event) => ({
      ...event,
      start: new Date(event.start).toISOString(),
      end: new Date(event.end).toISOString(),
    }));

    res.status(200).json(formattedResults);
  });
};

// Fetch a single event by ID
const getEvent = asyncHandler(async (req, res) => {
  const { userId } = req.query.userId;
  console.log(userId);

  const query = `
    SELECT * FROM events WHERE firebaseUid = ?
  `;

  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error("Error fetching event:", err);
      return res.status(500).json({ error: "Database error." });
    }
    if (result.length === 0) {
      return res.status(404).json({ error: "Event not found." });
    }
    res.status(200).json(result[0]);
  });
});

// Update an event by ID
const updateEvent = (req, res) => {
  const { eventId } = req.params;
  console.log("Updating event with ID:", eventId);
  const { title, start, end, description, userId } = req.body;

  const query = `
    UPDATE events
    SET title = ?, start = ?, end = ?, description = ?
    WHERE id = ? AND firebaseUid = ?
  `;

  db.query(
    query,
    [title, start, end, description || "", eventId, userId],
    (err, results) => {
      if (err) {
        console.error("Error updating event:", err);
        return res.status(500).json({ error: "Database error." });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ error: "Event not found." });
      }
      // Ensure start and end times are ISO strings (optional but recommended)
      // const formattedResults = results.map((event) => ({
      //   ...event,
      //   start: new Date(event.start).toISOString(),
      //   end: new Date(event.end).toISOString(),
      // }));

      // res.status(200).json(formattedResults);
    }
  );
};

// Delete an event by ID
const deleteEvent = (req, res) => {
  const { id } = req.params;
  console.log("Deleting event with ID:", id);
  // const { userId } = req.body;

  const query = `
    DELETE FROM events WHERE id = ? and firebaseUid = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error("Error deleting event:", err);
      return res.status(500).json({ error: "Database error." });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Event not found." });
    }
    res.status(200).json({ message: "Event deleted successfully." });
  });
};

module.exports = {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent,
};
