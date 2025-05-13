# AceUp Tech Assessment

This repository contains two projects:
- **frontend/**: React 19 + Vite application
- **backend/**: Ruby on Rails 7.2 API-only application (Ruby 3.2)

## Tech Stack

### Backend
- Ruby on Rails 7.2
- PostgreSQL
- Redis
- ActiveJob for background jobs
- Mailgun for email delivery
- RSpec for testing

### Frontend
- React
- Material-UI
- Vite

## Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)
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

- Create and manage orders using react states
- Real-time order status updates using action cable
- Email notifications for order status changes using mailgun
- Background job processing using sidekiq
- Responsive Material-UI interface

## Project Structure

```
.
├── backend/               # Rails API
│   ├── app/
│   │   ├── controllers/   
│   │   │   └── api/
│   │   │       └── v1/    # Versioned API controllers
│   │   ├── models/       # Database models
│   │   ├── mailers/      # Email templates
│   │   ├── services/     # Business logic
│   │   ├── serializers/  # JSON serializers
│   │   └── channels/     # ActionCable channels
│   └── spec/             # RSpec tests
│
└── frontend/             # React application
    ├── src/
    │   ├── components/   # React components
    │   ├── services/     # API services
    │   │   ├── api.js    # REST API client
    │   │   └── actionCable.js  # WebSocket client
    │   └── controllers/  # Business logic controllers
    └── public/           # Static assets
```

**Frontend**

- Create a Dashboard with at least 1 stat (# of orders created)

![image](https://github.com/user-attachments/assets/8120cbc2-8f1a-403b-8a8d-e582a60064b2)

- Create an order table | New Order button | New Order dialog

![image](https://github.com/user-attachments/assets/2f9354c3-2748-4b05-b885-b43757e09f9b)

- Refresh orders after new is created

![image](https://github.com/user-attachments/assets/c901ec11-f485-4e77-98c6-ed375cab8657)

**Backend**

- Orders crud
- Send an email after order is created
