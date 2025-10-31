import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { db } from "./db.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend")));

// Home page
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "../frontend/index.html")));

// REGISTER
app.post("/api/users/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "All fields required" });
  const hashed = await bcrypt.hash(password, 10);
  try {
    await db.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed]);
    res.json({ message: "User registered successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") res.status(400).json({ message: "Username already exists" });
    else res.status(500).json({ message: err.message });
  }
});

// LOGIN
app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "All fields required" });
  try {
    const [rows] = await db.query("SELECT * FROM users WHERE username=?", [username]);
    if (!rows.length) return res.status(400).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, userId: rows[0].id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PRODUCTS
app.get("/api/products", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get("/api/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query("SELECT * FROM products WHERE id=?", [id]);
    if (!rows.length) return res.status(404).json({ message: "Product not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ORDERS
app.post("/api/orders", async (req, res) => {
  const { user_id, items, total, shipping_address } = req.body;
  if (!user_id || !items || !total || !shipping_address) return res.status(400).json({ message: "All fields required" });
  try {
    const [result] = await db.query("INSERT INTO orders (user_id, total, shipping_address) VALUES (?, ?, ?)", [user_id, total, shipping_address]);
    const orderId = result.insertId;
    for (let item of items) {
      await db.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)", [orderId, item.id, item.qty, item.price]);
    }
    res.json({ orderId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
