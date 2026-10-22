# SkillNova — Emerald & Mint Learning Platform

A responsive React + Vite starter project with a dark emerald/teal theme with accessible contrast.

## Run in VS Code

1. Install Node.js (LTS) if it is not installed: https://nodejs.org/
2. Extract this ZIP.
3. Open the `skillnova` folder in VS Code.
4. Open Terminal → New Terminal.
5. Run:

```bash
npm install
npm run dev
```

6. Open the local URL printed in the terminal (usually `http://localhost:5173`).

## Demo login

- Admin: `admin@gmail.com` / `admin123`
- Student: `student@gmail.com` / `student123`

## Included

- Dark forest-green surfaces with emerald `#16845B` and teal `#12A89D` accents
- Responsive homepage, course catalogue, search, category and level filters
- Student dashboard, enrollments, simulated lesson progress
- Admin dashboard, add/delete courses, user listing and demo analytics
- Pricing and testimonial pages
- Demo sign-up creates student accounts only
- Session and demo data stored in browser localStorage

## Important security note

This is a frontend demo/starter, NOT production-secure authentication. Demo users, passwords, roles, course data and sessions are stored in browser localStorage. A user can inspect or edit these values, so **do not deploy this as a real paid course platform or store real passwords in it**.

For a production version, connect a trusted authentication/backend service (for example Supabase Auth + Postgres, or Firebase Authentication + Firestore), enforce admin/student roles on the server/database rules, store videos/PDFs in protected storage, and verify payment webhooks on the server before granting course access. Never trust a role selected by a browser or a client-side price/payment flag.
