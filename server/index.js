const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/courses", require("./routes/course"));
app.use("/api/topics", require("./routes/topic"));
app.use("/api/topic-content", require("./routes/topicContent"));


app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
