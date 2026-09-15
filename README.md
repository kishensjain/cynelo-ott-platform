# Cynelo

Cynelo is a full-stack movie catalog and OTT-style web application built with React, Express, MongoDB, and Cloudinary. Users can discover movies, search and filter the catalog, view metadata, submit reviews, and manage a mock subscription.

> **Demo content notice:** Cynelo stores movie metadata, posters, cast information, ratings, and reviews for demonstration purposes. It does not host or distribute full-length copyrighted films.

## Features

- Browse movies by search term, genre, and release year
- Home page sections for top-rated, recently added, and random movies
- Movie metadata including posters, synopsis, cast, ratings, and reviews
- JWT authentication stored in an HTTP-only cookie
- User registration, login, logout, and profile editing
- Mock subscription checkout with loading and success states
- Subscriber-only movie details and review actions
- Subscription cancellation for testing
- Admin movie and genre management
- Poster uploads through Cloudinary
- Responsive dark UI built with Tailwind CSS v4 and shadcn-style components

## Tech Stack

### Frontend

- React 19 with TypeScript
- Vite
- React Router
- Zustand for authentication and subscription state
- Axios for API requests
- Tailwind CSS v4
- shadcn-style UI components with Base UI/Radix-compatible primitives
- Lucide icons

### Backend

- Node.js with Express 5 and TypeScript
- MongoDB with Mongoose
- JWT authentication with HTTP-only cookies
- Cloudinary for poster storage
- Multer for in-memory multipart uploads
- Helmet, CORS, and rate limiting

## Project Structure

```text
cynelo/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── api/            # API request modules
│   │   ├── components/     # Shared and UI components
│   │   ├── pages/          # Application pages and admin pages
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # Shared frontend types
│   │   └── lib/            # API client and utilities
│   └── package.json
├── server/                 # Express + TypeScript API
│   ├── src/
│   │   ├── config/         # Database and Cloudinary setup
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Auth, subscription, uploads, and errors
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/          # Express route modules
│   │   └── utils/          # Token helpers
│   └── package.json
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm
- MongoDB database, local or hosted
- Cloudinary account for poster uploads

## Environment Variables

Create `server/.env`:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/cynelo
JWT_SECRET=replace-with-a-long-random-secret
FRONTEND_URL=http://localhost:5173
PORT=5001

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

The frontend defaults to `http://localhost:5001/api/v1`. To use another API URL, create `client/.env`:

```env
VITE_API_URL=http://localhost:5001/api/v1
```

Do not commit either `.env` file or real credentials.

## Installation

Install dependencies in both packages:

```bash
cd client
npm install

cd ../server
npm install
```

## Running Locally

Start the API in one terminal:

```bash
cd server
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The server normally runs at `http://localhost:5001` and exposes a health response at `/`.

## Available Scripts

### Client

```bash
npm run dev       # Start Vite development server
npm run build     # Type-check and create a production build
npm run lint      # Run ESLint
npm run preview   # Preview the production build
```

### Server

```bash
npm run dev       # Start the API with tsx watch mode
npm run build     # Compile TypeScript to dist/
npm start         # Run the compiled server
```

## API Overview

The main versioned API prefix is `/api/v1`.

### Authentication and users

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/users` | Public | Register a user |
| `POST` | `/api/v1/users/auth` | Public | Log in and set the JWT cookie |
| `POST` | `/api/v1/users/logout` | Public | Clear the JWT cookie |
| `GET` | `/api/v1/users/profile` | Required | Get the current user |
| `PUT` | `/api/v1/users/profile` | Required | Update the current user |
| `GET` | `/api/v1/users` | Admin | List users |

### Movies and genres

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/api/v1/movies/search` | Public | Search and filter movies |
| `GET` | `/api/v1/movies/all-movies` | Public | Paginated movie list |
| `GET` | `/api/v1/movies/new-movies` | Public | Recently added movies |
| `GET` | `/api/v1/movies/top-movies` | Public | Top-rated movies |
| `GET` | `/api/v1/movies/random-movies` | Public | Random movie selection |
| `GET` | `/api/v1/movies/specific-movie/:id` | Subscriber | Movie details and reviews |
| `POST` | `/api/v1/movies/:id/reviews` | Subscriber | Add a review |
| `DELETE` | `/api/v1/movies/delete-review` | Subscriber | Delete an allowed review |
| `POST` | `/api/v1/movies` | Admin | Create a movie with poster upload |
| `PUT` | `/api/v1/movies/:id` | Admin | Update a movie |
| `DELETE` | `/api/v1/movies/:id` | Admin | Delete a movie |
| `GET` | `/api/v1/genre` | Public | List genres |

### Subscriptions

The payment flow is intentionally mocked. The subscribe endpoint waits briefly, then sets `isSubscribed` to `true`; no payment provider or charge is involved.

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `POST` | `/api/v1/subscribe` | Required | Simulate payment and activate subscription |
| `POST` | `/api/v1/unsubscribe` | Required | Cancel subscription for testing |
| `POST` | `/api/subscribe` | Required | Alias for the subscribe endpoint |
| `POST` | `/api/unsubscribe` | Required | Alias for the unsubscribe endpoint |

The `checkSubscription` middleware returns `403` when an authenticated user does not have an active subscription. The frontend displays a locked-content panel and opens the mock checkout dialog.

## Authentication Flow

1. A user registers or logs in.
2. The server signs a JWT containing the user ID.
3. The JWT is stored in an HTTP-only cookie named `jwt`.
4. Axios sends that cookie with API requests through `withCredentials: true`.
5. The server auth middleware verifies the cookie and attaches the user to `req.user`.
6. The frontend hydrates the user into the Zustand auth store on startup.

## Admin Access

Admin-only routes check the `isAdmin` field on the authenticated user. To create an admin for local testing, update a user document in MongoDB:

```js
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

## Uploads

Movie posters are sent as multipart form data. Multer keeps the upload in memory, then the server sends it to Cloudinary under the `movies` folder. The resulting secure URL and public ID are stored with the movie document.

## Notes

- Movie browsing remains public; movie detail and review content require an active subscription.
- The mock payment form accepts any demo values and must not be used with real card information.
- Existing user documents receive `isSubscribed: false` through the Mongoose schema default when the field is introduced.
