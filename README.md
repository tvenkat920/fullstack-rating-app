# Full Stack Rating Application (RateMate)

A complete, production-quality, full-stack store rating platform built with **React**, **Node.js/Express**, **PostgreSQL**, and **Prisma ORM**. The platform supports role-based access control (RBAC), multi-role dashboards, dynamic filtering/sorting, real-time average score recalculation, and strict end-to-end data validation.

---

## 🚀 Key Highlights & Features

- **Multi-Role Access Control (RBAC)**:
  - **System Administrator**: Manage users, add new stores with assigned owners, view global metrics (total users, total stores, total ratings), and apply multi-column sorting and filtering across users and stores.
  - **Store Owner**: View stores owned by them, observe real-time average ratings, and review detailed user feedback and submitted ratings.
  - **Normal User**: Browse all stores, search by store name/address, sort stores by average rating or name, submit ratings (1 to 5 stars), and modify existing ratings anytime with instant UI updates.
- **Strict Data Validation & Security**:
  - **Name**: Min 20 characters, Max 60 characters.
  - **Address**: Max 400 characters.
  - **Password**: 8–16 characters, must include at least one uppercase letter and one special character (`!@#$%^&*(),.?":{}|<>`).
  - **Email**: Standard RFC 5322 email regex validation.
  - **Rating**: Integer values between 1 and 5 only.
  - **Password Hashing**: Salty hashing via `bcryptjs`.
  - **Authentication**: Stateless JSON Web Tokens (JWT) verified via Express middleware.
- **Modern Responsive UI**:
  - Built with React 18, Vite, Tailwind CSS, Lucide icons, and modern glassmorphic design principles.
  - Star rating component with interactive hover states and color indicators.
  - Toast notifications and inline field validation messages for high-quality UX.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router v6, Axios, Tailwind CSS, Lucide React |
| **Backend** | Node.js, Express.js, Prisma ORM, JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, CORS, Dotenv |
| **Database** | PostgreSQL (supported via standard PostgreSQL connection or embedded PG utility) |

---

## 📂 Project Architecture & Directory Structure

```
fullstack-rating-app/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma           # Prisma schema with User, Store, Rating models & Enums
│   │   └── seed.js                 # Database seeder with sample users, stores & ratings
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js               # Prisma client singleton
│   │   ├── controllers/
│   │   │   ├── authController.js   # Register, Login, Current User profile, Password update
│   │   │   ├── adminController.js  # Admin metrics, user management, store creation
│   │   │   ├── storeController.js  # Store listing, owner dashboard, search & filtering
│   │   │   └── ratingController.js # Submit rating, update rating, fetch user rating
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js   # JWT authentication & role-based authorization guards
│   │   │   └── errorMiddleware.js  # Centralized error handler and 404 catcher
│   │   ├── routes/
│   │   │   ├── authRoutes.js       # /api/auth endpoints
│   │   │   ├── adminRoutes.js      # /api/admin endpoints
│   │   │   ├── storeRoutes.js      # /api/stores endpoints
│   │   │   └── ratingRoutes.js     # /api/ratings endpoints
│   │   ├── utils/
│   │   │   ├── validators.js       # Reusable regex and boundary validator rules
│   │   │   └── startEmbeddedPg.js  # Embedded PostgreSQL runner for zero-install demo
│   │   ├── app.js                  # Express app setup & route mounting
│   │   └── server.js               # Server entry point & graceful shutdown
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx          # Dynamic navigation bar with role badge & logout
│   │   │   ├── StarRating.jsx      # Interactive 1-5 star selector and read-only rating display
│   │   │   └── ProtectedRoute.jsx  # Client-side route guard with RBAC redirects
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # User authentication state & token persistence
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx      # Base responsive layout with header and footer
│   │   ├── pages/
│   │   │   ├── LoginPage.jsx       # Single login portal with role-based routing
│   │   │   ├── RegisterPage.jsx    # User registration with real-time field validation
│   │   │   ├── AdminDashboard.jsx  # Admin KPIs, users table, stores list, & store modal
│   │   │   ├── UserDashboard.jsx   # Store catalog, search, sort, and rating submission
│   │   │   ├── OwnerDashboard.jsx  # Store owner analytics and customer rating lists
│   │   │   └── ProfilePage.jsx     # Password change and user details
│   │   ├── services/
│   │   │   └── api.js              # Axios instance with auto-injected Bearer tokens
│   │   ├── App.jsx                 # Route definitions and provider tree
│   │   ├── index.css               # Tailwind CSS base and custom utility classes
│   │   └── main.jsx                # Application root mount
│   ├── index.html
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔑 Demo Credentials

All test accounts share passwords adhering to the strict complexity policy:

| Role | Email | Password | Details |
|---|---|---|---|
| **System Administrator** | `admin@example.com` | `Admin@123` | Full administrative privileges, user & store management |
| **Normal User 1** | `user@example.com` | `User@123` | Standard shopper account with pre-seeded ratings |
| **Normal User 2** | `sarah.connor@example.com` | `User@123` | Secondary user account for testing multiple ratings |
| **Store Owner 1** | `owner@example.com` | `Owner@123` | Owns "Tech Galaxy", "Urban Harvest", "Artisan Goods" |
| **Store Owner 2** | `owner2@example.com` | `Owner@123` | Owns "Boulder Heritage Books", "Mountain Peak Coffee" |

---

## ⚙️ Setup & Installation Instructions

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local or remote instance (or use the built-in embedded PostgreSQL)

---

### 2. Backend Setup

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   *Sample `.env`:*
   ```env
   PORT=5000
   DATABASE_URL="postgresql://postgres:password@localhost:5432/rating_db?schema=public"
   JWT_SECRET="super-secret-jwt-key-replace-in-production-123456"
   JWT_EXPIRES_IN="7d"
   CORS_ORIGIN="http://localhost:5173"
   ```

4. Database Migration & Seeding:
   - **If you have PostgreSQL running**:
     ```bash
     npm run prisma:push
     npm run seed
     ```
   - **If you don't have a local PostgreSQL installed**:
     The project includes an embedded PostgreSQL utility:
     ```bash
     npm run db:start
     ```
     Once active, run:
     ```bash
     npm run prisma:push
     npm run seed
     ```

5. Start the Backend API server:
   ```bash
   npm start
   # or for auto-reloading development mode:
   npm run dev
   ```
   The backend API will run on `http://localhost:5000`.

