
# workbridge
=======
# WorkBridge — Full-Stack Service Marketplace

## Project Structure

```
workbridge/
├── server/          # Express + MongoDB API
│   ├── config/      # Database connection
│   ├── controllers/ # Route handlers
│   ├── middleware/   # JWT auth middleware
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   └── server.js    # Entry point
└── client/          # React frontend
    └── src/
        ├── components/  # Navbar etc.
        ├── context/     # Auth context
        ├── pages/       # All pages
        └── services/    # API calls (axios)
```

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)

### 1. Backend Setup

```bash
cd server
cp .env.example .env        # Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev                  # Starts on http://localhost:5000
```

### 2. Frontend Setup

```bash
cd client
npm install
npm start                    # Starts on http://localhost:3000
```

The React dev server proxies API calls to `http://localhost:5000` (configured in `client/package.json`).

### 3. MongoDB

- **Local**: Install MongoDB and ensure `mongod` is running. Default URI: `mongodb://localhost:27017/workbridge`
- **Atlas**: Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas), get your connection string, and paste it into `server/.env`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | ✅ | Current user |
| GET | /api/workers | — | List/search workers |
| GET | /api/workers/:id | — | Worker profile |
| POST | /api/workers | ✅ Worker | Create profile |
| PUT | /api/workers/:id | ✅ Worker | Update profile |
| GET | /api/services | — | List/search services |
| POST | /api/services | ✅ Worker | Create service |
| PUT | /api/services/:id | ✅ Worker | Update service |
| DELETE | /api/services/:id | ✅ Worker | Delete service |
| POST | /api/requests | ✅ Employer | Send job request |
| GET | /api/requests/my | ✅ | My requests |
| PUT | /api/requests/:id | ✅ Worker | Accept/reject |
| POST | /api/reviews | ✅ Employer | Leave review |
| GET | /api/reviews/:workerId | — | Worker reviews |

## Features

- JWT authentication with bcrypt password hashing
- Role-based access (worker/employer)
- Full CRUD for services
- Worker search with filters (skill, location, rating)
- Job request system (send/accept/reject)
- Review & rating system (auto-updates worker average)
- Pagination on search results
- Clean, minimal CSS (no heavy libraries)

