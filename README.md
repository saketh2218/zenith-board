# Project 1: Zenith Board (Kanban & Notes Workspace)

Zenith Board is a premium personal productivity app combining a status-based Kanban task board with rich focus notes. It features a full custom CSS glassmorphism look, smooth micro-animations, and complete API integration.

## Features
- **Kanban Board**: Drag-and-drop-style column task shifts (To Do, In Progress, Done).
- **Subtasks & Details**: Add subtasks, checklists, description, priority status (Low, Medium, High), and due dates.
- **Focus Notes**: Dynamic notepad section with color tagging and auto-saving.
- **User Authentication**: Secure Sign Up and Log In with password hashing and JWT authorization.
- **Auto-Fallback Database**: Runs on a local JSON file DB (`backend/data/local_db.json`) if MongoDB URI is not configured in `.env`.

## Directory Structure
- `backend/`: Node.js Express backend API server.
- `frontend/`: React + Vite single page application.

## Run Locally

### 1. Run the Backend Server
```bash
cd backend
npm install
npm start
```
By default, the backend will run at `http://localhost:5000`.

### 2. Run the Frontend Client
```bash
cd frontend
npm install
npm run dev
```
By default, the frontend will run at `http://localhost:3000`.

---

## Technical Details

- **Backend**: Built with Express.js, using standard routes, middleware verification (`auth.js`), and database handlers (`config/db.js`).
- **Frontend**: Built with React and Vite. Global state is managed using React Context (AuthContext & BoardContext). Styling is written in native CSS Modules for maximum performance and compatibility.
