# GitHub Profile Analyzer API

A Node.js backend service that analyzes GitHub user profiles using the GitHub public API and stores insights in a MySQL database.

## Tech Stack
- Node.js
- Express.js
- MySQL
- Axios (for GitHub API requests)

## Prerequisites
- Node.js (v14 or higher)
- MySQL Server

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Open your MySQL client (e.g., MySQL Workbench, phpMyAdmin, or terminal).
   - Execute the SQL commands in the `setup.sql` file to create the `github_analyzer` database and the `profiles` table.

3. **Environment Configuration**
   - Copy the `.env.example` file to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Update the `.env` file with your MySQL credentials (especially `DB_PASSWORD`).

4. **Run the Application**
   - **Development mode** (auto-restarts on changes):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```

## API Endpoints

### 1. Analyze a GitHub Profile
Fetches data from the GitHub API and stores it in the MySQL database.
- **URL:** `POST /api/profiles/analyze`
- **Body:**
  ```json
  {
      "username": "octocat"
  }
  ```

### 2. Get All Analyzed Profiles
Fetches a list of all profiles that have been analyzed and stored in the database.
- **URL:** `GET /api/profiles`

### 3. Get a Single Analyzed Profile
Fetches the stored data of a specific profile by their GitHub username.
- **URL:** `GET /api/profiles/:username`
- **Example:** `GET /api/profiles/octocat`

## Features Implemented
- Fetch public profile data from GitHub.
- Store useful insights like public repository count, followers, following, bio, name, avatar, and profile URL.
- On duplicate analysis, the API updates the existing database record dynamically to ensure data is up to date.
- Retrieve all stored profiles or query a specific one.
