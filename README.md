# Personal Expense Tracker

A full-stack web application for managing personal expenses. Users can create an account, securely sign in, and track their spending through a simple dashboard.

This project was developed as the practical technical assessment for the Software Development Internship at **Cylacon Ltd**.

The implementation process, technical decisions, and development notes are documented in [`steps.md`](./steps.md).

## Features

- **User authentication:** Sign up, sign in, and sign out.
- **Expense management:** Create, view, update, and delete expenses.
- **Expense details:** Record a title, optional description, amount, category, and date.
- **Filtering:** Filter expenses by category and month.
- **Monthly summary:** View total monthly spending and a breakdown by category.
- **Protected resources:** Users can only access and manage their own expenses.
- **Input validation:** Validate incoming data on the backend.

## Technology Stack

| Area           | Technologies        |
| -------------- | ------------------- |
| Frontend       | React, Tailwind CSS |
| Backend        | Node.js, Express    |
| Database       | PostgreSQL          |
| ORM            | Prisma              |
| Authentication | JWT, bcrypt         |
| Validation     | Zod                 |
| HTTP Client    | Axios               |

## Live Demo

- **Frontend:** https://personal-expense-tracker-zeta-seven.vercel.app/
- **Backend API:** https://personal-expense-tracker-k9i9.onrender.com/

The hosted frontend calls `/api` on its own domain. Vercel forwards those requests to the backend, so signup and the login cookie stay on the frontend domain.
- **GitHub Repository:** https://github.com/ahmei1/Personal-expense-tracker

## Security

Authentication uses JSON Web Tokens (JWT) stored in an **HttpOnly cookie**.

- Passwords are hashed using bcrypt before being stored.
- The JWT is sent automatically by the browser with requests.
- The frontend does not directly access or store the authentication token.
- Protected API routes verify the user's authentication.
- Expense queries are scoped to the authenticated user's ID.
- Backend request data is validated using Zod.

This approach helps protect authentication credentials and prevents users from accessing other users' expense records.

## Project Structure

```text
personal-expense-tracker/
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── validations/
│   ├── prisma/
│   └── package.json
├── README.md
├── steps.md
└── .gitignore
```

The database contains two main models:

- **User:** Stores user account information.
- **Expense:** Stores expense records linked to their owner.

Each expense is associated with a user through a database relationship.

## API Endpoints

All endpoints use the `/api` prefix.

### Authentication

| Method | Endpoint           | Description                           |
| ------ | ------------------ | ------------------------------------- |
| POST   | `/api/auth/signup` | Register a new user                   |
| POST   | `/api/auth/login`  | Authenticate and set the login cookie |
| POST   | `/api/auth/logout` | Log out and clear the cookie          |
| GET    | `/api/auth/me`     | Retrieve the authenticated user       |

### Expenses

| Method | Endpoint                              | Description                                 |
| ------ | ------------------------------------- | ------------------------------------------- |
| GET    | `/api/expenses`                       | Retrieve the user's expenses                |
| POST   | `/api/expenses`                       | Create an expense                           |
| PUT    | `/api/expenses/:id`                   | Update an expense                           |
| DELETE | `/api/expenses/:id`                   | Delete an expense                           |
| GET    | `/api/expenses/summary?month=YYYY-MM` | Retrieve monthly totals grouped by category |

**Note:** Expense endpoints require authentication. Users can only access expenses belonging to their own accounts.

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- PostgreSQL

### 1. Clone the repository

```bash
git clone https://github.com/ahmei1/Personal-expense-tracker
cd personal-expense-tracker
```

### 2. Set up the database

Create a PostgreSQL database named: `expense_tracker`

Make sure your PostgreSQL user has permission to access the database and run migrations.

### 3. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory using `.env.example` as a reference.

Configure the following environment variables:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/expense_tracker"
JWT_SECRET="your-long-random-secret"
JWT_EXPIRES_IN="1d"
```

Replace `USER` and `PASSWORD` with your PostgreSQL credentials. Use a strong, randomly generated JWT secret.

Apply the database migrations:

```bash
npx prisma migrate dev
```

Start the backend development server:

```bash
npm run dev
```

The API should now be available at:

`http://localhost:5000`

You can check whether the server is running by visiting:

`http://localhost:5000/api/health`

### 4. Set up the frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

Open the application at:

`http://localhost:5173`

Create an account and sign in to start managing your expenses.

## Testing

The application was manually tested to verify:

- User registration, login, and logout.
- Protected routes and authentication.
- Creating, editing, and deleting expenses.
- Filtering expenses by category and month.
- Monthly summaries and category charts.
- Data isolation between user accounts.
- Responsive behavior across different screen sizes.

## AI Assistance

AI tools were used to assist with user interface design and visual improvements.

The frontend and backend functionality was implemented and manually tested by the developer. AI assistance was also used where appropriate during development and troubleshooting.

The development process and technical decisions are documented in [steps.md](./steps.md).

## Future Improvements

Potential improvements include:

- Expense search.
- Pagination for larger expense lists.
- Automated backend and frontend tests.
- Production deployment.

\*Note: i have build frontend and backend features and tested them by myself, i used AI for designing the user interface so i can focus on the main features and make sure they are working effeciently.

## Author

Developed as part of the Cylacon Ltd Software Development Internship technical assessment.
