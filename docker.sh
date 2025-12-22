#!/bin/bash

# Docker Helper Script for Nuxt Starter Kit
# This script provides convenient commands for managing the Docker environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Function to check if .env exists
check_env() {
    if [ ! -f .env ]; then
        print_message "$YELLOW" "⚠️  .env file not found!"
        print_message "$YELLOW" "Creating .env from .env.example..."
        cp .env.example .env
        print_message "$GREEN" "✓ Created .env file. Please update it with your configuration."
        exit 1
    fi
}

# Function to display help
show_help() {
    cat << EOF
Docker Helper Script for Nuxt Starter Kit

Usage: ./docker.sh [command]

Commands:
    up              Start all services
    down            Stop all services
    restart         Restart all services
    rebuild         Rebuild and restart all services
    logs            Show logs for all services
    logs-web        Show logs for web service only
    logs-db         Show logs for database service only
    shell-web       Open shell in web container
    shell-db        Open shell in database container
    db              Connect to PostgreSQL database
    migrate         Run database migrations
    clean           Stop services and remove volumes (WARNING: deletes data)
    status          Show status of all services
    help            Show this help message

Examples:
    ./docker.sh up              # Start all services
    ./docker.sh logs-web        # View web application logs
    ./docker.sh db              # Connect to PostgreSQL
    ./docker.sh migrate         # Run migrations

EOF
}

# Main command handler
case "$1" in
    up)
        check_env
        print_message "$GREEN" "🚀 Starting services..."
        docker compose up -d
        print_message "$GREEN" "✓ Services started!"
        print_message "$GREEN" "🌐 Web app: http://localhost:9009"
        print_message "$GREEN" "🗄️  Database: localhost:5432"
        ;;

    down)
        print_message "$YELLOW" "🛑 Stopping services..."
        docker compose down
        print_message "$GREEN" "✓ Services stopped!"
        ;;

    restart)
        print_message "$YELLOW" "🔄 Restarting services..."
        docker compose restart
        print_message "$GREEN" "✓ Services restarted!"
        ;;

    rebuild)
        print_message "$YELLOW" "🔨 Rebuilding and restarting services..."
        docker compose up -d --build
        print_message "$GREEN" "✓ Services rebuilt and restarted!"
        ;;

    logs)
        docker compose logs -f
        ;;

    logs-web)
        docker compose logs -f web
        ;;

    logs-db)
        docker compose logs -f postgres
        ;;

    shell-web)
        print_message "$GREEN" "🐚 Opening shell in web container..."
        docker compose exec web sh
        ;;

    shell-db)
        print_message "$GREEN" "🐚 Opening shell in database container..."
        docker compose exec postgres sh
        ;;

    db)
        print_message "$GREEN" "🗄️  Connecting to PostgreSQL..."
        docker compose exec postgres psql -U postgres -d nuxtstarterkit
        ;;

    migrate)
        print_message "$GREEN" "🔄 Running database migrations..."
        docker compose exec web node /app/server/index.mjs migrate
        print_message "$GREEN" "✓ Migrations completed!"
        ;;

    clean)
        print_message "$RED" "⚠️  WARNING: This will delete all data!"
        read -p "Are you sure? (yes/no): " confirm
        if [ "$confirm" = "yes" ]; then
            print_message "$YELLOW" "🧹 Cleaning up..."
            docker compose down -v
            print_message "$GREEN" "✓ Cleanup completed!"
        else
            print_message "$YELLOW" "Cancelled."
        fi
        ;;

    status)
        print_message "$GREEN" "📊 Service Status:"
        docker compose ps
        ;;

    help|--help|-h|"")
        show_help
        ;;

    *)
        print_message "$RED" "❌ Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac

