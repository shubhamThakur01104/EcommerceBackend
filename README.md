# EcommerceBackend

Simple Ecommerce Backend API built with Node.js, Express, and MongoDB.

## 🚀 Project Overview

This project provides an ecommerce REST API with user authentication, product listing, reviews, admin product management, cart operations, and order processing.

## 🧭 Tech Stack

- Node.js
- Express
- MongoDB (Mongoose)
- Cloudinary for image upload
- JWT authentication

## ⚙️ Setup Instructions

1. Clone project
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` file in root and add:
   ```env
   PORT=5000
   MONGO_URL=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   CLOUD_NAME=<cloudinary_cloud_name>
   CLOUD_API_KEY=<cloudinary_api_key>
   CLOUD_API_SECRET=<cloudinary_api_secret>
   ```
4. Start server:
   ```bash
   npm start
   ```
5. Server runs at `http://localhost:5000`

---

## 🌐 Base Routes

The app mounts routes as:
- `/user` → authentication
- `/product` → product reviews/public product operations
- `/api` → admin product and user operations
- `/cart` → cart operations
- `/order` → order operations

---

## 🧾 API Endpoints

### 1) Auth Routes (`/user`)

| Endpoint | Method | Auth | Input Body | Output / Status Codes |
|---|---|---|---|---|
| `/user/signup` | POST | No | `{ name, email, password, isAdmin? }` | `201` user created; `409` email exists; `400` validation error |
| `/user/login` | POST | No | `{ email, password }` | `200` success; `400` invalid request; `404` user not found; `401` invalid credentials |
| `/user/updateprofile` | PATCH | Yes (Bearer token) | partial fields to update | `200` updated; `400` no data; `404` not found |
| `/user/logout` | PATCH | Yes | header `Authorization: Bearer <token>` | `200` logged out; `401` missing token |
| `/user/refresh-token` | POST | No | `{ refreshToken }` | `200` returns new accessToken + refreshToken; `400` required; `401` invalid/expired |

#### Access/Refresh token flow
- `accessToken` expires quickly (e.g. 15m). Use it for protected requests.
- `refreshToken` lasts longer (e.g. 7d). Use `/user/refresh-token` to get new tokens when access token expires.

### 2) Public Product + Review Routes (`/product`)

| Endpoint | Method | Auth | Input Body | Output / Status Codes |
|---|---|---|---|---|
| `/product/` | GET | No | none | `200` products; `404` no products |
| `/product/:id` | GET | No | none | `200` product; `404` not found |
| `/product/:id/review` | POST | Yes | `{ comment, rating }` | `201` created; `400` invalid; `404` product not found |
| `/product/:id/reviews` | GET | No | none | `200` list; `404` no reviews |
| `/product/:reviewid` | PATCH | Yes | review fields | `200` updated; `400` invalid; `404` not found |
| `/product/:reviewid` | DELETE | Yes | none | `200` deleted; `404` not found |

### 3) Admin Routes (`/api`)

| Endpoint | Method | Auth | Input | Description | Status Codes |
|---|---|---|---|---|---|
| `/api/product` | GET | Admin | none | Get all products | `200` success |
| `/api/product` | POST | Admin | multipart/form-data with images + JSON fields: `name, description, price, brand, stockAmount, category, colors, sizes` | Add product with images | `201` created; `400` missing fields; `409` exists |
| `/api/product/:id` | PATCH | Admin | JSON update object | Update product | `200` updated; `404` not found |
| `/api/product/:id` | DELETE | Admin | `{ productDelete: "temporary"|"permanent"|"all" }` | Delete product | `200`; `404` not found |
| `/api/product/restore/:id` | PATCH | Admin | none | Restore soft delete | `200`; `404` not found |
| `/api/delete/category` | DELETE | Admin | `{ category }` | Delete products by category | `200`; `400` invalid; `404` none found |
| `/api/allusers` | GET | Admin | none | Get all users | `200`; `404` none found |

### 4) Cart Routes (`/cart`)

| Endpoint | Method | Auth | Input Body | Status Codes |
|---|---|---|---|---|
| `/cart/add` | POST | Yes | `{ productId, quantity, totalPrice }` | `201` new cart; `200` updated; `400` missing fields |
| `/cart/getproducts` | GET | Yes | none | `200` cart; `404` empty |
| `/cart/remove` | PATCH | Yes | `{ productId }` | `200` removed; `400` missing; `404` not found |
| `/cart/clear` | PATCH | Yes | none | `200` cleared; `404` no cart |

### 5) Order Routes (`/order`)

| Endpoint | Method | Auth | Input Body | Status Codes |
|---|---|---|---|---|
| `/order/user` | POST | Yes | `{ contactNo, streetNo, city, state, postalCode, country, addressType, isDefault, status, isPaid, paymentMethod }` | `201` order created; `400` missing; `401` invalid user |
| `/order/user/my-orders` | GET | Yes | none | `200` list; `404` none |
| `/order/user/deletehistory` | DELETE | Yes | none | `200` cleared |
| `/order/getorder/:id` | GET | Yes | none | `200` order; `403` unauthorized; `404` not found |
| `/order/admin/all-orders` | GET | Admin | none | `200` list; `404` none |
| `/order/admin/:id/status` | PATCH | Admin | `{ status }` | `200`; `400` invalid; `404` not found |

---

## 🧪 Test with Postman

Use these headers for protected routes:
- `Authorization: Bearer <JWT_TOKEN>`

### Example: create user
POST `/user/signup`
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "123456"
}
```

### Example: login
POST `/user/login`
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

---

## 🔧 Notes
- Admin operations require `isAdmin: true` user and token.
- You must upload image files using multipart form with key `images` for `/api/product` POST.
- Route prefix is set in `index.js`.

---

## 📌 Quick Run

```bash
npm install
npm start
```

Server logs: `Server is successfully running on PORT : <PORT>`
