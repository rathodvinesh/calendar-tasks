const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const db = require("./config/dbConfig");

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true })); // For URL-encoded data

const loginRoute = require("./routes/userRoutes");
const eventRoute = require("./routes/eventRoutes");

app.use("/user", loginRoute);
app.use("/task", eventRoute);

const port = import.meta.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
