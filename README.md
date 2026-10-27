# Personal Expense Tracker - Frontend Client

Responsive, modern web dashboard for Personal Expense Tracker built with **React.js**, **Vite**, **Lucide Icons**, and **Axios**.

---

## Features

- **Authentication System**: User registration, login, session persistence via JWT, and profile management with instant logout.
- **Interactive Dashboard**:
  - Real-time summary metrics (Total Spent in Indian Rupees `₹`, Total Count, Active Categories, and Average Expense).
  - Add, Edit, and Delete expenses with modal confirmation dialogs.
  - Multi-criteria filtering by category (Food, Travel, Rent, Entertainment, Education, Health, Shopping, Utilities, Other).
  - Search by expense title with live filtering.
  - Sorting by Date (Newest / Oldest) and Amount (Highest / Lowest).
- **Backend Health Indicator**: Visual connection status indicator checking Spring Boot service availability.
- **Accessible & Responsive**: Fully responsive layout designed for mobile, tablet, and desktop screens with dark-mode aesthetic.
- **Secure API Communication**: Axios interceptor automatically attaches the `Authorization: Bearer <token>` header to all protected expense API requests.
- **Sanitized Error Feedback**: User-friendly toast notifications handling server validation messages and connection errors without exposing internal exception traces.

---

## Prerequisites

- **Node.js**: Version 18.0.0 or higher (LTS recommended)
- **npm**: Version 9.0.0 or higher (comes bundled with Node.js)
- **Backend API**: Running instance of the Spring Boot backend (local or cloud)

Verify your Node.js and npm installations:
```bash
node -v
# Expected: v18.x.x or higher

npm -v
# Expected: 9.x.x or higher
```

---

## Getting Started

### 1. Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/vasavi44/personal-expense-tracker-frontend.git
cd personal-expense-tracker-frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file from the provided `.env.example`:
```bash
cp .env.example .env
```

Configure the backend API URL in `.env`:
```env
# Local development with Spring Boot running on port 8080
VITE_API_BASE_URL=http://localhost:8080/api
```

> ⚠️ **Security Warning**:
> All environment variables prefixed with `VITE_` are bundled into the client-side JavaScript code and are visible to anyone inspecting browser network traffic. **Never** put private API keys, database credentials, or JWT signing secrets in `VITE_` variables.

### 3. Local Development

Start the Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## Building for Production

To create an optimized, minified production bundle:
```bash
npm run build
```

The output will be generated in the `dist/` directory:
- `dist/index.html`
- `dist/assets/index-[hash].css`
- `dist/assets/index-[hash].js`

To preview the production build locally:
```bash
npm run preview
```

---

## Deploying to Vercel

The repository includes a pre-configured `vercel.json` for single-page application routing and immutable asset caching.

### Step-by-Step Deployment:
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **Add New** -> **Project**.
3. Import the `personal-expense-tracker-frontend` repository.
4. In **Project Settings**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: The URL of your deployed Spring Boot backend (e.g. `https://your-backend-app.onrender.com/api`).
6. Click **Deploy**.

Vercel will automatically build and assign a production URL (e.g., `https://personal-expense-tracker-frontend.vercel.app`).

---

## Project Structure

```
├── public/                 # Static assets (favicons, SVG icons)
├── src/
│   ├── assets/             # Brand logos and images
│   ├── components/         # Reusable React UI components
│   │   ├── Header.jsx          # App navbar, brand title, and user profile
│   │   ├── LoginPage.jsx       # User login form
│   │   ├── RegisterPage.jsx    # User registration form
│   │   ├── SummaryCards.jsx    # KPI metric cards (Total, Count, Avg)
│   │   ├── ExpenseForm.jsx     # Add expense form
│   │   ├── ExpenseList.jsx     # Responsive expense grid / cards
│   │   ├── FilterBar.jsx       # Search, category filter, and sort controls
│   │   ├── EditModal.jsx       # Modal for updating an expense
│   │   ├── DeleteConfirmModal.jsx # Confirmation dialog for deletion
│   │   ├── Toast.jsx           # Animated notification toast
│   │   └── Footer.jsx          # Application footer
│   ├── context/
│   │   └── AuthContext.jsx     # Global authentication provider and hook
│   ├── services/
│   │   ├── authService.js      # Axios client for /api/auth endpoints
│   │   └── expenseService.js   # Axios client for /api/expenses endpoints
│   ├── utils/
│   │   └── formatters.js       # Indian Rupee (INR) and date formatting
│   ├── App.jsx             # Main dashboard orchestrator
│   ├── index.css           # Global design system & theme tokens
│   └── main.jsx            # React root entry point
├── .env.example            # Environment variable template
├── .gitignore              # Git ignore rules for node_modules, .env, dist
├── index.html              # HTML shell
├── package.json            # Project dependencies and npm scripts
├── vercel.json             # Vercel SPA routing and header configuration
└── vite.config.js          # Vite bundler configuration
```

---

## License

This project is licensed under the MIT License.
