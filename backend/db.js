import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const db = await mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

console.log("✅ Connected to MySQL");

async function setupDatabase() {
  try {
    // Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      )
    `);

    // Create products table
    await db.query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100),
        price DECIMAL(10,2),
        image VARCHAR(100)
      )
    `);

    // Insert sample products
    const products = [
      ["Perfume", 50.00, "perfume.jpg"],
      ["Luxury Watch", 250.00, "watch.jpg"],
      ["Leather Shoes", 150.00, "shoes.jpg"],
      ["i phone 17 pro max", 1099.00, "i phone.jpg"],
      ["Power Bank", 180.00, "power bank.jpg"],
      ["Shampoo", 250.00, "shampoo.jpg"],
      ["SunGlasses", 150.00, "sunglasses.jpg"],
      ["GTA vi Game ps5 edition", 450.00, "GTA vi.jpg"],
      ["Silver bracelet", 150.00, "Silver bracelet.jpg"],
      ["Headphones", 450.00, "Headphones.jpg"],
      ["Mac book M4", 200.00, "mac.jpg"],
      ["Nothing Mobile", 2990.00, "Nothing.jpg"]
    ];

    for (const product of products) {
      await db.query("INSERT INTO products (name, price, image) VALUES (?, ?, ?)", product);
    }

    // Create orders table
    await db.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total DECIMAL(10,2),
        shipping_address VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Create order_items table
    await db.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        product_id INT,
        quantity INT,
        price DECIMAL(10,2),
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      )
    `);

    console.log("✅ All tables created and products inserted successfully!");
  } catch (err) {
    console.error("❌ Error setting up database:", err);
  }
}

setupDatabase();
