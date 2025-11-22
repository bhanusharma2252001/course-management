# NestJS Course Management

This project is a backend implementation using **NestJS** and **MongoDB**.  
It contains three main modules:

- Category
- SubCategory
- Course

Each module supports CRUD operations along with validation, search, filtering, sorting, pagination, and soft delete.

---

## Features

- Full CRUD operations for all modules
- Validation using DTOs
- MongoDB text indexing for search
- Pagination, filtering, and sorting
- Soft delete support using `isDeleted`
- Relationship rules:
  - SubCategory must belong to a valid Category
  - Course can belong to multiple Categories and SubCategories
  - All SubCategories selected in Course must belong to selected Categories
- Aggregation API to return Category with SubCategory count

---

## Requirements

- Node.js (v18 or above recommended)
- MongoDB (Local or Atlas)

---

## Installation

```sh
npm install
```

---

## Environment Variables

Create a `.env` file in the root:

```
MONGODB_URI=mongodb://localhost:27017/nest-assignment
```

---

## Run the Project

Development mode:

```sh
npm run start:dev
```

Production build:

```sh
npm run build
npm start
```

Server will run at:

```
http://localhost:3000
```

---

```

---

## Postman Collection

Import the file included in the project:

```

blueocean.postman_collection.json

