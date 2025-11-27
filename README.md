# Brev.ly - URL Shortener

A full-stack URL shortener application built with modern technologies.

## 🚀 Features

- [x] Create shortened links
  - [x] URL format validation
  - [x] Prevent duplicate short codes
- [x] Delete links
- [x] Redirect to original URL via short code
- [x] List all created links
- [x] Track link access count
- [x] Export links to CSV
  - [x] CDN access via Cloudflare R2
  - [x] Unique random filename generation
  - [x] Performant listing
  - [x] CSV includes: original URL, short code, access count, creation date

## 🛠 Technologies

- **Backend**: TypeScript, Fastify, Drizzle ORM
- **Database**: PostgreSQL
- **Storage**: Cloudflare R2
- **Testing**: Vitest
- **Code Quality**: Biome (linting & formatting)

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- Docker & Docker Compose

### Environment Setup

1. **Copy environment file:**
   ```bash
   cp server/.env.example server/.env
   ```

2. **Configure Cloudflare R2:**
   ```bash
   # Get from Cloudflare Dashboard
   CLOUDFLARE_ACCOUNT_ID="your-account-id"
   CLOUDFLARE_ACCESS_KEY_ID="your-r2-token"
   CLOUDFLARE_SECRET_ACCESS_KEY="your-r2-token"
   CLOUDFLARE_BUCKET="your-bucket-name"
   CLOUDFLARE_PUBLIC_URL="https://pub-xxx.r2.dev"
   ```

### Installation & Development

1. **Start database:**
   ```bash
   cd server
   docker-compose up -d
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Run migrations:**
   ```bash
   pnpm run db:migrate
   ```

4. **Start development server:**
   ```bash
   pnpm run dev
   ```

5. **Access API documentation:**
   - Swagger UI: http://localhost:3333/docs

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/links` | Create shortened link |
| `GET` | `/links` | List all links |
| `DELETE` | `/links/:id` | Delete link |
| `GET` | `/:shortCode` | Redirect to original URL |
| `POST` | `/links/export` | Export links to CSV |

### Example Usage

**Create Link:**
```bash
curl -X POST http://localhost:3333/links \
  -H "Content-Type: application/json" \
  -d '{"originalUrl": "https://example.com", "shortCode": "abc123"}'
```

**Access Link:**
```bash
curl http://localhost:3333/abc123
# Redirects to https://example.com
```

## 🧪 Testing

```bash
# Run all tests
pnpm run test

# Watch mode
pnpm run test:watch

# Database operations for tests
pnpm run db:migrate:test
```

## 🏗 Building

```bash
# Build for production
pnpm run build

# Build Docker image
docker build -t brev-server .
```

## 📊 Database Schema

**Links Table:**
- `id` - Unique identifier (UUID v7)
- `originalUrl` - Original URL to redirect to
- `shortCode` - Short code for the URL
- `accessCount` - Number of times accessed
- `createdAt` - Creation timestamp