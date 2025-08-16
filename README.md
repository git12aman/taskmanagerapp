***

# Task Management System

A **full-stack web application** for managing tasks and users. Built with [React](https://react.dev/) (frontend) and [Node.js/Express](https://expressjs.com/) (backend) with MongoDB for data storage, supporting authentication, CRUD operations, file uploads, filtering, sorting, and containerization with Docker.

***

## 🚀 Features

- **User Registration & Login**
  - Secure password hashing
  - JWT authentication
  - Admin/user roles
- **Task Management**
  - Create/read/update/delete tasks
  - Assign tasks to users
  - Attach up to 3 PDF documents per task
  - View/download attached documents
  - Filter/sort by status, priority, due date
- **User Management**
  - CRUD operations (admin only)
  - Role-based access control
- **Responsive UI**
  - Built with React and Material UI/Tailwind CSS
  - Form validation and error handling
- **State Management**
  - Using Redux Toolkit for scalable state
- **API**
  - RESTful design with best practices
  - Filtering, sorting, pagination
- **File Storage**
  - PDFs stored locally or on cloud (S3 option)
  - File metadata tracked in DB
- **Testing**
  - Unit & integration tests (Jest, Cypress)
  - >80% code coverage
- **Containerization**
  - Dockerfile & Docker Compose for easy setup
- **API Documentation**
  - Swagger (OpenAPI) or Postman collection

***

## 🗂 Project Structure

```
task-manager/
│
├── backend/
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express route handlers
│   ├── middlewares/   # Auth, error, admin, etc.
│   ├── controllers/   # Business logic
│   ├── uploads/       # PDF files storage
│   ├── tests/         # Jest/Mocha tests
│   ├── app.js
│   ├── server.js
│   ├── .env
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── ...etc
│   ├── public/
│   ├── package.json
│   ├── README.md
│   ├── .env
│   └── Dockerfile
│
├── .gitignore
├── README.md
└── ...
```

***

## ⚡️ Quickstart (Local Development)

### Prerequisites

- **Node.js** ≥ 18
- **npm**
- **Docker & Docker Compose**
- **MongoDB** (local or Atlas cloud)

### 1. Clone the Repository

```bash
git clone https://github.com//.git
cd 
```

### 2. Configure Environment Variables

- **backend/.env:**
    ```env
    MONGO_URI=mongodb://mongo:27017/taskdb   # for docker
    JWT_SECRET=supersecretkey
    PORT=5000
    ```

- **frontend/.env:**
    ```
    REACT_APP_API_URL=http://localhost:5000/api
    ```

### 3. Run with Docker Compose

```bash
docker compose up --build
```

- This will build and run both backend, frontend, and MongoDB in containers.
- Access backend API at `http://localhost:5000/api`
- Access frontend at `http://localhost:3000`

***

## 📝 API Documentation

- Interactive docs via Swagger:  
  Visit `http://localhost:5000/api/docs` (if enabled)
- Or use included Postman collection (`docs/TaskManager.postman_collection.json`).

### Example Endpoints

- `POST /api/auth/register` – Register user
- `POST /api/auth/login` – Login user, get JWT
- `GET /api/users` – List users (admin)
- `POST /api/tasks` – Create task
- `GET /api/tasks` – List/filter tasks
- `PATCH /api/tasks/:id` – Update task
- `DELETE /api/tasks/:id` – Delete task
- `GET /api/tasks/:id/document/:docIndex` – Download task document

***

## 🧑💻 Developer Notes

- **Authentication & Authorization:**  
  All endpoints except `register`/`login` require JWT. Use Bearer token in headers.
  Admin routes protected with middleware.
- **Filtering, Sorting, Pagination:**  
  Use query params: `/api/tasks?status=todo&priority=high&sortBy=dueDate&order=desc&page=2&limit=10`
- **File Uploads:**  
  Attach documents via multipart/form-data (PDF only, max 3 per task).
- **Frontend:**  
  Built with React + Redux + MaterialUI/Tailwind, supports real-time validation and loading/error states.
- **Testing:**  
  Run backend tests: `npm test` (Jest)  
  Run frontend tests: `npm test` (React Testing Library/Cypress)

***

## 🧪 Testing

- Unit tests for models, authentication, and core business logic.
- Integration tests for routes (backend).
- End-to-end tests for main flows (frontend).
- >80% test coverage (see `/coverage` folder after running tests).

***

## 🚚 Deployment

- **Docker Compose:**  
  Deploy locally or on VPS/cloud with one command:
  ```bash
  docker compose up --build
  ```
- **Cloud Deployment:**  
  Can deploy to Heroku, AWS, DigitalOcean, Render, or Railway. See `/docs/deploy.md` for platform-specific instructions.

***

## 📄 Additional Documentation

- **API Reference:** See `/docs/api.md` or Swagger UI.
- **Design Decisions:** See `/docs/architecture.md`
- **Postman Collection:** See `/docs/TaskManager.postman_collection.json`

***



Modify as needed for your project specifics, but this covers everything expected for your assignment.

[1] https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/91767320/afc7ff84-8817-4586-8c80-6d91ea775856/Full-Stack-Developer-Assignmnet-PanScience-Innovations.pdf
