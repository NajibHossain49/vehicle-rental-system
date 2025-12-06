# Vehicle Rental System API

A backend API for managing vehicle rentals, built with **Node.js**, **TypeScript**, and **PostgreSQL**.
This system allows admins to manage vehicles, users, and bookings, while customers can register, browse vehicles, and manage their own rentals.

---

## 🚀 Live Deployment

**Live URL:** https://vehicle-rental-system-chi.vercel.app

**GitHub Repository:** https://github.com/NajibHossain49/vehicle-rental-system

---

## 📦 Features

* **Authentication & Authorization**

  * Secure JWT-based authentication
  * Role-based access control (Admin & Customer)
  * Password hashing using bcrypt

* **User Management**

  * Admin: Manage all users
  * Customers: Update personal profiles

* **Vehicle Management**

  * Admin: Add, update, or remove vehicles
  * Public: View all available vehicles

* **Booking Management**

  * Customers: Create, view, and cancel bookings
  * Admin: View and manage all bookings
  * Automatic status updates for returned vehicles

* **Validation & Security**

  * Input validation and error handling
  * Protected routes for authenticated users
  * Secure database operations with PostgreSQL

---

## 🛠️ Technology Stack

* **Backend:** Node.js, Express.js, TypeScript
* **Database:** PostgreSQL
* **Authentication:** bcrypt, JSON Web Token (JWT)
* **Environment Management:** dotenv

---

## 📁 Project Structure

```
src/
│
├── auth/
│   ├── auth.controller.ts
│   ├── auth.routes.ts
│   └── auth.service.ts
│
├── users/
│   ├── user.controller.ts
│   ├── user.routes.ts
│   └── user.service.ts
│
├── vehicles/
│   ├── vehicle.controller.ts
│   ├── vehicle.routes.ts
│   └── vehicle.service.ts
│
├── bookings/
│   ├── booking.controller.ts
│   ├── booking.routes.ts
│   └── booking.service.ts
│
├── middleware/
│   ├── auth.middleware.ts
│   └── role.middleware.ts
│
├── utils/
│   └── helpers.ts
│
├── config/
│   ├── db.config.ts
│   └── env.config.ts
│
└── server.ts
```

---

## ⚙️ Setup & Installation

### 1. Clone the Repository

```bash
git clone https://github.com/NajibHossain49/vehicle-rental-system.git
cd vehicle-rental-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```
PORT=5000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN
```

### 4. Run Database Migrations

```bash
npx ts-node src/utils/createTables.ts
Create All Database Tables
```

### 5. Start the Server

```bash
npm run dev
```

The server will start at `http://localhost:5000`.

---

## 🔑 API Authentication

**All protected routes require a JWT token in the header:**

```
Authorization: Bearer <token>
```

Use `/api/v1/auth/signup` and `/api/v1/auth/signin` to create or log in to an account.

---

## 🌐 API Endpoints Overview

### Authentication

* `POST /api/v1/auth/signup` – Register a new user
* `POST /api/v1/auth/signin` – Login and receive JWT

### Vehicles

* `POST /api/v1/vehicles` – Add new vehicle (Admin only)
* `GET /api/v1/vehicles` – Get all vehicles
* `GET /api/v1/vehicles/:vehicleId` – Get vehicle details
* `PUT /api/v1/vehicles/:vehicleId` – Update vehicle (Admin only)
* `DELETE /api/v1/vehicles/:vehicleId` – Delete vehicle (Admin only)

### Users

* `GET /api/v1/users` – View all users (Admin only)
* `PUT /api/v1/users/:userId` – Update user details
* `DELETE /api/v1/users/:userId` – Delete user (Admin only)

### Bookings

* `POST /api/v1/bookings` – Create booking (Customer or Admin)
* `GET /api/v1/bookings` – View bookings (Role-based)
* `PUT /api/v1/bookings/:bookingId` – Cancel or return booking

---

## 🧪 Testing

You can test the API using **Postman** or **Insomnia**.
Import the API endpoints and use valid JWT tokens for protected routes.

---

## 🧰 Scripts

| Command         | Description                            |
| --------------- | -------------------------------------- |
| `npm run dev`   | Run development server with hot reload |
| `npm run build` | Build TypeScript project               |
| `npm start`     | Run compiled project                   |
| `npm run lint`  | Run ESLint checks                      |
|`npx ts-node src/utils/createTables.ts`| Create All Database Tables|



---

## 🧑‍💻 Author

Developed by **Najib Hossain**
For more details, visit the GitHub repository or the live deployment link.

---


