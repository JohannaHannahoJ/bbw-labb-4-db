const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

// Starta expressapplikationen
const app = express();
const port =process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Routes
const entryRoutes = require("./routes/entryRoutes");
const userRoutes = require("./routes/userRoutes");

app.use("/entries", entryRoutes);
app.use("/users", userRoutes);

// Starta applikationen
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})