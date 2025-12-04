# Frontend - React Application

This is the React frontend for the University Consultation Appointment System.

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create environment file (optional):**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your API URL if different from default.

3. **Start development server:**
   ```bash
   npm start
   ```
   The app will open at `http://localhost:3000`

4. **Build for production:**
   ```bash
   npm run build
   ```

## Project Structure

```
FRONTEND/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── api/           # API configuration and services
│   ├── components/    # Reusable React components
│   ├── pages/         # Page components
│   ├── hooks/         # Custom React hooks
│   ├── styles/        # CSS files
│   ├── utils/         # Utility functions
│   ├── App.jsx        # Main App component
│   └── index.js       # Entry point
├── package.json
└── README.md
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (irreversible)


