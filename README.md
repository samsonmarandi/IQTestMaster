# IQ Quiz Application

An interactive IQ quiz application that tests cognitive abilities and provides estimated IQ scores.

## Features

- Test your cognitive abilities across multiple domains:
  - Logical reasoning
  - Mathematical reasoning
  - Pattern recognition
- Real-time progress tracking with timer
- Detailed results with score breakdown by question type
- Estimated IQ score based on performance

## Prerequisites

- [Node.js](https://nodejs.org/) (version 20.x recommended)
- npm (comes with Node.js)

## Installation & Setup

### Option 1: Running on Replit

1. Fork this Replit project
2. Click the Run button

### Option 2: Running Locally

#### Step 1: Download the project

1. In Replit, click on the three dots (⋮) in the top-left corner of the file explorer
2. Select "Download as ZIP" to download all files
3. Extract the ZIP file to a location on your computer

#### Step 2: Install dependencies

Open your terminal/command prompt, navigate to the extracted project folder and run:

```bash
npm install
```

#### Step 3: Run the application

After installation completes, start the application:

```bash
npm run dev
```

The application will be accessible at:
```
http://localhost:5000
```

## Project Structure

- `client/`: Frontend React application
  - `src/components/`: UI components
  - `src/pages/`: Application pages
  - `src/hooks/`: Custom React hooks
  - `src/lib/`: Utility functions
- `server/`: Backend Express server
  - `routes.ts`: API endpoints
  - `storage.ts`: Data storage implementation
- `shared/`: Shared code between client and server
  - `schema.ts`: Data models and validation schemas

## How It Works

1. Enter your basic information on the welcome screen
2. Answer 30 questions across 3 cognitive domains (10 per domain)
3. View your results, including:
   - Overall IQ score estimation
   - Performance breakdown by question type
   - Percentile ranking

## Notes

- The application uses an in-memory database (no persistent storage)
- All quiz questions and user data are stored in memory while the application is running
- To make the app available to others on your local network, access it via your local IP address (e.g., http://192.168.x.x:5000)