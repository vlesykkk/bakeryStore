# Bakery Products App

A Node/Express/EJS app backed by SQLite, showing a grid of bakery
products with a "Show details" popup for price and stock.

## Setup

npm install
node app.js

Then visit http://localhost:3000.

## Design Strategy

### 1. Separation of Concerns

The app is split into four layers, each with one job:

**Data layer — `database.js`**
Owns the database connection, the table schema, and the seed data.
Nothing in this file knows about HTTP, routes, or HTML. It exposes
two functions:
- `getDbConnection()` — opens (or reuses) the SQLite connection and
  makes sure the `products` table exists. It never inserts data, so
  it is safe to call on every request.
- `seedDatabase()` — a separate function that inserts the starter
  products, but only if the table is currently empty (checked with
  `SELECT COUNT(*)`). This keeps seeding and connecting independent:
  restarting the server reconnects every time but only seeds once.

**Routing/application layer — `app.js`**
Owns the Express app, the routes, and what data each route fetches.
It imports the data functions from `database.js` rather than
touching SQLite directly, and imports nothing from the view layer
except the name of the template to render. Each route handler does
the same three things: get a connection, query the data it needs,
`res.render()` a template with that data.

**Presentation layer — `views/*.ejs`**
Owns HTML structure only. `head.ejs`, `menu.ejs`, and `footer.ejs`
are shared partials included by every page, so the page shell
(doctype, nav, footer, script tags) is written once and reused,
instead of being copy-pasted into `index.ejs`, `about.ejs`, and
`contact.ejs`. `index.ejs` and `detailsmodal.ejs` contain no
business logic beyond looping over the data they were handed and
deciding which CSS class/text to show for stock level — they don't
know where that data came from.

**Client-side behavior — `public/js/details.js`**
Owns what happens in the browser after the page has loaded: opening
the details modal and filling it in from the clicked button's
`data-*` attributes. This is the only file that runs in the browser
rather than on the server, and it has no knowledge of Express, EJS,
or SQLite — it only reads attributes already rendered into the HTML.

**Why this split matters:** each layer can change without touching
the others. Swapping SQLite for another database only touches
`database.js`. Redesigning the product cards only touches
`index.ejs` and `style.css`. Adding a new page only touches
`app.js` (a route) and `views/` (a template) — `database.js` and
`details.js` don't change at all.

### 2. Routes and the Menu

`app.js` defines four routes:

| Route         | Handler        | Renders         |
|---------------|----------------|------------------|
| `GET /`       | `showProducts` | `index.ejs`      |
| `GET /products` | `showProducts` (same function) | `index.ejs` |
| `GET /about`  | inline handler | `about.ejs`      |
| `GET /contact`| inline handler | `contact.ejs`    |

`/` and `/products` intentionally share one handler function
(`showProducts`) instead of two copies of the same code, since they
show identical content — the product grid is just the site's home
page as well as a named page.

The nav bar in `menu.ejs` is a shared partial, included at the top
of every page via `<%- include('menu') %>`, and its three links
point at exactly those routes:

    <a class="nav-link" href="/">Products</a>
    <a class="nav-link" href="/about">About</a>
    <a class="nav-link" href="/contact">Contact</a>

Because the menu is one shared file rather than being duplicated
per-page, adding, renaming, or reordering a nav link only requires
editing `menu.ejs` once — every page picks up the change
automatically the next time it's included.

## File Structure

    app.js               - routes, server startup
    database.js           - connection, schema, seeding
    views/
      head.ejs             - shared <head> + opens <body>
      menu.ejs              - shared nav bar
      footer.ejs            - shared footer, closes <body>
      index.ejs              - product grid (/ and /products)
      about.ejs
