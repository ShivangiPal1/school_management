# School Management API

A complete backend project for managing schools. The API allows users to add school records and list schools sorted by distance from a user's location using the Haversine Formula.

## Tech Stack

- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- ES Modules

## Project Structure

```text
project-root/
├── config/
│   └── db.js
├── controllers/
│   └── schoolController.js
├── middleware/
│   └── errorMiddleware.js
├── postman/
│   └── School_Management_API.postman_collection.json
├── routes/
│   └── schoolRoutes.js
├── sql/
│   └── schema.sql
├── utils/
│   └── distanceCalculator.js
├── .env
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## Installation Steps

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Update `.env` with your MySQL credentials.

4. Create the database and table using the SQL script in `sql/schema.sql`.

5. Start the server:

```bash
npm start
```

For development with auto-restart:

```bash
npm run dev
```

## Environment Variables

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=school_management
```

## MySQL Setup

Run this SQL query in MySQL Workbench, phpMyAdmin, or the MySQL CLI:

```sql
CREATE DATABASE IF NOT EXISTS school_management;

USE school_management;

CREATE TABLE IF NOT EXISTS schools (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL
);
```

Using MySQL CLI:

```bash
mysql -u root -p < sql/schema.sql
```

## API Endpoints

Base URL for local development:

```text
http://localhost:5000
```

### Health Check

```http
GET /
```

Example response:

```json
{
  "success": true,
  "message": "School Management API is running"
}
```

### Add School

```http
POST /addSchool
```

Request body:

```json
{
  "name": "ABC School",
  "address": "Delhi",
  "latitude": 28.6139,
  "longitude": 77.209
}
```

Success response:

```json
{
  "success": true,
  "message": "School added successfully",
  "data": {
    "id": 1,
    "name": "ABC School",
    "address": "Delhi",
    "latitude": 28.6139,
    "longitude": 77.209
  }
}
```

Validation error response:

```json
{
  "success": false,
  "message": "Latitude must be a number between -90 and 90"
}
```

### List Schools

```http
GET /listSchools?latitude=28.61&longitude=77.20
```

Success response:

```json
{
  "success": true,
  "message": "Schools fetched successfully",
  "count": 1,
  "data": [
    {
      "id": 1,
      "name": "ABC School",
      "address": "Delhi",
      "latitude": 28.6139,
      "longitude": 77.209,
      "distance": 0.99
    }
  ]
}
```

## Validation Rules

- `name` is required and cannot be empty.
- `address` is required and cannot be empty.
- `latitude` is required and must be between `-90` and `90`.
- `longitude` is required and must be between `-180` and `180`.
- `listSchools` requires valid `latitude` and `longitude` query parameters.

## Postman Testing Steps

1. Open Postman.
2. Click `Import`.
3. Select `postman/School_Management_API.postman_collection.json`.
4. Confirm the `base_url` collection variable is set to `http://localhost:5000`.
5. Run `Health Check` to verify the server is running.
6. Run `Add School` to insert a school into MySQL.
7. Run `List Schools` to fetch schools sorted by nearest distance.

## Deployment Steps

This project is ready for platforms such as Render, Railway, Cyclic, or any Node.js hosting provider.

1. Push the project to GitHub.
2. Create a MySQL database on your hosting platform or an external provider.
3. Add these environment variables in the hosting dashboard:

```env
PORT=5000
DB_HOST=your_database_host
DB_PORT=3306
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=school_management
```

4. Use the following build and start commands:

```bash
npm install
npm start
```

5. Run the SQL from `sql/schema.sql` on the production database.

## Notes

- The API uses `mysql2/promise` with async/await.
- Errors are handled through centralized Express middleware.
- Distance is calculated in kilometers using the Haversine Formula.
