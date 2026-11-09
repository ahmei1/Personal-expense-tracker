# Steps I took to build this project

This is the order I followed while building the personal expense tracker.

## 1. Research

The first step was a simple research pass to outline everything the project needed.

## 2. Requirements

After that research, these were the requirements:

- Login and signup, so a user can create an account and sign in
- A user must be able to get, create, update, and delete an expense
- A user must see monthly category totals

## 3. Stack

- React + Tailwind
- Node.js + Express
- PostgreSQL + Prisma
- JWT + bcrypt
- Vercel + Render

## 4. API endpoints I planned

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET | `/api/expenses` | Get expenses |
| POST | `/api/expenses` | Create expense |
| PUT | `/api/expenses/:id` | Update expense |
| DELETE | `/api/expenses/:id` | Delete expense |
| GET | `/api/expenses/summary` | Monthly category totals |

The signup route I ended up building is `POST /api/auth/signup`.

## 5. Project structure

I initialized the project in this order:

```text
personal-expense-tracker/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   ├── prisma/
│   └── package.json
├── README.md
└── .gitignore
```

I started with the backend folder, set up the structure I wanted, and used the same layout as the GitHub repo so I could move forward smoothly.

## 6. Database

I installed and configured PostgreSQL and Prisma.

I created the `expense_tracker` database with two tables:

1. users
2. expense

I tested the connection between Prisma and PostgreSQL. The output was:

```text
Successfully connected to PostgreSQL!
Users in database: []
```

## 7. Authentication

I moved straight into authentication. I installed `bcryptjs`, `jsonwebtoken`, and `zod`.

I created `auth.validation.js` and used Zod so the data is checked before it goes into the database.

Then I built signup and checked that it worked.

Then I built login and checked that it worked.

## 8. Expense management

After authentication, I built the expense CRUD:

- create an expense
- get expenses
- update an expense
- delete an expense
- monthly category summary

I created and tested `GET /api/expenses` and `POST /api/expenses` first, then the rest.

### Backend status

| Feature | Status |
| --- | --- |
| Signup and login | Working |
| Password hashing | Working |
| JWT authentication | Working |
| Create expense | Working |
| Get expenses | Working |
| Update expense | Working |
| Delete expense | Working |
| Monthly category summary | Working |

## 9. Frontend

I initialized Vite with React and JavaScript, then installed Axios to make HTTP requests.

Next I built `AuthContext` so the app can access the current user throughout the pages.

I decided to use an HttpOnly cookie instead of local storage for the token. If the token is in local storage, JavaScript can read it. With an HttpOnly cookie, the browser stores the token and sends it, and JavaScript cannot read it.

Because of that, I stepped back to the backend, installed the cookie package, and implemented the cookie before building the login and signup pages.

The login flow is:

1. The user logs in with email and password.
2. The backend verifies the credentials and creates a JWT.
3. The backend sends the JWT in an HttpOnly cookie.
4. The browser stores the cookie automatically.
5. The frontend never reads or stores the JWT.
6. Protected backend routes read and verify the cookie.

Back on the frontend, I installed React Router and Tailwind CSS.

I built these pages:

- `/login`
- `/signup`
- `/dashboard`
- `ProtectedRoute.jsx`

I fetched and listed the existing expenses, and I put the expense form on the dashboard.

Then I added the delete and edit buttons.

The last feature was the monthly summary.

## 10. Design

I wanted the design to be better, but I was short on time, so I left the visual pass until the features were done. After every required feature was built, I used Cursor to design the interface.
