# ShopEase E-commerce Website — Viva Questions and Answers

## Project overview

### 1. What is the purpose of this project?
ShopEase is a responsive frontend e-commerce demo. It allows users to browse products, search and filter the catalogue, manage a cart and wishlist, simulate checkout, and review demo orders.

### 2. Which technologies did you use?
HTML5 structures the pages and forms, CSS3 handles visual design and responsive layouts, and vanilla JavaScript implements product rendering, cart operations, validation, filtering and local storage.

### 3. Why did you choose vanilla JavaScript?
It demonstrates core JavaScript and DOM skills without depending on a framework. It is lightweight and can run directly in a browser.

### 4. Does the project have a backend?
No. It is a frontend-only project. Product data, cart, wishlist, customer details and demo orders are stored in the browser's localStorage.

### 5. Is this a production-ready e-commerce site?
No. It is an educational prototype. Production use would require a backend, database, secure authentication, server-side validation, inventory control, payment integration and appropriate privacy/security controls.

## HTML and CSS

### 6. What is semantic HTML?
Semantic HTML uses meaningful elements such as `header`, `nav`, `main`, `section`, `article` and `footer` to communicate the purpose of page regions to browsers, assistive technologies and developers.

### 7. How is the website responsive?
CSS Grid and Flexbox arrange content, and media queries adjust the layout at tablet and mobile widths. Product columns, navigation, forms and footer columns adapt to smaller screens.

### 8. What are CSS custom properties?
They are reusable CSS variables declared with syntax such as `--accent: #c8f169`. ShopEase uses them for consistent colours, spacing-related design values and borders.

### 9. Why use `:focus-visible`?
It makes keyboard focus visible for users navigating with a keyboard, improving accessibility.

### 10. What is the purpose of `alt` text?
It provides a text alternative describing an image for screen readers and when an image cannot be displayed.

## JavaScript

### 11. What is the DOM?
The Document Object Model is the browser's object representation of an HTML document. JavaScript uses it to read and update content, attributes and event handlers.

### 12. What is event delegation?
Event delegation attaches one event listener to a parent element and checks which child control triggered the event. ShopEase uses it for product cards, cart items and admin table actions.

### 13. What is an array of objects?
It is an array in which each item is an object with named properties. The product catalogue is an array of objects containing fields such as `id`, `name`, `category`, `price` and `stock`.

### 14. How does product search work?
The search term is converted to lowercase and checked against product names, categories and descriptions. The matching products are then rendered in the product grid.

### 15. How do category and price filters work together?
The filtering function checks category, search term and maximum price for each product. A product appears only if it satisfies all active conditions.

### 16. How is the cart total calculated?
For each cart item, the script finds its product and multiplies the unit price by the selected quantity. Those values are summed to produce the subtotal; shipping is then added.

### 17. How is stock handled?
The interface prevents adding quantities above available stock. On a successful demo checkout, the selected quantities are subtracted from the locally stored stock.

### 18. What is event handling?
Event handling means running a function in response to an action such as a click, form submission, keyboard input or file selection.

## Browser storage and data

### 19. What is localStorage?
`localStorage` is a browser API that stores string key/value pairs persistently for an origin. Data usually remains after the browser is closed, until it is cleared.

### 20. Why use JSON with localStorage?
Storage values are strings. `JSON.stringify()` converts arrays and objects into strings, and `JSON.parse()` reconstructs JavaScript data from those strings.

### 21. What is the difference between localStorage and sessionStorage?
`localStorage` normally persists across browser sessions. `sessionStorage` is scoped to a tab's page session and is cleared when that session ends.

### 22. What are the limitations of localStorage?
It is browser- and origin-specific, has limited capacity, is accessible to scripts running on the page, and is not a secure database. Users can edit or clear it, and it does not automatically sync across devices.

### 23. How does JSON export work?
The script serializes the product array with `JSON.stringify`, creates a Blob, generates an object URL, and triggers a download using a temporary anchor element.

### 24. How does CSV export work?
The script maps selected product fields into comma-separated rows and escapes quotation marks by doubling them. The resulting text is downloaded as a CSV file.

### 25. How does JSON import work?
A file input selects a file, `FileReader` reads its contents, `JSON.parse` parses it, and validation checks the data before the catalogue is replaced.

## Forms, security and testing

### 26. How is checkout validation performed?
Required fields, email format, phone pattern, six-digit PIN code and minimum text lengths are checked in JavaScript. HTML input attributes also provide basic browser-level validation cues.

### 27. Is client-side validation sufficient for a real store?
No. Client-side validation can be bypassed. A production application must validate input on the server as well.

### 28. Why should real payment details not be stored in localStorage?
Browser storage is accessible to JavaScript running on the page and can be inspected or changed by a user. Sensitive payment data should not be stored there; payment providers should handle payment details through approved secure flows.

### 29. What is the purpose of `escapeHTML()`?
It replaces HTML-significant characters with their corresponding entities before untrusted text is inserted into HTML templates. This helps reduce HTML injection risks for those interpolated values, but it is not a substitute for secure application design.

### 30. How would you test the project?
Test search and filters, sorting, add/remove/update cart operations, stock limits, wishlist persistence, valid and invalid checkout submissions, order creation, product CRUD, JSON/CSV export, invalid imports, refresh persistence, keyboard controls and mobile layouts.

### 31. What happens when the user places an order?
The checkout form is validated, an order record is created, stock is decremented, the order is saved in localStorage, and the cart is emptied. The site shows a demo confirmation. No real transaction is made.

### 32. How could the project be improved?
Add a REST API, database, secure authentication, server-side validation, payment-provider integration, order tracking, product pagination, automated tests and deployment.

## Short demonstration checklist

1. Open the homepage and explain the dark responsive layout.
2. Search for a product and demonstrate category and price filters.
3. Open Quick view and add a product to the cart.
4. Change quantity, remove an item and explain shipping calculations.
5. Add a wishlist item and refresh to demonstrate localStorage.
6. Complete checkout using fictional details and explain the demo order.
7. Open the gear icon, add/edit/delete a product, and export JSON/CSV.
8. Explain why this prototype is not a secure production store.
