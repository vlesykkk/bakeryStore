import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import { seedDatabase, getDbConnection } from './database.js';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

// Products page: served at both / and /products
async function showProducts(req, res) {
  const db = await getDbConnection();
  const products = await db.all('SELECT * FROM products');

  res.render('index', {
    data: products,
    title: "Bakery Products"
  });
}

app.get('/', showProducts);
app.get('/products', showProducts);

app.get('/about', async (req, res) => {
  const db = await getDbConnection();
  const products = await db.all('SELECT * FROM products');

  res.render('about', {
    data: products,
    title: "About Us"
  });
});

app.get('/contact', async (req, res) => {
  const db = await getDbConnection();
  const products = await db.all('SELECT * FROM products');

  res.render('contact', {
    data: products,
    title: "Contact Us"
  });
});

seedDatabase().then(() => {
  app.listen(port, () => {
    console.log(`App listening at port ${port}`);
  });
});