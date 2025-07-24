const express = require("express");
const router = express.Router();
const pool = require("../db");

// Get approved content for a topic
router.get("/approved/:topicId", async (req, res) => {
  const { topicId } = req.params;
  const result = await pool.query(
    `SELECT id, title, content 
     FROM topic_content 
     WHERE topic_id=$1 AND is_approved=true 
     ORDER BY created_at DESC`,
    [topicId]
  );
  res.json(result.rows);
});

// Submit new content (pending)
router.post("/", async (req, res) => {
  const { courseId, topicId, name, mobile, title, content } = req.body;
  const result = await pool.query(
    `INSERT INTO topic_content
      (course_id, topic_id, name, mobile, title, content, is_approved)
     VALUES ($1,$2,$3,$4,$5,$6,false)
     RETURNING *`,
    [courseId, topicId, name, mobile, title, content]
  );
  res.json(result.rows[0]);
});

// Get all pending requests (admin)
router.get("/pending", async (req, res) => {
  const result = await pool.query(
    `SELECT * FROM topic_content
     WHERE is_approved=false
     ORDER BY created_at DESC`
  );
  res.json(result.rows);
});

// Approve
router.put("/approve/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    `UPDATE topic_content
     SET is_approved=true
     WHERE id=$1
     RETURNING *`,
    [id]
  );
  res.json(result.rows[0]);
});

// Reject (delete)
router.delete("/reject/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query(`DELETE FROM topic_content WHERE id=$1`, [id]);
  res.json({ msg: "Deleted" });
});

// Update title or content
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  const result = await pool.query(
    `UPDATE topic_content
     SET title=$1, content=$2
     WHERE id=$3
     RETURNING *`,
    [title, content, id]
  );
  res.json(result.rows[0]);
});

// Delete content
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query(`DELETE FROM topic_content WHERE id=$1`, [id]);
  res.json({ msg: "Content deleted" });
});


// Admin adds approved content directly
router.post("/admin", async (req, res) => {
  const { courseId, topicId, title, content } = req.body;

  const result = await pool.query(
    `INSERT INTO topic_content
      (course_id, topic_id, name, mobile, title, content, is_approved)
     VALUES ($1,$2,null,null,$3,$4,true)
     RETURNING *`,
    [courseId, topicId, title, content]
  );

  res.json(result.rows[0]);
});


module.exports = router;