# Simple Login System with Temporary Lockout

A full-stack login application featuring a **Node.js/Express backend**, **SQLite database**, and a **vanilla JavaScript frontend**. Includes a security feature that temporarily blocks users after multiple successful logins to simulate session throttling.

## 🚀 Features

* **User Registration:** Allows new users to create accounts with unique emails.
* **User Login:** Validates credentials against a persistent database.
* **Persistent Storage:** Uses SQLite to ensure data remains available even after server restarts.
* **Smart Lockout:** After 4 successful logins, the user is blocked for **10 seconds**. The frontend shows a real-time countdown.

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (Fetch API)
* **Backend:** Node.js, Express.js
* **Database:** SQLite (`better-sqlite3`)
* **Security:** CORS enabled

## 📂 Project Structure

Simple-Login-System/
├── server.js           # Express API and SQLite database logic
├── index.html          # Frontend UI and client-side logic
├── package.json        # Node.js dependencies
├── package-lock.json   # Locked dependency versions
└── users.db            # SQLite database file (auto-generated)
-

## 📥 Clone the Repository

Clone this repository to your local machine:

git clone https://github.com/Sonali-b23/Simple-Login-System.git
cd Simple-Login-System

## 🏃 How to Run Locally

### 1. Prerequisites

Ensure [Node.js](https://nodejs.org/) is installed.

### 2. Install Dependencies

npm install

### 3. Start the Server

node server.js

The backend server will run at: `http://localhost:3000`

### 4. Access the App

* Navigate to `http://localhost:3000` in your browser
* Or open `index.html` directly

## 🧪 Test the Workflow

1. **Register:** Enter an email and password, then click **"Register New Account"**
2. **Login:** Enter the credentials and click **"Login"**
3. **Trigger Lockout:** Successfully log in 4 times
4. **Verification:** On the 5th attempt, a message appears:
   *"Limit reached. Please wait X seconds to try again."*
5. **Reset:** Wait 10 seconds, then log in successfully

## 📝 Design Decisions

* **SQLite over NoSQL:** Lightweight, file-based persistence, no server setup required
* **Stateless Backend:** Lockout logic in database ensures it persists across server restarts
* **Vanilla JavaScript Frontend:** Simple, dependency-free, smooth API integration
