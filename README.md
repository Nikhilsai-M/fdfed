# Smart Exchange

Smart Exchange is a full-stack marketplace for buying, selling, and managing phones, laptops, and accessories. The project includes a React frontend, an Express + MongoDB backend, role-based authentication for users, sellers, supervisors, and admins, and Swagger-powered API documentation for testing and integration.

## Highlights

- Buy and browse phones, laptops, and accessories
- Sell device application workflows for phones and laptops
- Seller onboarding, product management, dashboard, orders, and profile analytics
- Supervisor workflows for application verification and inventory handling
- Admin analytics for products, sales, sellers, statistics, and staff management
- Search, notifications, orders, payment, profile, and customer account flows
- Swagger UI for interactive API documentation
- Docker development setup for frontend, backend, and MongoDB

## Tech Stack

### Frontend

- React 19
- Vite
- React Router
- Redux Toolkit
- Tailwind CSS
- Recharts / Chart.js
- Axios

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT / cookie-based authentication
- Multer for uploads
- Cloudinary for image storage
- Swagger JSDoc + Swagger UI Express
- Razorpay integration
- Nodemailer for email/OTP flows

## Repository Structure

```text
fdfed/
  api/        Express backend, MongoDB models, routes, Swagger, services
  client/     React + Vite frontend
  .env        Environment variables
  docker-compose.yml
  DOCKER.md
```

### Backend structure

- `api/index.js`: application bootstrap, middleware, route registration, Swagger setup
- `api/routes/`: REST API endpoints grouped by module
- `api/controllers/`: request handlers and business logic orchestration
- `api/crud/`: DB-facing data operations and seeding helpers
- `api/models/`: Mongoose schemas
- `api/middleware/`: auth and upload middleware
- `api/services/`: cross-module services like analytics and request matching
- `api/utils/`: helpers for auth, mail, Cloudinary, and error handling

### Frontend structure

- `client/src/pages/`: route-level screens
- `client/src/components/`: reusable UI components
- `client/src/store/`: Redux store and auth slice
- `client/src/context/`: cart and notification context
- `client/src/assets/` and `client/public/`: images and static assets

## Core Modules

### Marketplace

- Phones
- Laptops
- Accessories
  - Chargers
  - Earphones
  - Mouses
  - Smartwatches
- Search
- Product listings and details

### Selling and review workflows

- Phone sell application
- Laptop sell application
- Supervisor verification flows
- Inventory management

### Roles supported

- Customer/User
- Seller
- Supervisor
- Admin

### Commerce and engagement

- Orders
- Cart
- Payments
- Notifications
- Profile management

## API Overview

The backend is implemented as RESTful web services using JSON and multipart form-data where required.

Representative API areas include:

- `/api/auth`
- `/api/user`
- `/api/customer`
- `/api/admin`
- `/api/admin-auth`
- `/api/supervisor`
- `/api/supervisor-auth`
- `/api/seller`
- `/api/phones`
- `/api/laptops`
- `/api/Accessories/chargers`
- `/api/Accessories/earphones`
- `/api/Accessories/mouses`
- `/api/Accessories/smartwatches`
- `/api/orders`
- `/api/payment`
- `/api/search`
- `/api/device-requests`

## Swagger Documentation

Swagger UI is available at:

```text
http://localhost:3000/api-docs
```

Swagger is used in this project for:

- documenting all REST routes in one place
- testing APIs without Postman
- showing request parameters, request bodies, cookies, bearer token support, and responses
- validating integration between frontend and backend

Additional demo notes are available in [api/SWAGGER_DEMO.md](D:\WBD_Project\fdfed\api\SWAGGER_DEMO.md).

## Authentication Model

The backend supports both:

- Bearer token authentication through the `Authorization` header
- Cookie-based authentication through access-token cookies

This is why Swagger may show multiple security schemes such as:

- `bearerAuth`
- `accessTokenCookie`
- `adminTokenCookie`
- `supervisorTokenCookie`

## Environment Variables

The project expects values through `.env`. Typical backend values include:

- `MONGO`
- `JWT_SECRET`
- `EMAIL_USER`
- `EMAIL_PASS`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `SESSION_SECRET`
- `CLIENT_ORIGIN`
- `SWAGGER_SERVER_URL`
- `PORT`

Important:

- do not commit production secrets to version control
- rotate any credentials that were used for local testing if they were ever exposed

## Local Development Setup

### Prerequisites

- Node.js 18+ or newer
- npm
- MongoDB connection string

### Install dependencies

Root package is minimal. Install dependencies per app:

```powershell
cd api
npm install

cd ..\client
npm install
```

### Run backend

```powershell
cd api
npm run dev
```

Backend runs on:

```text
http://localhost:3000
```

### Run frontend

Open another terminal:

```powershell
cd client
npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

## Docker Development Setup

This repo includes a Docker Compose development setup.

Run:

```powershell
docker compose up --build
```

Services:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`
- MongoDB: `mongodb://localhost:27017`

### Will code changes reflect automatically?

Yes, in the provided development setup.

Why:

- the project is mounted into the containers as volumes
- backend uses `nodemon`
- frontend uses Vite dev server

You usually only need rebuilds when:

- dependencies change
- `package.json` changes
- Dockerfiles change
- Compose config changes

Full Docker notes are in [DOCKER.md](D:\WBD_Project\fdfed\DOCKER.md).

## Image Uploads

The project uses file upload handling in selected flows, including accessory creation and device application submission.

Current upload pattern includes:

- `multipart/form-data` requests for image upload endpoints
- Multer middleware for parsing uploaded files
- Cloudinary storage for uploaded media

## Notes on Data Initialization

On backend startup, the server initializes seed data for selected modules such as:

- phones
- laptops
- accessories
- supervisors
- admins
- applications

These initialization calls are triggered from [api/index.js](D:\WBD_Project\fdfed\api\index.js).

## Suggested Demo Flow

For a safe backend demo using Swagger:

1. Open Swagger at `http://localhost:3000/api-docs`
2. Try public listing APIs first
3. Sign in using role-specific auth routes
4. Reuse the same session for protected APIs
5. Test profile, inventory, analytics, and order flows after authentication

Refer to [api/SWAGGER_DEMO.md](D:\WBD_Project\fdfed\api\SWAGGER_DEMO.md) for demo notes and seeded login guidance.

## Current Strengths of the Project

- clear separation between frontend and backend
- modular route/controller/model structure on the backend
- role-based feature segmentation
- Swagger-backed API visibility
- Docker-based development workflow
- support for image uploads and external integrations

## Known Improvement Areas

- root-level package management can be simplified with workspaces
- test coverage is not yet formalized
- some documentation and naming conventions can be standardized further
- production deployment settings should be separated more clearly from local development defaults
- secret management should be hardened before production use

## Future Enhancements

- production-ready Docker deployment
- CI/CD pipeline
- automated tests for backend APIs and frontend flows
- centralized API client layer documentation
- rate limiting, monitoring, and stronger production security defaults
- optional GraphQL layer for analytics/dashboard aggregation use cases

## License

This project currently does not define a dedicated license beyond what is present in the package metadata. Add an explicit license before public distribution.

