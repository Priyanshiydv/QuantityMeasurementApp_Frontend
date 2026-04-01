# QuantityMeasurementApp Frontend

<<<<<<< HEAD
## Project Overview
The QuantityMeasurementApp Frontend is a full-stack frontend project built in two phases — UC19 using plain HTML/CSS/JavaScript with JSON Server, and UC20 using Angular 17 framework — both connected to the ASP.NET Core UC18 backend API.

---

## Repository Structure
```
QuantityMeasurementApp_Frontend/
│
├── pages/          ← UC19: HTML pages
├── css/            ← UC19: Stylesheets
├── js/             ← UC19: JavaScript files
├── data/           ← UC19: JSON Server db.json
├── index.html      ← UC19: Entry point
├── package.json    ← UC19: npm scripts
│
└── angular/
    └── quantimeasure/   ← UC20: Angular 17 project
        ├── src/
        │   ├── app/
        │   │   ├── components/
        │   │   │   ├── login/
        │   │   │   ├── signup/
        │   │   │   ├── dashboard/
        │   │   │   ├── history/
        │   │   │   ├── profile/
        │   │   │   └── toast/
        │   │   ├── services/
        │   │   │   ├── auth.service.ts
        │   │   │   ├── quantity.service.ts
        │   │   │   ├── history.service.ts
        │   │   │   ├── profile.service.ts
        │   │   │   ├── theme.service.ts
        │   │   │   └── toast.service.ts
        │   │   ├── guards/
        │   │   │   └── auth.guard.ts
        │   │   ├── interceptors/
        │   │   │   └── jwt.interceptor.ts
        │   │   ├── models/
        │   │   │   ├── user.ts
        │   │   │   ├── quantity.ts
        │   │   │   └── auth-response.ts
        │   │   ├── app.routes.ts
        │   │   └── app.config.ts
        │   ├── styles.scss
        │   └── index.html
        └── package.json
```

---

## Branches

| UC | Branch | Description |
|----|--------|-------------|
| UC19 | `feature/UC19-HtmlCssJSONserver` | HTML, CSS, JSON Server |
| UC20 | `feature/UC20/Angular` | Angular 17 + Backend Integration |

---

## UC19 — HTML, CSS, JSON Server

### Features
- Login and Signup pages with HTML and CSS
- JSON Server as fake REST API for local data storage
- Dark theme with Ocean Blue color scheme
- Password show/hide toggle
- Password strength indicator
- Tab switching (Login/Signup on same page)
- Connected to ASP.NET UC18 backend for calculator, history and profile
- My History / All History toggle
- Filter by operation and measurement type

### How to Run UC19
```bash
# Install JSON Server
npm install -g json-server@0.17.4

# Start JSON Server
npm start

# Open pages/login.html with Live Server in VS Code
```

---

## UC20 — Angular 17

### Features

#### Authentication
- Login with username and password
- Register new account
- Google OAuth 2.0 Sign In
- JWT token stored in localStorage
- Auto redirect if already logged in
- Refresh token support
- Sign Out

#### Dashboard (Calculator)
- Accessible **without login** (public)
- 4 Measurement Types — Length, Weight, Volume, Temperature
- 5 Operations — Convert, Compare, Add, Subtract, Divide
- Dynamic unit dropdowns based on selected type
- Target unit selection for result
- Swap values button
- Result display with operation metadata
- Stats summary cards (Total ops, Most used op, Top category, Latest op)
- Supported units reference card

#### History
- Requires login
- My History — shows only logged in user's operations
- All History — shows everyone's operations
- Filter by Operation type
- Filter by Measurement type
- Get Count feature
- Color coded operation badges
- Skeleton loading animation

#### Profile
- Requires login
- Shows username, email, role, member since
- Reads data from JWT claims via backend

#### UI/UX
- Dark / Light mode toggle (moon/sun icon)
- Toast notifications (success, error, info, warning)
- Loading spinner on API calls
- Responsive sidebar navigation
- Ocean Blue dark theme
- Smooth theme transition animations

### Angular Architecture

| Concept | Implementation |
|---|---|
| Routing | Angular Router with lazy routes |
| HTTP | HttpClient with JWT Interceptor |
| Auth Guard | Protects History and Profile routes |
| JWT Interceptor | Auto adds Bearer token to every request |
| Services | Auth, Quantity, History, Profile, Theme, Toast |
| Models | User, QuantityInput, QuantityResponse, HistoryItem |
| Standalone Components | All components are standalone |

### How to Run UC20
```bash
# Navigate to Angular project
cd angular/quantimeasure

# Install dependencies
npm install

# Run development server
ng serve

# Open browser at
http://localhost:4200
```

Make sure **ASP.NET backend is running** at `http://localhost:5092` before testing!

---

## Backend Integration

All API calls connect to ASP.NET Core UC18 backend:

| Feature | Endpoint |
|---|---|
| Register | POST /api/v1/users/register |
| Login | POST /api/v1/users/login |
| Google Login | POST /api/v1/users/google-login |
| Refresh Token | POST /api/v1/users/refresh |
| Profile | GET /api/v1/users/profile |
| Compare | POST /api/v1/quantities/compare |
| Convert | POST /api/v1/quantities/convert |
| Add | POST /api/v1/quantities/add |
| Subtract | POST /api/v1/quantities/subtract |
| Divide | POST /api/v1/quantities/divide |
| All History | GET /api/v1/quantities/history |
| My History | GET /api/v1/quantities/history/my |
| Filter by Op | GET /api/v1/quantities/history/operation/{type} |
| Filter by Type | GET /api/v1/quantities/history/measurement/{type} |
| Count | GET /api/v1/quantities/count |

---

## Technologies

| Technology | Purpose |
|---|---|
| HTML5 / CSS3 | UC19 structure and styling |
| JavaScript | UC19 logic and API calls |
| JSON Server | UC19 fake REST API |
| Angular 17 | UC20 frontend framework |
| TypeScript | UC20 language |
| SCSS | UC20 styling |
| Angular Router | UC20 navigation |
| HttpClient | UC20 API calls |
| JWT Interceptor | UC20 auto auth headers |
| Google OAuth 2.0 | Social login |
| LocalStorage | Token persistence |
| Git + GitHub | UC-wise branch strategy |

---

## Author
**Priyanshi Yadav**
=======
>>>>>>> ca6c887fc9f6a7034dc0c1e734f0a040aec8899b
