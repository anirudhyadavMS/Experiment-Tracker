# Product Feature Experiment Tracker

A comprehensive web application for tracking and managing product feature experiments. Built with React, Express, TypeScript, and MongoDB.

## Features

- **Comprehensive Tracking**: Track experiments with detailed information including:
  - Basic info (name, description, owner, status, dates)
  - Hypothesis and success metrics
  - Multiple variants with distribution percentages
  - Results, learnings, and business impact
  - Confidence levels and go/no-go decisions

- **Advanced Filtering**: Filter experiments by:
  - Status (running, completed, paused)
  - Owner
  - Date ranges
  - Decision
  - Confidence level

- **Sorting & Search**:
  - Sort by any column (name, owner, status, dates)
  - Full-text search across experiment names, descriptions, and hypotheses

- **Intuitive UI**:
  - Clean, modern dashboard
  - Modal-based form for creating/editing experiments
  - Responsive design for mobile and desktop
  - Real-time status badges and visual indicators

## Tech Stack

**Frontend:**
- React 18
- TypeScript
- Axios for API calls
- Custom hooks for state management

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- RESTful API design

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd experiment-tracker
   ```

2. **Install dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables:**

   The `.env` file is already created, but you may need to update the MongoDB URI:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/experiment-tracker
   REACT_APP_API_URL=http://localhost:5000/api
   ```

   For MongoDB Atlas:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/experiment-tracker
   ```

4. **Start MongoDB (if running locally):**
   ```bash
   # On Windows
   net start MongoDB

   # On macOS/Linux
   sudo systemctl start mongod
   # or
   brew services start mongodb-community
   ```

## Running the Application

### Option 1: Run Both Servers Together (Recommended)

```bash
npm start
```

This will start both the backend server (port 5000) and frontend development server (port 3000) concurrently.

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
npm run dev:backend
```

**Terminal 2 - Frontend:**
```bash
npm run dev:frontend
```

### Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api
- Health Check: http://localhost:5000/health

## Project Structure

```
experiment-tracker/
├── src/
│   ├── backend/
│   │   ├── controllers/
│   │   │   └── experimentsController.ts    # Business logic
│   │   ├── models/
│   │   │   └── experiment.ts               # Mongoose schema
│   │   ├── routes/
│   │   │   └── api.ts                      # API routes
│   │   ├── middleware/
│   │   │   └── errorHandler.ts             # Error handling
│   │   └── server.ts                       # Express server
│   ├── frontend/
│   │   ├── components/
│   │   │   ├── ExperimentCard.tsx
│   │   │   ├── ExperimentFilters.tsx
│   │   │   ├── ExperimentForm.tsx
│   │   │   ├── ExperimentList.tsx
│   │   │   └── SearchBar.tsx
│   │   ├── pages/
│   │   │   └── Dashboard.tsx               # Main page
│   │   ├── services/
│   │   │   └── api.ts                      # API client
│   │   ├── hooks/
│   │   │   ├── useExperiments.ts
│   │   │   └── useFilters.ts
│   │   ├── styles/
│   │   │   └── global.css
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── shared/
│       └── types.ts                        # Shared TypeScript types
├── public/
│   └── index.html
├── package.json
├── tsconfig.json
└── .env
```

## API Endpoints

### Experiments

| Method | Endpoint | Description | Query Parameters |
|--------|----------|-------------|------------------|
| GET | `/api/experiments` | Get all experiments | status, owner, startDateFrom, startDateTo, decision, confidenceLevel, search, sortField, sortOrder, page, limit |
| GET | `/api/experiments/:id` | Get single experiment | - |
| POST | `/api/experiments` | Create new experiment | - |
| PUT | `/api/experiments/:id` | Update experiment | - |
| DELETE | `/api/experiments/:id` | Delete experiment | - |
| GET | `/api/experiments/statistics` | Get statistics | - |

### Example API Request

**Create a new experiment:**
```bash
curl -X POST http://localhost:5000/api/experiments \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Checkout Flow",
    "description": "Testing a simplified checkout process",
    "owner": "John Doe",
    "status": "running",
    "startDate": "2026-01-15",
    "hypothesis": "A simpler checkout will increase conversion by 15%",
    "successMetrics": ["15% increase in conversion", "20% reduction in cart abandonment"],
    "targetAudience": "All users",
    "variants": [
      {"name": "Control", "description": "Current checkout", "percentage": 50},
      {"name": "Simplified", "description": "One-page checkout", "percentage": 50}
    ]
  }'
```

## Usage Guide

### Creating an Experiment

1. Click the "+ New Experiment" button in the top right
2. Fill in the required fields:
   - Name, description, owner
   - Start date and optional end date
   - Hypothesis and success metrics
   - Target audience
   - Variants (at least one required)
3. Optionally add results, learnings, and business impact
4. Set confidence level and decision (go/no-go)
5. Click "Create Experiment"

### Filtering Experiments

Use the sidebar filters to narrow down experiments:
- Select status from dropdown
- Enter owner name
- Set date ranges
- Choose decision and confidence level
- Click "Apply Filters"

### Searching Experiments

Use the search bar at the top to search across:
- Experiment names
- Descriptions
- Hypotheses

### Sorting Experiments

Click on any column header in the list to sort:
- First click: ascending order
- Second click: descending order
- Arrow indicators show current sort direction

### Editing an Experiment

1. Click the "Edit" button on any experiment card
2. Modify the fields as needed
3. Click "Update Experiment"

### Deleting an Experiment

1. Click the "Delete" button on any experiment card
2. Confirm the deletion in the popup
3. The experiment will be permanently removed

## Development

### Building for Production

**Backend:**
```bash
npm run build:backend
```

**Frontend:**
```bash
npm run build:frontend
```

**Both:**
```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Troubleshooting

### MongoDB Connection Issues

If you can't connect to MongoDB:

1. **Check if MongoDB is running:**
   ```bash
   # Windows
   sc query MongoDB

   # macOS/Linux
   sudo systemctl status mongod
   ```

2. **Verify connection string:**
   - For local: `mongodb://localhost:27017/experiment-tracker`
   - For Atlas: Check your cluster connection string

3. **Firewall:** Ensure port 27017 is not blocked

### Port Already in Use

If ports 3000 or 5000 are already in use:

1. Change the port in `.env` file
2. Kill the process using the port:
   ```bash
   # Windows
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F

   # macOS/Linux
   lsof -i :5000
   kill -9 <PID>
   ```

### Dependency Issues

If you encounter dependency conflicts:

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

ISC

## Contact

For questions or support, please contact the development team.
