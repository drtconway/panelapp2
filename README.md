# panelapp2

A full-stack application scaffold with Vue 3 frontend, Django REST backend, PostgreSQL database, and nginx reverse proxy.

## Architecture

- **Frontend**: Vue 3 + Vite
- **Backend**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL 15
- **Reverse Proxy**: nginx
- **Containerization**: Docker + Docker Compose
- **Development**: VS Code devcontainer support

## Project Structure

```
panelapp2/
├── backend/              # Django backend
│   ├── panelapp2/        # Django project settings
│   ├── api/              # REST API app
│   ├── manage.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/             # Vue 3 frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── nginx/                # nginx configuration
│   └── nginx.conf
├── .devcontainer/        # VS Code devcontainer config
│   └── devcontainer.json
└── docker-compose.yml    # Docker Compose orchestration
```

## Quick Start

### Using Docker Compose (Recommended)

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Ports 80, 5173, 8000, and 5432 available

2. **Start all services**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost/api/
   - Django Admin: http://localhost/admin/
   - API Health Check: http://localhost/api/health/

4. **Create a Django superuser** (in a new terminal)
   ```bash
   docker-compose exec backend python manage.py createsuperuser
   ```

### Using VS Code Devcontainer

1. **Prerequisites**
   - VS Code with Remote - Containers extension
   - Docker and Docker Compose installed

2. **Open in devcontainer**
   - Open the project in VS Code
   - Press F1 and select "Remote-Containers: Reopen in Container"
   - Wait for the container to build and start

3. **The devcontainer will automatically**
   - Install Python dependencies
   - Run database migrations
   - Forward necessary ports

## Development

### Backend Development

The backend is a Django application with Django REST Framework.

**Local development** (without Docker):
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
export DATABASE_URL=postgresql://panelapp2:panelapp2@localhost:5432/panelapp2
python manage.py migrate
python manage.py runserver
```

**Run migrations**:
```bash
docker-compose exec backend python manage.py migrate
```

**Create superuser**:
```bash
docker-compose exec backend python manage.py createsuperuser
```

**Django shell**:
```bash
docker-compose exec backend python manage.py shell
```

### Frontend Development

The frontend is a Vue 3 application built with Vite.

**Local development** (without Docker):
```bash
cd frontend
npm install
npm run dev
```

**Build for production**:
```bash
npm run build
```

### Database

PostgreSQL database with the following default credentials (change for production):
- Database: `panelapp2`
- User: `panelapp2`
- Password: `panelapp2`
- Port: `5432`

**Access PostgreSQL directly**:
```bash
docker-compose exec db psql -U panelapp2
```

### nginx

nginx acts as a reverse proxy routing:
- `/` → Frontend (Vue app on port 5173)
- `/api/` → Backend (Django on port 8000)
- `/admin/` → Django admin
- `/static/` → Django static files

## API Endpoints

- `GET /api/health/` - Health check
- `GET /api/items/` - List all items
- `POST /api/items/` - Create a new item
- `GET /api/items/{id}/` - Get item details
- `PUT /api/items/{id}/` - Update an item
- `DELETE /api/items/{id}/` - Delete an item

## Environment Variables

### Backend
- `DEBUG` - Django debug mode (default: True)
- `SECRET_KEY` - Django secret key
- `DATABASE_URL` - PostgreSQL connection string
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts

### Frontend
- `VITE_API_URL` - API base URL (default: http://localhost/api)

## Production Deployment

For production deployment:

1. **Update environment variables**:
   - Set `DEBUG=False`
   - Set a secure `SECRET_KEY`
   - Update `ALLOWED_HOSTS`
   - Use a secure database password

2. **Update Docker Compose**:
   - Use production-ready images
   - Add volume mounts for static/media files
   - Configure proper logging
   - Set up SSL/TLS with nginx

3. **Security checklist**:
   - Change all default passwords
   - Enable HTTPS
   - Configure CORS properly
   - Set up proper firewall rules
   - Enable database backups

## Troubleshooting

**Port already in use**:
```bash
# Stop all containers
docker-compose down

# Check what's using the port
lsof -i :80  # or :5173, :8000, :5432
```

**Database connection issues**:
```bash
# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

**Frontend not updating**:
```bash
# Rebuild frontend container
docker-compose up --build frontend
```

## License

MIT
