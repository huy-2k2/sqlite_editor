import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

console.log(client.apiKey);

// validate SQL (rất quan trọng)
function validateSQL(sql) {
  const lower = sql.toLowerCase();

  if (!lower.startsWith("select")) {
    throw new Error("Only SELECT allowed");
  }

  if (lower.includes("drop") || lower.includes("delete") || lower.includes("update")) {
    throw new Error("Dangerous query");
  }
}

app.post("/generate-sql", async (req, res) => {
  try {
    const { schema, question } = req.body;

    if (!schema || !question) {
      return res.status(400).json({ error: "Missing schema or question" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are a SQL expert.

Database schema:
${schema}

User question:
${question}

Rules:
- Only return SQL
- Do not explain
- Use only tables and columns from schema
- Make sure query is valid SQLite
- Make sure to include all requested fields
      `,
    });

    const sql = response.output_text.trim();

    // validate trước khi trả
    validateSQL(sql);

    res.json({ sql });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

app.listen(Number(process.env.PORT) || 3000, () => {
  console.log("Server running on port " + (process.env.PORT || 3000));
});