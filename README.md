# ShopEase — E-commerce Website

A responsive, dark-theme, frontend-only e-commerce website built with **HTML5, CSS3 and vanilla JavaScript**. This project is intended for an Ausbildung/web-development portfolio or classroom demonstration.

> **Important:** This is a learning demo. It has no backend, real payment gateway, secure authentication, shipping integration or production order processing. Do not enter sensitive personal or payment details.

## Features

- Responsive homepage, navigation, promotional banner and category cards
- 12 sample products across Electronics, Fashion, Home, Beauty and Sports
- Product search across names, categories and descriptions
- Category filters, maximum-price slider and sort by featured, price, rating or newest
- Product quick-view modal with details and stock information
- Shopping cart: add, remove, quantity controls, stock limits and totals
- Free shipping over ₹2,499; otherwise ₹99 simulated shipping
- Wishlist saved locally
- Checkout form with client-side validation
- Demo order confirmation and local order history
- Customer/account summary and order export
- Store manager: add, edit and delete products
- Product catalogue export to JSON and CSV; JSON import with basic validation
- Newsletter demo stores submitted email addresses locally
- `localStorage` persistence and cross-tab storage refresh
- Keyboard support: `Escape` closes surfaces and `Ctrl/Cmd + K` focuses search
- Responsive layouts for desktop, tablet and mobile
- Accessible labels, live product results, reduced-motion support and validation messages

## Project structure

```text
ShopEase-Ecommerce/
├── index.html
├── style.css
├── script.js
├── README.md
└── VIVA.md
```

Product images are loaded from Unsplash URLs, so an internet connection is needed for the photos and optional Google Fonts. The core interface and product data run locally.

## Setup

1. Download or copy all five project files into one folder named `ShopEase-Ecommerce`.
2. Open the folder in Visual Studio Code or another editor.
3. Open `index.html` directly in a browser, or use the **Live Server** extension in VS Code for a local development server.
4. Browse products, add items to the bag, adjust quantities, and test checkout using sample details.
5. Click the small gear button in the bottom-left corner to open the local Store Manager.
6. Use **Export JSON** or **Export CSV** to download the catalogue. Export a backup before importing a new catalogue.

No npm installation, framework, database or backend is required.

## How to use the website

### Shopping
- Search using the search field; results update as you type.
- Select a category, adjust the maximum price or choose a sort order.
- Use the heart icon to save a product to the wishlist.
- Use the plus button or Quick view to add a product to the bag.
- Open Cart, adjust quantities or remove items, and proceed to checkout.
- Enter a name, email, phone, six-digit PIN code, address and city.
- Confirm the details and place a **demo** order. Stock is reduced and the order is stored locally.

### Store Manager
- Click the gear icon in the bottom-left corner.
- Add a product or edit/delete an existing item.
- Export the catalogue as JSON or CSV.
- Import a JSON array matching the product fields. Import replaces the current catalogue, so back up first.

The manager is intentionally visible as a project demonstration and is **not secure administration**. Any visitor using this browser can access it.

## Data and persistence

The application uses these `localStorage` keys:

| Key | Contents |
|---|---|
| `shopease_products_v1` | Product catalogue and stock |
| `shopease_cart_v1` | Cart product IDs and quantities |
| `shopease_wishlist_v1` | Saved product IDs |
| `shopease_orders_v1` | Demo orders |
| `shopease_customer_v1` | Last checkout details |
| `shopease_newsletter_v1` | Newsletter email addresses entered in the demo |

Data is saved in the current browser profile on the current origin. It is not synced to another device and can be removed when site data is cleared. Anyone with access to the browser profile may inspect or modify it. Do not store real credentials, payment data or sensitive personal information.

## Product data format

The product manager imports a JSON array. A minimal product object looks like:

```json
[
  {
    "id": "p-demo-1",
    "name": "Demo Desk Lamp",
    "category": "Home",
    "price": 999,
    "originalPrice": 1299,
    "stock": 10,
    "rating": 4.5,
    "reviews": 12,
    "badge": "New",
    "isNew": true,
    "image": "https://example.com/lamp.jpg",
    "description": "A compact desk lamp for a comfortable study space."
  }
]
```

Supported categories: `Electronics`, `Fashion`, `Home`, `Beauty`, `Sports`. The image URL must use HTTP or HTTPS. For the most consistent results, provide all fields used by the sample product objects.

## Technical overview

- **HTML:** semantic sections, product containers, forms, dialogs, table and navigation
- **CSS:** custom properties, Grid, Flexbox, responsive media queries, focus styles and reduced-motion preferences
- **JavaScript:** product arrays and objects, DOM rendering, event delegation, array methods, validation, sorting/filtering, JSON parsing and browser storage
- **Persistence:** JSON serialization to/from `localStorage`
- **Export:** Blob + object URL + download link
- **Import:** FileReader + JSON parsing + field validation

## Limitations and possible future improvements

- Add a backend API and database for shared products, stock and orders.
- Add real authentication with server-side sessions and role-based access.
- Integrate a payment provider in test mode, then follow its production security guidance.
- Add server-side validation, rate limiting, audit logging and secure secrets management.
- Replace external image URLs with locally licensed assets.
- Add automated tests, pagination, product variants, reviews and a proper order lifecycle.
- Add a real email/newsletter service only with consent and suitable privacy disclosures.

## Troubleshooting

- **Images do not load:** check your internet connection. Image URLs are external; the product cards have fallback placeholders.
- **Changes disappear:** confirm browser storage is enabled and you are using the same browser and origin. Private browsing may clear data when closed.
- **Import rejected:** check that the file is valid JSON, contains an array, uses supported categories and has valid image URLs.
- **Cart does not allow a quantity:** the demo enforces the current product stock.
- **Styles are missing:** verify `style.css` is beside `index.html` and the filename matches exactly.

## Academic note

This project demonstrates frontend development concepts. In your submission, explain which features are simulated, what data is stored locally, and why production e-commerce systems require server-side validation and secure payment integration.
