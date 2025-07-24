const express = require("express");
const router = express.Router();
const pool = require("../db");

//get single topic
router.get("/topic/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM topics WHERE id = $1",
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ msg: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// Get all topics under a course
router.get("/:courseId", async (req, res) => {
  const { courseId } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM topics WHERE course_id = $1 ORDER BY id",
      [courseId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Add a new topic
router.post("/", async (req, res) => {
  const { courseId, title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO topics (course_id, title, description) VALUES ($1, $2, $3) RETURNING *",
      [courseId, title, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});



router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const result = await pool.query(
      "UPDATE topics SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});




// Delete selected topics
router.delete("/", async (req, res) => {
  const { ids } = req.body;
  try {
    await pool.query("DELETE FROM topics WHERE id = ANY($1::int[])", [ids]);
    res.json({ msg: "Topics deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});






module.exports = router;