---

### 3. Frontend Setup

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to:
   **`http://localhost:5173`**

---

## 📡 Main API Endpoints

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/register` - Create a new user account (Normal User or Store Owner by Admin).
- `POST /api/auth/login` - Authenticate user credentials and return JWT token + user profile.
- `GET /api/auth/me` - Fetch currently authenticated user's profile (*Protected*).
- `PUT /api/auth/change-password` - Update current user password (*Protected*).

### 🛡️ Admin Portal (`/api/admin`) *(Requires ADMIN Role)*
- `GET /api/admin/metrics` - Global stats: Total Users, Total Stores, Total Ratings Submitted.
- `GET /api/admin/users` - List all users with query params (`role`, `search`, `sortBy`, `sortOrder`).
- `POST /api/admin/users` - Create a new user (Admin, Store Owner, or User) directly.
- `GET /api/admin/stores` - List all stores with owner information and ratings.
- `POST /api/admin/stores` - Create a new store and assign it to a Store Owner.

### 🏪 Stores (`/api/stores`)
- `GET /api/stores` - Browse stores with search (`search`), sorting (`sortBy`, `sortOrder`), and user-specific submitted ratings (*Protected: USER, ADMIN*).
- `GET /api/stores/owner` - View stores owned by the authenticated Store Owner with customer ratings breakdown (*Protected: STORE_OWNER*).
- `GET /api/stores/:id` - Retrieve store details and rating statistics (*Protected*).

### ⭐ Ratings (`/api/ratings`) *(Requires USER Role)*
- `POST /api/ratings` - Submit a new rating or modify an existing rating for a store (1 to 5 stars).
- `GET /api/ratings/my-ratings` - Fetch all ratings submitted by the current user.
- `GET /api/ratings/store/:storeId` - Fetch current user's rating for a specific store.

---

## 🧪 Form Validation Specifications

| Field | Rule | Error Message / Behavior |
|---|---|---|
| **Name** | Minimum 20 characters, Maximum 60 characters | "Name must be between 20 and 60 characters long." |
| **Address** | Maximum 400 characters | "Address cannot exceed 400 characters." |
| **Password** | 8 to 16 characters, at least 1 uppercase letter (`[A-Z]`), at least 1 special character | "Password must be 8-16 characters and contain at least 1 uppercase letter and 1 special character." |
| **Email** | Valid RFC 5322 format | "Please provide a valid email address." |
| **Rating** | Integer between 1 and 5 | "Rating must be an integer between 1 and 5." |

---

## 💡 Assumptions & Design Decisions

1. **Role Separation**:
   - `ADMIN` has full visibility into user accounts, store inventories, and platform metrics.
   - `STORE_OWNER` can view detailed customer reviews and average ratings for stores they own, but cannot rate stores.
   - `USER` can browse all stores, filter/sort, and submit/modify their own ratings.
2. **Upsert Ratings**:
   - Each user can only have one rating per store. Submitting a new rating for a store the user has already rated seamlessly updates their existing rating, recalculating the store's average rating in real time.
3. **Database Portability**:
   - Built with Prisma ORM, allowing instant switching between local PostgreSQL, cloud PostgreSQL (Supabase, Neon, AWS RDS), or embedded PostgreSQL.
4. **Graceful Zero-Configuration**:
   - An embedded PostgreSQL script (`npm run db:start`) is included to allow evaluators without local PostgreSQL installations to run the full application with a single command.

---

## 🏆 Summary for Interview Evaluation

- **Code Quality**: Clean modular architecture separating routing, controllers, models, and shared utilities.
- **Security**: Password hashing via `bcryptjs`, JWT bearer authentication, role guards on all sensitive routes, input sanitization, and SQL injection prevention via Prisma parameterized queries.
- **Responsive Aesthetics**: Modern card layouts, responsive dynamic views, accessible form controls, and clean interactive feedback.
