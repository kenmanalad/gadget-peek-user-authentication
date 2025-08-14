# 🔐 GadgetPeeks Authentication & Security Microservice

A **production-ready authentication service** built with **NestJS, Prisma, MySQL, and Redis**.  
It offers **secure registration, login, token management, email verification, Google OAuth login, password reset, account deactivation, and admin role management** with robust validation, error handling, and rate limiting.

---

## 🧩 Core Features

### **1. User Registration (Manual)**
- **Input handling**: DTOs with `class-validator` for validation, trimming, and transformation.
- **Security**:
  - Password hashing with `bcrypt`.
  - Rate limiting via Redis to prevent spam and brute-force attacks.
  - Prisma error filtering for:
    - Unique constraint violations (duplicate email).
    - Field-level validation errors.
  - HTTP exception filtering for invalid requests.
- **Flow**:
  1. Accepts email + password.
  2. Validates and sanitizes data.
  3. Stores user record with hashed password.
  4. Triggers **email verification process**.

---

### **2. Email Verification**
- **Post-registration**:
  - Sends a secure verification code to the registered email (via `nodemailer`).
  - Will use a dedicated messaging service (**BullMQ + AWS SNS/SQS**) in the future.
- **Validation**:
  - Rate limited via Redis.
  - DTO validation & sanitization.
  - Exception filters for Prisma & HTTP errors.
- **Flow**:
  1. User receives verification code.
  2. Code is validated.
  3. Account is marked as verified.

---

### **3. Authentication**
- **Manual login**:
  - Email + password authentication.
  - Password verification via `bcrypt`.
- **OAuth login**:
  - Google OAuth2 via `google-auth-library`.
  - Matches existing account by email or creates a new one.
- **Security**:
  - Rate limiting via Redis.
  - JWT access + refresh token system.
  - Guards against brute-force attempts.
  - Exception filters for Prisma, JWT, and HTTP errors.
  - DTO validation & sanitization.

---

### **4. Forgot Password**
- **3-Step Process**:
  1. **Request**: User submits email → Service sends secure, expiring code to email.
  2. **Verify Code**: User submits code → Service validates and issues short-lived JWT.
  3. **Reset Password**: User submits new password + token → Password updated after token validation.
- **Security**:
  - Rate limiting via Redis.
  - Exception filters for Prisma, JWT, and HTTP errors.
  - DTO validation & sanitization.
  - Code expiration and multiple-request limits.

---

### **5. Refresh Token**
- **Rotating refresh token** strategy:
  - Validates refresh token.
  - Deletes **all** existing refresh tokens for higher security.
  - Issues new access + refresh tokens.
  - Saves new refresh token in database.
- **Security**:
  - Rate limiting via Redis.
  - Exception filters for Prisma, JWT, and HTTP errors.
  - DTO validation & sanitization.

---

### **6. Account Deactivation**
- **Auth**: Requires `JwtAuthGuard` via Passport JWT.
- **Soft delete**: Marks account as inactive (`isActive: false`) instead of full deletion.
- **Security**:
  - Rate limiting via Redis.
  - Exception filters for Prisma, JWT, and HTTP errors.
  - DTO validation & sanitization.

---

### **7. Admin Features**
- **Role management**:
  - Upgrade user role from buyer → seller.
  - Deactivate user accounts (soft delete).
- **Access control**:
  - Protected by custom `@Admin()` decorator + guard.
  - Validates `access_token` from cookies and `ADMIN_SECRET` from headers.
- **Security**:
  - Rate limiting via Redis.
  - Exception filters for Prisma, JWT, and HTTP errors.
  - DTO validation & sanitization.

---

## 🛡️ Security & Reliability Components

- **Guards**:
  - Rate Limiter Guard (Redis-powered).
  - `JwtAuthGuard` (Passport JWT).
  - Admin-only guard with custom decorator.
- **Pipes**:
  - Global TrimPipe.
  - DTO validation & transformation.
- **Exception Filters**:
  - Prisma-specific error filter.
  - JWT error filter.
  - HTTP exception filter.

---

## 📦 Tech Stack

| Category         | Technology |
|------------------|------------|
| **Framework**    | NestJS (TypeScript) |
| **ORM**          | Prisma |
| **Database**     | MySQL / PostgreSQL (AWS RDS compatible) |
| **Auth**         | JWT (access + refresh), Passport, OAuth2 (Google) |
| **Mail**         | Nodemailer → Future: BullMQ + AWS SNS/SQS |
| **Rate Limiting**| Redis + ioredis |
| **Validation**   | class-validator, DTOs |
| **Logging**      | Winston (custom logger) |
| **Containerization** | Docker + Docker Compose |

---




📈 Future Enhancements

Facebook / GitHub OAuth login.

Messaging queue for all email flows.

Audit trail with activity logs.

Mobile push notifications.

End-to-end test suite with Supertest + Jest.

👨‍💻 Maintained by: Kenneth Manalad


## 🐳 Dockerized Setup

```bash
# Build containers
docker-compose build

# Start MySQL
docker-compose up -d mysql

# Deploy DB migrations
docker-compose run --rm app npx prisma migrate deploy

# Generate Prisma client
docker-compose run --rm app npx prisma generate

# Start the app + Redis
docker-compose up
