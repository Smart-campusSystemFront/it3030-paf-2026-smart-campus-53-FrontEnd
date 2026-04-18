# 🏛️ Smart Campus System — Front End

> **React 19 · Vite 8 · TailwindCSS v4 · Ant Design v6 · React Router v7**

The web client for the Smart Campus platform — a university campus management application that enables students to browse and book campus resources, submit support tickets, and receive real-time notifications. Admins manage users, resources, and system health through a dedicated dashboard.

---

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features & Completion Status](#-features--completion-status)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Routes](#-routes)
- [Roles & Access](#-roles--access)
- [Roadmap](#-roadmap)

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | JavaScript (JSX) |
| Framework | React 19 + Vite 8 |
| Routing | React Router v7 |
| UI Library | Ant Design v6 |
| Icons | FontAwesome v7 (Solid + Brands) |
| CSS | TailwindCSS v4 |
| HTTP | Custom `apiRequest` wrapper (`src/lib/api.js`) |
| Auth State | React Context API + localStorage (JWT) |
| Build | Vite / ESBuild |
| Linter | ESLint 9 |

---

## 📁 Project Structure

```
src/
├── assets/                  # Static images & media
├── components/
│   ├── Layout.jsx            # Root layout wrapper
│   ├── ProtectedRoute.jsx    # Auth + role guard HOC
│   ├── UserDashboardLayout.jsx
│   ├── AdminDashboardLayout.jsx
│   ├── FeaturePlaceholder.jsx  # "Coming Soon" stub
│   ├── ui.jsx                  # Shared design system (Card, Button, Input, Alert)
│   ├── booking/              # Booking UI components
│   ├── common/               # Shared components (headers, sidebars)
│   ├── notification/         # Notification bell & dropdown
│   └── ticket/               # Ticket form & list components
├── context/
│   └── AuthContext.jsx       # JWT auth state & methods
├── lib/
│   ├── api.js                # Core HTTP utility (apiRequest)
│   ├── config.js             # VITE_API_BASE_URL config
│   └── storage.js            # Token read/write (localStorage)
├── pages/
│   ├── Login.jsx             # Email/password + Google OAuth login
│   ├── Register.jsx          # Registration form
│   ├── OAuthCallback.jsx     # Parses ?token= from OAuth redirect
│   ├── Profile.jsx           # User profile + avatar upload
│   ├── AdminUsers.jsx        # Admin: user management table
│   ├── admin/                # Admin dashboard pages
│   ├── booking/              # Booking pages
│   ├── dashboard/            # User dashboard pages
│   ├── profile/              # Extended profile pages
│   ├── resources/            # Resource browser pages
│   └── tickets/              # Ticket pages
├── routes/                   # Route configuration helpers
├── services/                 # API service modules (per feature)
└── utils/                    # Shared utility functions
```

---

## ✅ Features & Completion Status

> Update the checkboxes below as features are completed.

### 🔐 Authentication
- [x] Email + password login form
- [x] User registration form
- [x] Google OAuth2 — redirect to backend → parse `?token=` callback
- [x] JWT token stored in `localStorage`, injected in every API request
- [x] Auto-redirect to `/login` when token is missing or expired
- [x] Logout (clears token + user state)

### 🧭 Routing & Navigation
- [x] `ProtectedRoute` component (redirect to `/login` if unauthenticated)
- [x] Role-based guard — `requireRole="ADMIN"` blocks non-admins
- [x] User dashboard layout (`/dashboard`)
- [x] Admin dashboard layout (`/admin`)
- [x] 404 fallback — redirects to `/`

### 👤 User Features
- [x] View own profile (name, email, role, avatar)
- [x] Edit profile (name, email, password)
- [x] Upload profile picture
- [ ] View booking history
- [ ] View submitted tickets
- [ ] View notifications

### 🛠️ Admin Panel
- [x] Admin overview page
- [x] User management table (list, create, edit, toggle active)
- [x] Admin ticket management page (stub)
- [ ] Resource management UI (CRUD)
- [ ] View & manage all bookings
- [ ] Assign tickets to technicians
- [ ] Dashboard analytics / stats cards

### 🏢 Resource Browser
- [ ] List all campus resources (rooms, labs, equipment)
- [ ] Filter by type / availability
- [ ] Resource detail view
- [ ] Real-time availability display

### 📅 Booking System
- [ ] Resource booking form (date + time slot picker)
- [ ] Booking confirmation screen
- [ ] My bookings list (with cancel option)
- [ ] Booking status badges (Pending / Confirmed / Cancelled)
- [ ] Connect `bookingService.js` to REST API

### 🎫 Ticket System
- [ ] Ticket submission form (title, description, type, priority)
- [ ] My tickets list with status tracking
- [ ] Ticket detail / update view
- [ ] Connect `ticketService.js` to REST API

### 🔔 Notifications
- [ ] Notification bell icon in header
- [ ] Dropdown list of unread notifications
- [ ] Mark individual notification as read
- [ ] Mark all as read
- [ ] Polling or WebSocket for real-time updates

### 🎨 UI / Design System
- [x] Shared `ui.jsx` component library (Card, Button, Input, Alert)
- [x] TailwindCSS v4 base styling
- [x] Ant Design v6 for complex components
- [x] Responsive layout (desktop first)
- [ ] Mobile-responsive navigation
- [ ] Dark mode support
- [ ] Loading skeletons for async data
- [ ] Toast / Snackbar feedback on actions

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- Backend API running at `http://localhost:8080` (see [Backend README](../smart-campus-system-BackEnd/README.md))

### 1. Clone & install

```bash
git clone https://github.com/isuru666/smart-campus-system-FrontEnd.git
cd smart-campus-system-FrontEnd
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### 3. Run development server

```bash
npm run dev
```

App available at: **`http://localhost:5173`**

### 4. Build for production

```bash
npm run build
```

Output goes to `dist/`.

---

## 🔑 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080` | Base URL of the Spring Boot API |

---

## 🗺️ Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Redirects → `/dashboard` or `/login` |
| `/login` | Public | Login with email/password or Google |
| `/register` | Public | Create a new account |
| `/auth/callback` | Public | Handles OAuth2 token redirect |
| `/profile` | Authenticated | User profile & settings |
| `/dashboard` | Authenticated | User home dashboard |
| `/dashboard/tickets` | Authenticated | User's own tickets |
| `/admin` | ADMIN only | Admin dashboard redirect |
| `/admin/overview` | ADMIN only | System overview |
| `/admin/users` | ADMIN only | User management |
| `/admin/tickets` | ADMIN only | All tickets |

---

## 🛡️ Roles & Access

| Feature | USER | TECHNICIAN | ADMIN |
|---------|:----:|:----------:|:-----:|
| Login / Register | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| Browse resources | ✅ | ✅ | ✅ |
| Create booking | ✅ | ✅ | ✅ |
| Submit ticket | ✅ | ✅ | ✅ |
| View all tickets | ❌ | ✅ | ✅ |
| Update ticket status | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |
| Manage resources | ❌ | ❌ | ✅ |
| View all bookings | ❌ | ❌ | ✅ |

---

## 🗺️ Roadmap

- [ ] Implement Resource browser with live availability
- [ ] Wire Booking form to backend API
- [ ] Wire Ticket submission & tracking to backend API
- [ ] Implement notification bell with polling
- [ ] Populate `services/bookingService.js` and `services/ticketService.js`
- [ ] Add loading states and error boundaries
- [ ] Mobile-responsive navigation (hamburger menu)
- [ ] Dark mode toggle
- [ ] Unit tests (Vitest + React Testing Library)
- [ ] E2E tests (Playwright)
- [ ] CI/CD pipeline (GitHub Actions → Vercel / Netlify)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

*Last updated: April 2026*
