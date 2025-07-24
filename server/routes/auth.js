const express = require("express");
const router = express.Router();
const pool = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Login Route
router.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await pool.query(
      "SELECT * FROM admins WHERE username = $1",
      [username]
    );

    if (admin.rows.length === 0)
      return res.status(400).json({ msg: "Invalid credentials" });

    const validPass = await bcrypt.compare(password, admin.rows[0].password);
    if (!validPass)
      return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign(
      { adminId: admin.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
