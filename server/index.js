const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/course"));
app.use("/api/topics", require("./routes/topic"));
app.use("/api/topic-content", require("./routes/topicContent"));


const pool = require("./db");
app.get("/ping", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.send("pong");
  } catch (err) {
    console.error(err);
    res.status(500).send("error");
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
