# 🔐 GadgetPeeks Authentication & Security Microservice

A production-ready authentication service built with **NestJS**, **Prisma**, **MySQL**, and **Redis**. This service handles secure registration, login, token management, email verification, Google OAuth login, and account deactivation with robust validation, error handling, and request throttling.

---

## 🧩 Core Features

### ✅ User Registration
- Email and password validation using `class-validator`
- Global `TrimPipe` to sanitize all inputs
- Prisma error filtering for field violations and duplicates
- Rate-limited by IP using Redis

### ✅ Email Verification
- Secure one-time token emailed to the user
- HTML email templates using Nodemailer
- Verified email required before activating account
- Prisma exception filters for token/record issues

### ✅ Sign-In
- Password verification via `bcrypt`
- JWT access + refresh token issuance
- Logs device info using `ua-parser-js`
- Guards against brute-force using Redis-based request limiting

### ✅ Token Refresh
- Rotating refresh token system
- HttpOnly cookies for token security
- Validates user agent before issuing new tokens
- Invalidates old tokens on refresh

### ✅ Google OAuth Login
- OAuth2 integration via `google-auth-library`
- Handles user creation or login based on email match
- Validates Google access tokens securely
- Prisma + HTTP exception filtering for error tracing

### ✅ Account Deactivation
- Requires re-authentication (email + password)
- Uses Prisma `$transaction()` for atomic operations
- Deletes all refresh tokens
- Logs action and rate limits attempts

### ✅ Admin Features
- Upgrade user role from buyer to seller
- Deactivate user accounts securely
- Permanently delete user records from the system
- Cleans up all associated refresh tokens on deactivation or deletion
- Routes protected by a custom @Admin() decorator
- Validates access_token from cookies and an ADMIN_SECRET in headers
- Uses a custom guard and Reflector to verify admin-only access

---

## 🧰 GadgetPeeks Features Used

### 🛡️ Guards

### 🚿 Pipes

### ❗ Exception Filters
- Explicit try/catch blocks are intentionally minimized in the codebase because NestJS exception filters are used to handle and transform thrown errors globally or at the route level. 
- This approach promotes cleaner, more readable code while ensuring consistent error responses. Domain-specific errors (e.g., from Prisma or validation) are caught and formatted by custom filters without cluttering controller or service logic with repetitive try/catch blocks.

### 🚦 Rate Limiting
- Redis-powered rate limiter
- Per-IP attempt tracking for high-risk routes (register, login, verify)
- Expiry-based logic for locking out abusive users
- Implemented using custom guards

---

## 📦 Tech Stack

- **Framework**: NestJS (TypeScript)
- **ORM**: Prisma
- **Database**: MySQL (also works with PostgreSQL)
- **Auth**: JWT (access + refresh), OAuth2 (Google)
- **Mail**: Nodemailer
- **Rate Limiting**: Redis + ioredis
- **Validation**: class-validator, DTOs
- **Logging**: Custom logger (optional integration: Winston or Sentry)

---

## 📈 Future Enhancements
- Facebook / GitHub OAuth login

- Admin roles and permissions

- Audit trail with activity logs

- Mobile push notification integration

- End-to-end testing suite with Supertest & Jest

---

## 🧠 Developer Notes
- Built for scalability and security-first APIs

- Clean architecture and dependency injection pattern

- Designed for integration into monorepos or microservice ecosystems

- Suitable for SaaS, e-commerce, or user-account platforms

--- 

## Maintained by Kenneth Manalad.


---

## 🚀 Getting Started

```bash
# Install dependencies
pnpm install

# Start Redis
docker run -p 6379:6379 redis

# Run the app in dev mode
pnpm run start:dev

