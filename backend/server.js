const express = require("express");
const { Pool } = require("pg");

const app = express();
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: 5432,
});

pool.query(`
  CREATE TABLE IF NOT EXISTS action_log (
    id SERIAL PRIMARY KEY,
    persona_name VARCHAR(50),
    activation_date TIMESTAMP DEFAULT NOW()
  );
`);

app.put("/activatePersona", async (req, res) => {
  const { persona } = req.body;

  try {
    await pool.query(
      "INSERT INTO action_log (persona_name) VALUES ($1)",
      [persona]
    );

    res.json({
      status: "success",
      activatedPersona: persona,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(3000, () => {
  console.log("Backend running on port 3000");
});
