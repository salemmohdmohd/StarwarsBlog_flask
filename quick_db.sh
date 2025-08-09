#!/bin/bash

# Quick Database Operations Script
# Simple shortcuts for common database tasks

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
DB_MANAGER="$SCRIPT_DIR/db_manager.sh"

echo "🌟 Star Wars Database Quick Actions"
echo "=================================="

case "${1:-menu}" in
    "1"|"add-data")
        echo "Adding sample Star Wars data..."
        $DB_MANAGER add-data
        ;;
    "2"|"add-users")
        echo "Creating sample users..."
        $DB_MANAGER create-users
        ;;
    "3"|"list-users")
        echo "Listing all users..."
        $DB_MANAGER list-users
        ;;
    "4"|"backup")
        echo "Creating database backup..."
        $DB_MANAGER backup
        ;;
    "5"|"reset")
        echo "Resetting database..."
        $DB_MANAGER reset
        ;;
    "menu"|*)
        echo ""
        echo "Quick Actions:"
        echo "1. Add Star Wars data     - $0 1"
        echo "2. Create sample users    - $0 2"
        echo "3. List users            - $0 3"
        echo "4. Backup database       - $0 4"
        echo "5. Reset database        - $0 5"
        echo ""
        echo "Or use the full manager: ./db_manager.sh help"
        ;;
esac
