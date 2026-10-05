# GroceCart

GroceCart is a full-stack grocery commerce and delivery platform. Customers can browse products, manage a cart, place orders, and follow deliveries. Admins manage the catalogue and operations, while delivery agents accept and complete assigned orders.

## Features

- Customer storefront with product search, categories, product details, cart, addresses, checkout, and order history
- Guest-cart persistence and authenticated-cart support
- Role-based customer, admin, and delivery-agent experiences
- Admin tools for products, users, delivery agents, orders, and dashboard metrics
- Delivery workflow for accepting, tracking, and completing orders, with earnings history
- Real-time delivery-location updates through Socket.IO
- Cloudinary-backed product image uploads
- Redis caching for the public catalogue

## Tech stack

| Area | Technology |
| --- | --- |
| Frontend | React, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express, Socket.IO |
| Data | MongoDB with Mongoose, Redis |
| Services | Cloudinary, Google OAuth, Geoapify |
| Containerization | Docker Compose and Nginx |

## Repository layout

```text
.
├── Frontend/       # React/Vite client
├── Backend/        # Express API, Socket.IO server, and database models
├── docker-compose.yml
└── PRD.md          # Product requirements document
```

## Prerequisites

- Node.js 20+ and npm
- MongoDB
- Redis
- Cloudinary account (for product images)

Docker Desktop is required only for the containerized setup.

## Environment configuration

Create local environment files from the provided examples:

```powershell
Copy-Item Backend/.env.example Backend/.env
Copy-Item Frontend/.env.example Frontend/.env
```

Update the placeholder values before running the app.

### Backend variables

| Variable | Purpose |
| --- | --- |
| `PORT` | API and Socket.IO port (default: `8000`) |
| `MONGODB_URL` | MongoDB connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` / `JWT_EXPIRES` | Authentication token configuration |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Initial admin credentials |
| `CLOUDINARY_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `CORS_ORIGIN` | Comma-separated allowed client origins |

### Frontend variables

| Variable | Purpose |
| --- | --- |
| `VITE_BACKEND_URL` | Backend base URL, such as `http://localhost:8000` for local development |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `VITE_GEOAPIFY_KEY` | Geoapify key used by map-related views |

## Run locally

Install dependencies in each application directory:

```powershell
Set-Location Backend
npm install

Set-Location ../Frontend
npm install
```

Start MongoDB and Redis locally, then run the backend and frontend in separate terminals:

```powershell
# Terminal 1
Set-Location Backend
npm run dev

# Terminal 2
Set-Location Frontend
npm run dev
```

Open the Vite URL shown in the frontend terminal, normally `http://localhost:5173`.

## Run with Docker

1. Create and configure `Backend/.env`. Docker Compose supplies the internal MongoDB and Redis connection values.
2. Run:

   ```powershell
   docker compose up --build
   ```

3. Open `http://localhost`.

The Docker stack starts MongoDB, Redis, the Express/Socket.IO API, and an Nginx-served frontend. Nginx proxies `/api` and `/socket.io` to the backend. MongoDB and Redis data are persisted in named Docker volumes.

Useful commands:

```powershell
docker compose logs -f
docker compose down
docker compose down -v # removes local Docker MongoDB and Redis data
```

## Available scripts

| Directory | Command | Description |
| --- | --- | --- |
| `Backend` | `npm run dev` | Start the API with Nodemon |
| `Backend` | `npm start` | Start the API with Node.js |
| `Frontend` | `npm run dev` | Start the Vite development server |
| `Frontend` | `npm run build` | Build the production frontend |
| `Frontend` | `npm run lint` | Run ESLint |
| `Frontend` | `npm run preview` | Preview the production build |

## API route groups

| Prefix | Responsibility |
| --- | --- |
| `/api/user` | Authentication and user account actions |
| `/api/products` | Public product catalogue |
| `/api/cart` | Cart management |
| `/api/order` | Customer orders and order status |
| `/api/address` | Delivery addresses |
| `/api/admin` | Administrative operations |
| `/api/delivery` | Delivery-agent workflow |

## Order lifecycle

```text
Pending → Accepted → Out for Delivery → Delivered
```

Cancellation may be available for eligible pending or accepted orders, depending on the applied business rules.

## Documentation

See [PRD.md](PRD.md) for the detailed product requirements, user journeys, scope, and acceptance criteria.
