
import path from 'path';
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Shared connection promise, so the database is only opened once.
let dbPromise = null;

// CREATE/OPEN ONLY: opens the database and makes sure the products table exists.
export const getDbConnection = () => {
  if (!dbPromise) {
    dbPromise = open({
      filename: path.join(__dirname, 'public', 'database', 'products.db'),
      driver: sqlite3.Database
    }).then(db => {
      return db.exec(`
        CREATE TABLE IF NOT EXISTS products (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          description TEXT,
          price REAL,
          quantity INTEGER
        )
      `).then(() => db);
    });
  }

  return dbPromise;
};

// SEED ONLY: adds products only if the table is empty.
export const seedDatabase = () => {
  return getDbConnection().then(db => {
    return db.get('SELECT COUNT(*) AS count FROM products').then(row => {

      if (row.count > 0) {
        console.log('Products table already has data. Skipping seed.');
        return;
      }

      return db.run(`
        INSERT INTO products (name, description, price, quantity) VALUES
        ('Chocolate Chip Cookie', 'Fresh-baked cookie with chocolate chips', 2.50, 25),
        ('Blueberry Muffin', 'Soft muffin filled with blueberries', 3.00, 20),
        ('Cinnamon Roll', 'Warm roll with cinnamon and cream cheese icing', 4.50, 15),
        ('Chocolate Croissant', 'Flaky croissant filled with chocolate', 4.00, 18),
        ('Glazed Donut', 'Classic donut with sweet glaze', 2.00, 30),
        ('Sourdough Bread', 'Freshly baked artisan sourdough loaf', 6.00, 12),
        ('Chocolate Cake', 'Moist chocolate cake with chocolate frosting', 28.00, 5),
        ('Cheesecake', 'Creamy classic cheesecake', 30.00, 6),
        ('Apple Pie', 'Homemade pie with cinnamon apples', 22.00, 8),
        ('Banana Bread', 'Moist banana bread with walnuts', 8.00, 10)
      `).then(() => {
        console.log('Products table was empty. Seed data inserted.');
      });
    });
  });
};

