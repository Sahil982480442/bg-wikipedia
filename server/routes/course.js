
const express = require("express");
const router = express.Router();
const pool = require("../db");
const adminAuth = require("../middleware/auth");

// Get all courses (public)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM courses ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// Create new course (admin only)
router.post("/", adminAuth, async (req, res) => {
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

// ✅ Edit/update course (admin only)
router.put("/:id", adminAuth, async (req, res) => {
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

// Delete multiple courses (admin only)
router.delete("/", adminAuth, async (req, res) => {
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
