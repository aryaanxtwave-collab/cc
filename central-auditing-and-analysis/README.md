# Central Auditing and Analysis

Internal dashboard for NxtWave's Content Department — track team performance, budgets, KPIs, and feedback across 7 teams.

## Quick Start

```bash
# Install dependencies
npm install
cd client && npm install
cd ../server && npm install
cd ..

# Start both client and server
npm run dev
```

- **Client**: http://localhost:5173
- **Server**: http://localhost:3001

## Google Sheets API Setup

The Executive Summary page fetches live data from Google Sheets. To enable this:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → Create a project → Enable the **Google Sheets API**
2. Create a **Service Account** → Download the JSON key file
3. Base64 encode the JSON key:
   ```bash
   base64 -i credentials.json | tr -d '\n'
   ```
4. Paste the result into `server/.env` as `GOOGLE_SERVICE_ACCOUNT_KEY`
5. Share each Google Sheet with the service account email (viewer access)

### server/.env

```
GOOGLE_SERVICE_ACCOUNT_KEY=<base64 encoded service account JSON>
PORT=3001
```

## Architecture

```
central-auditing-and-analysis/
├── client/          # React + Vite frontend (port 5173)
├── server/          # Node.js + Express backend (port 3001)
└── package.json     # Root — runs both with concurrently
```

## Features

- **Home** — Team grid with tracker quick-access icons
- **Team Detail** — Member table, tracker links, navigation to summary & feedback
- **Executive Summary** — Live charts (KPI, Budget, Expense, KRA, Deliverables) from Google Sheets
- **Feedback** — localStorage-persisted feedback log with search, edit, delete
- **PDF Export** — Export executive summary as PDF
