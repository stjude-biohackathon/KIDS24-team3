# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a BioHackathon project (KIDS24-team3) focused on optimizing High-Performance Computing (HPC) resource allocation through statistical analysis. The project combines a React dashboard frontend with Python data processing and analysis components.

## Repository Structure

The codebase is organized into specialized directories:

- `ziang/` - React dashboard frontend using Material-UI
- `zhuo/` - Data analysis and Jupyter notebooks
- `ctrotter/` - Python data aggregation scripts
- `python_utils/` - MongoDB connection utilities
- `public/` - Static assets and documentation

This is a polyglot project combining React.js frontend, Python backend processing, and Jupyter notebooks for analysis.

## Development Commands

### Frontend Development (ziang/)
```bash
cd ziang
npm install              # Install dependencies
npm start               # Development server (http://localhost:3000)
npm run build           # Production build
npm test                # Run Jest tests
npm run install:clean   # Clean dependency install
```

### Backend Data Processing
```bash
# Run data aggregation
python ctrotter/aggregate.py

# MongoDB connection (see python_utils/mongo_connect.py for setup)
# Jupyter analysis notebooks in zhuo/
```

### Common Development Tasks
```bash
# Frontend: Add new dashboard component
# 1. Create component in ziang/src/components/
# 2. Add to layout in ziang/src/layouts/adminview/index.js
# 3. Update routes if needed in ziang/src/routes.js

# Backend: Modify data aggregation
# Edit ctrotter/aggregate.py - main aggregation function is tally_jobs()

# Analysis: Create new analysis
# Add Jupyter notebook to zhuo/ directory
```

## Code Architecture

### Frontend (React + Material-UI)
- **State Management**: React Context API (not Redux)
- **Routing**: React Router v6 with nested routes
- **Styling**: Material-UI v5 with Emotion CSS-in-JS
- **Data Visualization**: Chart.js and react-chartjs-2

**Key Patterns:**
- Reusable Material Design components in `components/` (MDBox, MDButton, etc.)
- Layout system with AdminView as main dashboard
- Global state via `useMaterialUIController` context
- Data fetching through `components/Datasource/index.js`

**API Integration:**
- Primary endpoint: `https://svlplsfexplorer.stjude.org/db`
- Available data: `lsf/latestBatch?col=host_load` and `lsf/latestBatch?col=host_config`

### Backend (Python + MongoDB)
- **Database**: MongoDB with collections: `finished_jobs`, `host_load`, `host_config`
- **Data Pipeline**: MongoDB → Python aggregation → CSV export → Dashboard
- **Aggregation Logic**: Time-windowed (15-minute intervals) job and resource tracking

**Key Components:**
- `aggregate.py`: Main data processing with `tally_jobs()` function
- `mongo_connect.py`: Database connection utilities
- Jupyter notebooks: Exploratory analysis and model development

### Data Flow
1. LSF cluster data stored in MongoDB
2. Python scripts aggregate metrics per queue in time windows
3. React dashboard fetches real-time data via API
4. Jupyter notebooks used for offline analysis and modeling

## Configuration Files

- `ziang/package.json` - Frontend dependencies and scripts
- `ziang/jsconfig.json` - Import path aliases (baseUrl: "src")
- `genezio.yaml` - Deployment configuration
- ESLint + Prettier configured for code formatting

## Key Data Structures

**Job Records**: userId, jobId, numProcessors, jStatus, submitTime, startTime, endTime, queue, resReq, maxRMem, command, cpuTime, runTime

**Aggregated Metrics**: Per queue tracking of running_jobs, pending_jobs, total_cores, total_memory, available_cores, available_memory

## Development Practices

### Component Development
- Follow Material Design patterns established in existing components
- Use MUI components wrapped in custom MD* components (MDBox, MDButton, etc.)
- Implement responsive design with MUI breakpoints
- Maintain theme consistency (supports light/dark modes)

### Data Processing
- Time-windowed aggregation to handle large datasets efficiently
- Use pandas for data manipulation and MongoDB queries
- Export aggregated data to CSV for analysis
- Jupyter notebooks for exploratory analysis before implementation

### State Management
- Use React Context for global state (theme, navigation, refresh triggers)
- Local component state with hooks for component-specific data
- GlobalRefreshContext for coordinating data updates across components

## Testing Strategy

The project currently lacks comprehensive testing infrastructure:
- Frontend: Jest/React Testing Library available but minimal tests
- Backend: No formal testing framework; testing done in Jupyter notebooks

When adding tests:
- Frontend: Use existing Jest setup, follow React Testing Library patterns
- Backend: Consider adding pytest for Python components

## Important Notes

- API endpoints are currently hardcoded in components
- MongoDB credentials should be environment-based (not committed)
- README.md warns against committing sensitive data
- Project uses 15-minute aggregation windows for performance
- Dashboard focused on real-time HPC cluster resource monitoring

## File Structure Navigation

**Key files to understand first:**
- `ziang/src/layouts/adminview/index.js` - Main dashboard layout
- `ziang/src/components/Datasource/index.js` - API integration layer
- `ctrotter/aggregate.py` - Core data aggregation logic
- `python_utils/mongo_connect.py` - Database connection setup
- `ziang/src/routes.js` - Application routing configuration

**Adding new features:**
- Dashboard widgets: Modify AdminView layout + add corresponding data endpoints
- New analysis: Create Jupyter notebook in zhuo/ directory
- UI components: Follow established MD* component patterns
- Data processing: Extend aggregate.py or add new processing scripts