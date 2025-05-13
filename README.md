# AceUp Tech Assessment

This repository contains two projects:
- **frontend/**: React 19 + Vite application
- **backend/**: Ruby on Rails 7.2 API-only application (Ruby 3.2)

## Tech Stack

### Backend
- Ruby on Rails 7.2
- PostgreSQL
- Redis
- Sidekiq for background jobs
- Mailgun for email delivery
- RSpec for testing

### Frontend
- React
- Material-UI
- Vite

## Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

- Docker and Docker Compose
- Ruby 3.2.2
- Node.js 18+
- Mailgun account

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd tech-assessment
```

2. **Access the apps:**
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend (Rails API): [http://localhost:3000](http://localhost:3000)

3. **Database**
- Postgres runs in the `db` service.
- Default credentials (see `docker-compose.yml`):
  - Host: `db`
  - Username: `postgres`
  - Password: `postgres`
  - Database: `aceup_db`

4. **First-time Rails setup** (run in another terminal):

3. Start the application:
```bash
make db.init
```

## Useful Commands

- **Rebuild images after dependency changes:**
  ```bash
  make build
  ```

- **Start the services:**
  ```bash
  make start
  ```

- **Stop all services:**
  ```bash
  make stop
  ```

- **Go into rails console:**
  ```bash
  make rails.c
  ```

- **Go into bash console:**
  ```bash
  make sh
  ```

### Mailgun Setup

1. Sign up for a Mailgun account at https://www.mailgun.com/
2. Verify your domain or use the sandbox domain
3. Get your API key from the Mailgun dashboard
4. Update the `.env` file with your Mailgun credentials

# Mailgun Configuration
```
MAILGUN_API_KEY=your-mailgun-api-key
MAILGUN_DOMAIN=your-mailgun-domain
MAILGUN_FROM_EMAIL=noreply@your-mailgun-domain
```

Note: If using the sandbox domain, you'll need to authorize recipient email addresses in the Mailgun dashboard.

## Features

- Create and manage orders
- Real-time order status updates
- Email notifications for order status changes
- Background job processing
- Responsive Material-UI interface

## Project Structure

```
.
├── backend/               # Rails API
│   ├── app/
│   │   ├── controllers/   # API controllers
│   │   ├── models/       # Database models
│   │   ├── mailers/      # Email templates
│   │   └── services/     # Business logic
│   └── spec/             # RSpec tests
│
└── frontend/             # React application
    ├── src/
    │   ├── components/   # React components
    │   └── services/     # API services
    └── public/           # Static assets
```

**Frontend**

- Create a Dashboard with at least 1 stat (# of orders created)
- Create an order table | New Order button | New Order dialog
- Refresh orders after new is created

**Backend**

- Orders crud
- Send an email after order is created
