# Quick Docker Reference

## 🚀 Quick Start

```bash
# Using the helper script (recommended)
./docker.sh up

# Or using docker compose directly
docker compose up -d
```

Access the app at: http://localhost:3000

## 📋 Common Commands

### Using Helper Script
```bash
./docker.sh up           # Start services
./docker.sh down         # Stop services
./docker.sh logs-web     # View web logs
./docker.sh rebuild      # Rebuild & restart
./docker.sh status       # Check status
./docker.sh help         # Show all commands
```

### Using Docker Compose Directly
```bash
docker compose up -d              # Start in background
docker compose down               # Stop services
docker compose logs -f web        # View logs
docker compose up -d --build      # Rebuild
docker compose ps                 # Check status
```

## 🗄️ Database Access

```bash
# Using helper script
./docker.sh db

# Using docker compose
docker compose exec postgres psql -U postgres -d nuxtstarterkit
```

## 📚 Full Documentation

See [DOCKER.md](./DOCKER.md) for complete documentation.

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and update:
- `BETTER_AUTH_SECRET` - Generate a secure random string
- `BETTER_AUTH_URL` - Your app URL (default: http://localhost:3000)
- `NUXT_PRIVATE_DATABASE_URL` - Auto-configured for Docker (postgresql://postgres:postgres@postgres:5432/nuxtstarterkit)

