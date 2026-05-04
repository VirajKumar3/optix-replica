# Optix - Premium Eyewear E-commerce Platform

Optix is a high-performance e-commerce template for eyewear brands. It features a modern, sharp-edged aesthetic with a robust backend for inventory management.

## Features
- **Admin Dashboard**: Full CRUD for product management.
- **Frontend**: Responsive landing pages, category grids (Men, Women, Kids), and product details.
- **Tech Stack**:
  - **Backend**: Node.js, Express, MongoDB (Atlas), Mongoose, Multer.
  - **Frontend**: Gulp, Pug, Webpack, BrowserSync.

## Development Setup

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB account (Atlas or local)

### Installation
1. Clone the repository.
2. Install dependencies for both root and backend:
   ```bash
   npm install
   cd backend && npm install
   ```
3. Set up your `.env` file in the `backend` directory.

### Running the App
- **Backend**: `npm run dev` in the `backend` directory.
- **Frontend**: `npm start` in the root directory (uses `NODE_OPTIONS=--openssl-legacy-provider` for Node 17+).

## Credits
Based on the Majestic theme by ThemeWagon.
