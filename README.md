# Finance Backend API
This is a simple backend project built using Node.js and SQLite.  
It is designed for a finance dashboard where users can manage transactions based on their roles.
---
## Features
- User registration and login
- Role-based access (viewer, analyst, admin)
- Active / inactive user status
- Create, view, update, delete transactions
- Filter transactions (type, category, date)
- Dashboard summary (income, expense, balance)
---
## Tech Stack
- Node.js
- Express.js
- SQLite
- JWT Authentication
- bcrypt
---
## Setup
1. Install Node.js  
2. Install dependencies:npm install
3. Run the server:node app.js
Server runs on: `http://localhost:3000`
---
## API Endpoints
### Auth
- POST `/api/auth/register` → Register user  
- POST `/api/auth/login` → Login and get token  
### Users (Admin only)
- GET `/api/users` → Get all users  
- PUT `/api/users/:id` → Update role/status  
### Transactions
- POST `/api/transactions` → Create (Admin)  
- GET `/api/transactions` → View (All users)  
- PUT `/api/transactions/:id` → Update (Admin)  
- DELETE `/api/transactions/:id` → Delete (Admin)  
### Dashboard
- GET `/api/transactions/dashboard/summary`  
  → Total income, expenses, balance, category data  
---
## Roles
- Viewer → Can only view transactions  
- Analyst → Can view transactions + dashboard  
- Admin → Full access (users + transactions)  
---
## How It Works
- User logs in and gets a JWT token  
- Token is used in API requests  
- Middleware checks user role and status  
- Data is stored in SQLite database  
- Dashboard API calculates summary from transacti   ¸¸ons  
---
## Validation & Errors
- Required fields are checked  
- Proper status codes used (400, 401, 403, 404)  
- Inactive users cannot access APIs  
---
## Notes
- SQLite is used for simplicity  
- This is not production-level, only for learning/assessment  
- Focus is on backend design and logic  /