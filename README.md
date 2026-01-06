# Pace Business Onboarding

This project consists of three main components:
1. **Backend Server**: Handles API requests and browser agents.
2. **Wio Onboarding App**: The applicant-facing frontend.
3. **Zamp Dashboard**: The reviewer-facing dashboard.

## Prerequisites

- Node.js & npm
- Python 3
- Pip (Python package installer)

## Quick Start / Running the Project

You will need to open **three separate terminal windows** to run the full system.

### 1. Backend Server

Navigate to the `src` directory and start the Python server.

```bash
cd src
# If you haven't installed dependencies yet:
# pip install -r requirements.txt (if available) or install manually:
# pip install flask flask-cors playwright beautifulsoup4 google-generativeai selenium webdriver-manager
# python3 -m playwright install chromium

python3 server_api.py
```

### 2. Wio Onboarding App (Applicant)

This is the main frontend application located in the root directory.

```bash
# From the project root directory
npm install  # Run this once to install dependencies
npm run dev
```

### 3. Zamp Dashboard (Reviewer)

This is the dashboard for reviewing applications, located in the `kyriba test copy 4/zamp-dashboard` directory.

```bash
# From the project root directory
cd "kyriba test copy 4/zamp-dashboard"
npm install  # Run this once to install dependencies
npm run dev
```

## Directory Structure

- **src/**: Contains the Python backend code (`server_api.py`) and browser agents.
- **Root**: Contains the main React/Vite application (Wio Onboarding).
- **kyriba test copy 4/zamp-dashboard/**: Contains the Dashboard application.

## Troubleshooting

- **Module not found**: If you see errors about missing Python modules, ensure you have installed them using `pip install <module_name>`.
- **Playwright errors**: If the browser agent fails, make sure you have installed the Playwright browsers with `python3 -m playwright install chromium`.
- **Port Conflicts**: Ensure ports 8000 (Backend) and the frontend ports (usually 5173, 5174, etc.) are free.
