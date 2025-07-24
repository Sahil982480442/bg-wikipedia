
const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get all courses
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Create new course
router.post("/", async (req, res) => {
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO courses (title, description) VALUES ($1, $2) RETURNING *",
      [title, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// ✅ Edit/update course
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE courses SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [title, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Delete multiple courses
router.delete("/", async (req, res) => {
  const { ids } = req.body;
  try {
    await pool.query("DELETE FROM courses WHERE id = ANY($1::int[])", [ids]);
    res.json({ msg: "Courses deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
