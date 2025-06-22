# Artist Business Web Application

A modern, responsive web application for artists to showcase and sell their work online. Features a dynamic admin panel for managing paintings, pricing, and availability.

## Features

- **Public Website**: Beautiful portfolio showcase with filtering
- **Admin Panel**: Easy-to-use interface for managing artwork
- **Image Upload**: Direct upload of painting photos
- **Dynamic Pricing**: Set and update prices for each piece
- **Availability Tracking**: Mark pieces as available, sold, or commission-only
- **Featured Artwork**: Highlight special pieces on homepage
- **Responsive Design**: Works perfectly on all devices

## Quick Start

### Option 1: Docker (Recommended for deployment)

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```

2. **Access the application:**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin/login

### Option 2: Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the application:**
   ```bash
   npm start
   ```

## Admin Access

- **URL**: http://localhost:3000/admin/login
- **Username**: admin
- **Password**: admin123

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment mode (development/production)

### Data Persistence

- **Database**: `./data/artist.db` (SQLite)
- **Images**: `./public/uploads/` (uploaded artwork photos)

## Docker Deployment

### Option 1: Using Pre-built Image (Recommended for Production)

```bash
# Using the pre-built image from GitHub Container Registry
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop the application
docker-compose -f docker-compose.prod.yml down
```

### Option 2: Build Locally

```bash
# Build and start the application locally
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the application
docker-compose down
```

### Option 3: Manual Docker Commands

```bash
# Pull the pre-built image
docker pull ghcr.io/longseenotime/artist-webapp:latest

# Run the container
docker run -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -v $(pwd)/public/uploads:/app/public/uploads \
  ghcr.io/longseenotime/artist-webapp:latest
```

## GitHub Container Registry

The application is automatically built and published to GitHub Container Registry:
- **Image URL**: `ghcr.io/longseenotime/artist-webapp:latest`
- **Automatic builds**: Every push to main branch triggers a new build
- **Multi-platform**: Supports both AMD64 and ARM64 architectures

## Admin Panel Features

1. **Dashboard**: View all paintings with thumbnails and details
2. **Add Paintings**: Upload new artwork with full details
3. **Edit Paintings**: Update existing artwork information
4. **Image Management**: Upload and replace artwork photos
5. **Pricing Control**: Set and update prices
6. **Availability Management**: Track sold/available status
7. **Featured Control**: Choose which pieces appear on homepage

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: SQLite
- **Frontend**: EJS templates, Tailwind CSS
- **File Upload**: Multer
- **Authentication**: bcrypt sessions
- **Deployment**: Docker, Docker Compose

## Security Features

- Password hashing with bcrypt
- Session-based authentication
- File upload validation
- Non-root Docker user
- Health checks

## License

MIT License - feel free to use for your artistic business!

---

🎨 **Happy creating and selling your beautiful artwork!**