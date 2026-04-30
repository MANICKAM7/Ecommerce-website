# 🛒 AEcommerce - Full Stack E-Commerce Platform

A premium, full-stack e-commerce website built with React.js, Node.js, Express.js, and MySQL.

## Tech Stack

- **Frontend**: React.js + Vite, React Router, Axios
- **Backend**: Node.js + Express.js, JWT Auth, bcrypt
- **Database**: MySQL with mysql2

## Project Structure

```
Aecommerce/
├── client/          # React.js frontend
├── server/          # Node.js + Express backend
└── README.md
```

## Quick Start

### 1. Setup MySQL Database
Run the SQL script: `server/database/schema.sql`

### 2. Configure Environment
Copy `server/.env.example` to `server/.env` and fill in your MySQL credentials.

### 3. Install & Run Backend
```bash
cd server
npm install
npm run dev
```

### 4. Install & Run Frontend
```bash
cd client
npm install
npm run dev
```

Frontend runs on http://localhost:5173
Backend runs on http://localhost:5000
