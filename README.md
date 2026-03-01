# GDG On Campus — Vishnu Institute of Technology, Bhimavaram

> Official website for **Google Developer Group On Campus** at Vishnu Institute of Technology (VITB), Bhimavaram.  
> A student-driven, Google-supported community that incubates ideas from prototyping to product — running hackathons, workshops, and collaborative projects.

🌐 **Live at** — [https://gdgvitb.in](https://gdgvitb.in)

---

## Features

| Page                | Description                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| **Home**            | Hero section, upcoming events, about snippet, FAQs, and extension section      |
| **About**           | Mission, vision, and community info                                            |
| **Events**          | Browse all past & upcoming events with theme-coloured cards, tags, and filters |
| **Event Detail**    | Individual event pages with highlights, registration, and organizer info       |
| **Teams**           | Meet the organizers, leads, and core members                                   |
| **Gallery**         | Photo lightbox of workshops, hackathons, and gatherings                        |
| **Hack-a-tron 3.0** | Dedicated landing page for the Harry Potter-themed 24-hour hackathon           |
| **Recruitment**     | Role-based recruitment portal (e.g. Full-Stack Web Dev)                        |
| **Registrations**   | Authenticated users can view their event registrations                         |
| **Profile Setup**   | Post-signup profile completion (branch, year, etc.)                            |
| **Contact Us**      | Reach out via social handles and contact details                               |
| **Auth**            | Sign up, log in, forgot password flows (Firebase Auth)                         |

---

## Tech Stack

| Layer             | Technology                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------------------- |
| **Framework**     | [Next.js 15](https://nextjs.org) (App Router, Turbopack)                                       |
| **Language**      | TypeScript                                                                                     |
| **Styling**       | Tailwind CSS v4                                                                                |
| **UI Components** | Radix UI, Lucide Icons, Tabler Icons                                                           |
| **Animations**    | Framer Motion                                                                                  |
| **State / Data**  | TanStack React Query, nuqs (URL state)                                                         |
| **Forms**         | React Hook Form + Zod validation                                                               |
| **Auth**          | Firebase Auth (Google OAuth + Email/Password with credential linking) via custom `AuthContext` |
| **Database**      | Cloud Firestore                                                                                |
| **Image Hosting** | Cloudinary, Unsplash, Freepik CDN                                                              |
| **Analytics**     | Vercel Speed Insights                                                                          |
| **Testing**       | Playwright (e2e)                                                                               |
| **Linting**       | ESLint (typescript-eslint)                                                                     |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or yarn / pnpm / bun)
- A **Firebase** project with Firestore & Auth enabled

### 1. Clone the repo

```bash
git clone https://github.com/GDG-Vishnu/gdg-vishnu-app.git
cd gdg-vishnu-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` in the project root and populate it with:

```env
# Firebase Client SDK
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Google Search Console (optional)
GOOGLE_VERIFICATION_ID=
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3050](http://localhost:3050) in your browser.

---

## Available Scripts

| Command         | Description                               |
| --------------- | ----------------------------------------- |
| `npm run dev`   | Start dev server on port 3050 (Turbopack) |
| `npm run build` | Production build                          |
| `npm run start` | Start production server                   |
| `npm run lint`  | Run ESLint                                |

---

## Project Structure

```
src/
├── app/                  # Next.js App Router pages & API routes
│   ├── api/              # REST endpoints (events, teams, auth)
│   ├── client/           # Client components (Home, Teams, Gallery, etc.)
│   ├── events/           # Events listing & detail pages
│   ├── hack-a-tron-3.0/  # Hackathon landing page
│   ├── recruitment/      # Recruitment portal
│   ├── registrations/    # User registrations dashboard
│   └── ...
├── components/           # Shared UI components (Navbar, Footer, Loading states)
├── contexts/             # React context providers (AuthContext)
├── features/             # Feature-scoped modules (about, layout/Navbar)
├── lib/                  # Utilities (Firebase clients, helpers)
├── services/             # Business logic services (registration)
└── types/                # TypeScript type definitions
tests/                    # Playwright e2e & load tests
scripts/                  # Utility scripts (seed events, list team members)
```

---

## Deployment

The site is deployed on **Vercel**. Every push to the main branch triggers an automatic production deployment.

Firestore security rules are managed via `firestore.rules` and can be deployed with:

```bash
firebase deploy --only firestore:rules
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m "feat: add your feature"`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## License

ISC

---

Built with ❤️ by the **GDG VITB Team**
