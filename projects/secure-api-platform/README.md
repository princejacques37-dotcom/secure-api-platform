# Secure API Platform

A portfolio-grade backend built to demonstrate secure application engineering, systems thinking, and DevSecOps practices.

## Architecture

- FastAPI application
- PostgreSQL persistence
- JWT access tokens
- Argon2 password hashing
- Role-aware authorization
- Input validation with Pydantic
- Security headers and request IDs
- Structured JSON logging
- Docker Compose for local development
- GitHub Actions for tests, dependency audit, and static checks

## Local setup

1. Copy `.env.example` to `.env` and set a strong `JWT_SECRET`.
2. Start PostgreSQL and the API with `docker compose up --build`.
3. Open `http://localhost:8000/docs` for the API documentation.
4. Run tests with `pytest`.

This is an engineering project in active development. Secrets, credentials, production infrastructure, and cloud deployment are intentionally not committed.

## Frontend demo

A separate Next.js frontend lives in `frontend/` and connects to the FastAPI service.

Run the full stack:

```bash
cp .env.example .env
# set a strong JWT_SECRET in .env
docker compose up --build
```

Then open `http://localhost:3001`.

The frontend currently supports the API's implemented contract: registration, login, current-user lookup, protected task creation, protected task listing, refresh, and sign-out. JWT storage is intentionally simple for this portfolio demo; a production deployment should move session handling to secure, HttpOnly cookies with CSRF protection.

## Cloud deployment

AWS deployment automation lives in `infra/aws/`. It provisions a public Application Load Balancer, private ECS Fargate task, private encrypted RDS PostgreSQL, ECR repositories, CloudWatch logs, optional WAF, Secrets Manager integration, and a GitHub Actions OIDC deployment role.

## DevSecOps controls

The repository includes automated checks intended to fail the CI pipeline on serious findings:

- `pytest` API and authorization tests
- Bandit Python SAST
- `pip-audit` dependency vulnerability checks
- TypeScript checking and a production Next.js build
- Trivy filesystem secret/misconfiguration/vulnerability scanning
- Trivy HIGH/CRITICAL container scanning
- GitHub CodeQL with `security-extended` queries for Python and TypeScript/JavaScript

The deployment workflow is gated on the security CI workflow so an AWS deployment cannot proceed when these required checks fail.

### Dependency note

`email-validator` is included because Pydantic `EmailStr` performs runtime email validation.

## Dependency security baseline

The frontend pins Next.js 16.3.5. Current PostCSS advisories affect older dependency ranges, and Next.js 16.3.5 resolves PostCSS 8.5.23. The CI pipeline keeps `npm audit --audit-level=high` as a security gate.
### CI dependency notes

The backend declares `email-validator` explicitly because Pydantic email fields require it at runtime. The frontend pins Next.js 16.3.5 and overrides PostCSS to 8.5.23 so CI resolves the patched PostCSS release.
