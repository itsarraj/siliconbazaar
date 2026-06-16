# SiliconBazaar

SiliconBazaar is a full-stack ecommerce platform for electronic components — motherboards, microcontrollers, sensors, and maker essentials — built for hobbyists, students, and engineers in India.

## Stack

- Frontend: React 18, TypeScript, Vite, Redux Toolkit, TanStack Query, Tailwind CSS
- Backend: Express 4, TypeScript, Prisma 6, Neon PostgreSQL
- Auth: JWT, bcrypt, Google OAuth
- Payments: Razorpay (INR checkout with signature verification)
- Images: ImageKit (production) with local upload fallback (development)
- Deploy: Netlify Functions (API), Vercel (frontend)

## Features

- Paginated product catalog and product detail pages
- Redux cart with localStorage persistence
- User registration, login, Google sign-in, profile management
- Checkout, order history, Razorpay payment flow
- Admin inventory management and product creation

## Local setup

### Backend

```bash
cd backend
cp .env.example .env
npm install
npm run setup   # prisma generate + db push + seed
npm run dev     # http://localhost:9002
```

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev     # http://localhost:3000
```

### Seed logins

- admin@example.com / password123 (admin)
- user@example.com / password123 (user)

## Environment

See `backend/.env.example` and `frontend/.env.example` for required variables (Neon `DATABASE_URL`, Razorpay keys, Google OAuth, ImageKit, CORS origins).

## License

MIT
