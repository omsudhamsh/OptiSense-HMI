# OptiSense HMI

**OptiSense HMI**

![Python](https://img.shields.io/badge/Python-3.14-blue)
![React](https://img.shields.io/badge/React-19-61DAFB)
![ISA-18.2](https://img.shields.io/badge/ISA--18.2-Compliant-0A0E1A)
![ABB Accelerator 2026](https://img.shields.io/badge/ABB%20Accelerator-2026-FF0000)
![Top 1%](https://img.shields.io/badge/Top%201%25-Hackathon-00D4AA)

From alarm flood to alarm clarity. Built on ISA-18.2. Powered by AI. Ready for ABB.

## The Problem

- Operators face 200+ simultaneous alarms per shift, with no clear priority path.
- Alarm floods cause missed critical events and delayed response times.
- Legacy HMIs lack ISA-18.2 compliance and explainability.

## The Solution

- Real-time alarm feed ranked by ISA-18.2 priority and AI impact scoring.
- Live alarm health score (rate, chattering, suppression, priority balance).
- OPC-UA native integration for ABB-grade industrial data streams.
- AI explanations with confidence scoring for each alarm.
- Shift handover report that compresses critical context into a single view.

## Why This Is Different

- ISA-18.2 Alarm Health Score: ISA-18.2 is the global standard for alarm management; OptiSense measures and enforces compliance continuously.
- OPC-UA native protocol: the same industrial protocol used by ABB drives, PLCs, and SCADA systems.
- Consequence-based AI prioritization: ranks alarms by operational impact, not just thresholds.
- Shift Handover Report: instant summary of risk, unresolved alarms, and recommendations.
- Auto-generated screens from templates: rapid onboarding with consistent signal models.

## Tech Stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| Frontend | React, Vite | UI runtime and build pipeline |
| Frontend | Tailwind CSS, Framer Motion | Industrial design system and motion |
| Frontend | Recharts | Trend and KPI visualization |
| Frontend | React Flow, Dagre | Dependency graph visualization |
| Frontend | Socket.IO Client | Live alarm and health updates |
| Frontend | Lucide Icons, CLSX, date-fns | Iconography, class utils, time formatting |
| Backend | Flask, Flask-SocketIO, Flask-CORS | API and realtime transport |
| Backend | asyncua | OPC-UA server for industrial telemetry |
| Backend | pandas, numpy | ISA-18.2 scoring and analytics |
| Backend | google-generativeai | Gemini-based explanations |
| Backend | python-dotenv | Environment configuration |
| Backend | influxdb-client | Time-series logging (optional) |
| Backend | python-socketio, eventlet | SocketIO utilities and transport |

## Project Structure

```
optisense-hmi/
├── backend/
│   ├── app.py
│   ├── simulator/
│   │   ├── __init__.py
│   │   └── opc_ua_server.py
│   ├── engine/
│   │   ├── __init__.py
│   │   ├── isa_scoring.py
│   │   ├── ai_explainer.py
│   │   └── alarm_manager.py
│   ├── data/
│   │   └── mock_alarms.py
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── data/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
├── assets/
├── docs/
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js 20.19+ or 22.12+
- Python 3.14+

### Installation

Backend:

```
cd backend
py -m pip install -r requirements.txt
```

Frontend:

```
cd frontend
npm install
```

### Environment Setup

Copy the environment template and add your Gemini API key:

```
cd backend
copy .env.example .env
```

### Run

Terminal 1:

```
cd backend
py app.py
```

Terminal 2:

```
cd frontend
npm run dev
```

Open: http://localhost:5173

## Features

### ISA-18.2 Alarm Health Score
OptiSense continuously computes alarm rate, chattering alarms, suppression ratio, and priority distribution. The result is a real ISA-18.2 compliance grade with actionable recommendations.

### AI Alarm Explanation
Each alarm includes a 2-3 sentence technical explanation, impact statement, and immediate action plan. Gemini responses are backed by deterministic fallbacks.

### OPC-UA Native Integration
The backend exposes an OPC-UA server that mirrors live alarm values, matching the protocol used by ABB hardware and SCADA systems.

### Role-Based HMI
Operator mode prioritizes fast action and clarity, while Engineer mode exposes ISA KPIs, dependency graphs, and templates.

### Dependency Graph
React Flow visualizes data flow and physical dependencies across drives, PLCs, robots, and SCADA nodes, with severity-aware styling.

### Equipment Templates
Auto-generated templates configure monitoring points, thresholds, and alarms for rapid onboarding of new equipment.

### Shift Handover Report
One-click report summarizes critical events, unresolved alarms, recommendations, and health score for the next shift.

### Industrial-Grade UI
Industrial dark theme, ISA-compliant colors, animated alarm prioritization, and production-grade micro-interactions.

## Architecture

```
ABB Equipment → OPC-UA → Python Backend → ISA-18.2 Engine → Gemini AI → React HMI
```

## ABB Accelerator 2026

- Addresses the accelerator theme by translating alarm overload into prioritized action with ISA-18.2 compliance.
- Implements a measurable ISA-18.2 alarm health score for continuous improvement.
- Connects directly to real ABB hardware via OPC-UA, with production-ready swap-in endpoints.

## Team

- Research Lead
- QA Lead
- Dev A
- Dev B
- Systems Engineer

## License

MIT
