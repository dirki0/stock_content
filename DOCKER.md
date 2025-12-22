# Docker Setup Guide

This guide will help you set up and run the application using Docker and Docker Compose.

## Prerequisites

- Docker (20.10 or later)
- Docker Compose (2.0 or later)

## Quick Start

1. **Set up environment variables:**

   Create a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   BETTER_AUTH_SECRET=your-secret-key-here
   BETTER_AUTH_URL=http://localhost:3000
   DATABASE_URL=postgresql://postgres:postgres@postgres:5432/nuxtstarterkit
   ```

   > **Important:** Generate a secure random string for `BETTER_AUTH_SECRET` in production.

2. **Build and start the services:**

   ```bash
   docker-compose up -d
   ```

   This will:
   - Start a PostgreSQL database container
   - Build and start the Nuxt web application
   - Set up networking between containers

3. **Access the application:**

   Open your browser and navigate to: http://localhost:3000

## Docker Compose Services

### PostgreSQL Database
- **Container Name:** `nuxt-starter-postgres`
- **Port:** 5432 (mapped to host)
- **Credentials:**
  - User: `postgres`
  - Password: `postgres`
  - Database: `nuxtstarterkit`

### Web Application
- **Container Name:** `nuxt-starter-web`
- **Port:** 3000 (mapped to host)
- **Dependencies:** PostgreSQL (waits for health check)

## Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop services and remove volumes (database data will be lost)
```bash
docker-compose down -v
```

### View logs
```bash
# All services
docker-compose logs -f

# Web application only
docker-compose logs -f web

# PostgreSQL only
docker-compose logs -f postgres
```

### Rebuild the application
```bash
# Rebuild and restart
docker-compose up -d --build

# Force rebuild without cache
docker-compose build --no-cache web
docker-compose up -d
```

### Run database migrations
```bash
docker-compose exec web node /app/server/index.mjs migrate
```

### Access the PostgreSQL database
```bash
# Using docker exec
docker-compose exec postgres psql -U postgres -d nuxtstarterkit

# Using psql from host (if installed)
psql -h localhost -U postgres -d nuxtstarterkit
```

### Access the container shell
```bash
# Web container
docker-compose exec web sh

# PostgreSQL container
docker-compose exec postgres sh
```

## Development vs Production

### Development (Local)
For local development, it's recommended to run the application without Docker:

```bash
pnpm install
pnpm dev:web
```

This provides:
- Hot module replacement
- Faster rebuild times
- Better debugging experience

### Production (Docker)
Docker is ideal for production deployments:

1. **Update environment variables** in `.env` or docker-compose.yml
2. **Set a strong BETTER_AUTH_SECRET**
3. **Configure proper database credentials**
4. **Use environment-specific configuration**

## Troubleshooting

### Port already in use
If port 3000 or 5432 is already in use, modify the port mappings in `docker-compose.yml`:

```yaml
services:
  web:
    ports:
      - "3001:3000"  # Change host port to 3001
  
  postgres:
    ports:
      - "5433:5432"  # Change host port to 5433
```

### Database connection issues
Ensure the DATABASE_URL matches the PostgreSQL service configuration:
```
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/nuxtstarterkit
```

### Build failures
1. Clear Docker cache and rebuild:
   ```bash
   docker-compose down
   docker system prune -a
   docker-compose up --build
   ```

2. Check Docker logs for specific errors:
   ```bash
   docker-compose logs web
   ```

### Out of memory during build
Increase Docker memory limits in Docker Desktop settings or use a different build strategy.

## Dockerfile Architecture

The Dockerfile is located at the root of the project and uses a multi-stage build:

1. **Build Stage:**
   - Based on Node.js 24.12.0 slim image
   - Installs pnpm via corepack
   - Copies workspace files and installs dependencies
   - Builds the application using Turbo

2. **Production Stage:**
   - Fresh Node.js 24.12.0 slim image
   - Copies only the built output
   - Runs the application with minimal footprint

The Dockerfile is designed to work with the pnpm monorepo structure, building from the project root.

## Performance Optimization

- **Layer caching:** Package.json files are copied before source code to leverage Docker cache
- **pnpm cache:** Build cache is mounted for faster dependency installation
- **Multi-stage build:** Final image only contains production artifacts
- **Frozen lockfile:** Ensures reproducible builds

## Security Notes

- Change default PostgreSQL credentials in production
- Use secrets management for sensitive environment variables
- Keep Node.js and base images updated
- Don't commit `.env` files to version control
- Use non-root user in production containers (consider adding to Dockerfile)

## Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Nuxt.js Deployment](https://nuxt.com/docs/getting-started/deployment)
- [pnpm Workspaces](https://pnpm.io/workspaces)

