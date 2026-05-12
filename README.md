# OptiSense HMI

<div align="center">

![OptiSense HMI](https://img.shields.io/badge/OptiSense-HMI-00D4AA?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![ISA-18.2](https://img.shields.io/badge/ISA--18.2-Compliant-0A0E1A?style=for-the-badge)
![ABB](https://img.shields.io/badge/ABB%20Accelerator-2026-FF0000?style=for-the-badge)

**From alarm flood to alarm clarity. Built on ISA-18.2. Powered by AI. Ready for ABB.**

[Features](#-features) • [Quick Start](#-quick-start) • [Installation](#-installation) • [Documentation](#-documentation) • [Demo](#-demo)

</div>

---

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Why This Is Different](#-why-this-is-different)
- [Features](#-features)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
  - [Environment Configuration](#environment-configuration)
- [Running the Application](#-running-the-application)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Demo](#-demo)
- [Documentation](#-documentation)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🚨 The Problem

## 🚨 The Problem

Industrial operators face critical challenges in alarm management:

- **Alarm Floods:** 200+ simultaneous alarms per shift with no clear priority path
- **Missed Critical Events:** Important alarms buried in noise, causing delayed response times
- **Legacy Systems:** Outdated HMIs lack ISA-18.2 compliance and explainability
- **No Context:** Operators don't know *why* an alarm matters or *what* to do next

---

## ✅ The Solution

OptiSense HMI transforms alarm chaos into actionable intelligence:

- **Real-time Alarm Feed:** Ranked by ISA-18.2 priority and AI impact scoring
- **Live Health Score:** Continuous monitoring of alarm rate, chattering, suppression, and priority balance
- **OPC-UA Integration:** Native support for ABB-grade industrial data streams
- **AI Explanations:** Context-aware explanations with confidence scoring for each alarm
- **Shift Handover Report:** Compress critical context into a single, actionable view

---

## 🌟 Why This Is Different

## 🌟 Why This Is Different

| Feature | OptiSense HMI | Traditional HMI |
|---------|---------------|-----------------|
| **ISA-18.2 Compliance** | ✅ Continuous health scoring with A-F grade | ❌ Manual compliance checks |
| **AI-Powered Insights** | ✅ Gemini-based explanations with confidence | ❌ Static alarm descriptions |
| **OPC-UA Native** | ✅ Direct ABB hardware integration | ⚠️ Proprietary protocols |
| **Priority Scoring** | ✅ Consequence-based AI ranking | ❌ Simple threshold-based |
| **Shift Handover** | ✅ Auto-generated reports | ❌ Manual documentation |
| **Equipment Templates** | ✅ Rapid onboarding with ABB presets | ❌ Manual configuration |
| **Modern UI/UX** | ✅ Industrial-grade dark theme, animations | ❌ Legacy interfaces |

---

## 🎯 Features

### 🏥 ISA-18.2 Alarm Health Score
Continuous compliance monitoring with real-time KPIs:
- **Alarm Rate:** Target ≤6 alarms/hour
- **Chattering Alarms:** Target 0 repeated alarms
- **Suppression Ratio:** Target <5% snoozed alarms
- **Priority Distribution:** P1/P2/P3 at 5%/15%/30%

**Result:** A-F grade with actionable recommendations for improvement.

### 🤖 AI Alarm Explanation
Each alarm includes:
1. **Technical Analysis:** What is happening (2-3 sentences)
2. **Impact Statement:** Why it matters and potential consequences
3. **Action Plan:** Immediate recommended steps
4. **Confidence Score:** 0-100% AI confidence rating

Powered by **Google Gemini 1.5 Flash** with deterministic fallbacks.

### 🔌 OPC-UA Native Integration
- **Protocol:** OPC-UA (same as ABB drives, PLCs, SCADA)
- **Server:** Built-in OPC-UA server at `opc.tcp://localhost:4840`
- **Real-time Updates:** 4-second refresh cycle
- **ABB Ready:** Drop-in replacement for production endpoints

### 👥 Role-Based HMI
**Operator Mode:**
- Simplified alarm feed
- Quick acknowledge/snooze/escalate actions
- Focus on immediate response

**Engineer Mode:**
- ISA-18.2 health dashboard
- Dependency graph visualization
- Equipment template library
- Advanced analytics

### 🕸️ Dependency Graph
Interactive visualization powered by **React Flow**:
- Equipment relationships and data flow
- Severity-aware node styling
- Drag-and-drop repositioning
- Zoom and pan controls

### 📋 Equipment Templates
Pre-configured templates for ABB equipment:
- **ACS880 Drives:** 12 monitoring signals
- **AC500 PLCs:** 8 diagnostic signals
- **IRB Robots:** 10 joint/torque signals
- **Temperature Sensors:** 4 threshold signals
- **Control Valves:** 6 position/pressure signals

### 📊 Shift Handover Report
One-click report generation:
- Critical events summary
- Unresolved alarms list
- AI-generated recommendations
- Health score snapshot
- Timestamp and operator ID

### 🎨 Industrial-Grade UI
- **Dark Theme:** Optimized for control room environments
- **ISA Colors:** P1 (red), P2 (orange), P3 (yellow), P4 (blue)
- **Custom Cursor:** Industrial crosshair design
- **Smooth Animations:** 60 FPS with Framer Motion
- **Glassmorphism:** Backdrop blur effects
- **Accessibility:** WCAG compliant with focus states

---

## ⚡ Quick Start

**Get OptiSense HMI running in 2 minutes:**

### 1️⃣ Start Backend
```bash
cd backend
pip install -r requirements.txt
python app.py
```

### 2️⃣ Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3️⃣ Open Browser
Navigate to: **http://localhost:5173**

✅ You should see 8 alarms with a green "OPC-UA Connected" status.

---

## 📦 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download Link |
|----------|---------|---------------|
| **Python** | 3.8 or higher | [python.org/downloads](https://www.python.org/downloads/) |
| **Node.js** | 18.0 or higher | [nodejs.org](https://nodejs.org/) |
| **npm** | 9.0 or higher | Included with Node.js |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

**Verify installations:**
```bash
python --version   # Should show Python 3.8+
node --version     # Should show v18.0+
npm --version      # Should show 9.0+
```

---

### Backend Setup

#### Step 1: Navigate to Backend Directory
```bash
cd backend
```

#### Step 2: Create Virtual Environment (Recommended)
**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

#### Step 3: Install Python Dependencies
```bash
pip install -r requirements.txt
```

**Expected output:**
```
Successfully installed flask-3.1.0 flask-socketio-5.5.1 ...
```

#### Step 4: Verify Installation
```bash
python -c "import flask; print('Flask installed:', flask.__version__)"
```

**Troubleshooting:**
- If `python` command not found, try `python3` or `py`
- If permission errors, run as administrator or use virtual environment
- If package conflicts, use: `pip install -r requirements.txt --force-reinstall`

---

### Frontend Setup

#### Step 1: Navigate to Frontend Directory
```bash
cd frontend
```

#### Step 2: Install Node Dependencies
```bash
npm install
```

**Expected output:**
```
added 1234 packages in 30s
```

#### Step 3: Verify Installation
```bash
npm list react
```

**Should show:** `react@19.2.6`

**Troubleshooting:**
- If `npm` command not found, reinstall Node.js
- If permission errors on Windows, run terminal as administrator
- If package conflicts, delete `node_modules` and `package-lock.json`, then run `npm install` again
- If slow installation, try: `npm install --legacy-peer-deps`

---

### Environment Configuration

#### Step 1: Create .env File (Optional)
```bash
cd backend
copy .env.example .env    # Windows
# OR
cp .env.example .env      # macOS/Linux
```

#### Step 2: Add Gemini API Key (Optional)
Edit `.env` file:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

**Get API Key:**
1. Visit: [ai.google.dev](https://ai.google.dev/)
2. Sign in with Google account
3. Create new API key
4. Copy and paste into `.env`

**Note:** If you don't add an API key, OptiSense will use pre-written fallback explanations automatically. The app works perfectly without Gemini!

---

## 🚀 Running the Application

### Method 1: Two Terminals (Recommended)

**Terminal 1 — Backend:**
```bash
cd backend
python app.py
```

**Expected output:**
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
OPC-UA server started at opc.tcp://0.0.0.0:4840/freeopcua/server/
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

**Expected output:**
```
VITE v8.0.12  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Method 2: One-Line Start (Advanced)

**Windows (PowerShell):**
```powershell
Start-Process -NoNewWindow python -ArgumentList "backend/app.py"; cd frontend; npm run dev
```

**macOS/Linux:**
```bash
cd backend && python app.py & cd ../frontend && npm run dev
```

---

### Verify Everything Works

#### ✅ Backend Health Check
Open new terminal:
```bash
curl http://localhost:5000/api/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2026-05-12T10:30:00Z",
  "alarm_count": 8,
  "websocket_connected": true
}
```

#### ✅ Frontend Check
1. Open browser: **http://localhost:5173**
2. Check for green pulse dot: "OPC-UA Connected"
3. Verify 8 alarm cards visible
4. Open browser console (F12) — should have no errors

---

## 🛠️ Tech Stack

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.6 | UI framework |
| **Vite** | 8.0.12 | Build tool and dev server |
| **Tailwind CSS** | 4.3.0 | Utility-first styling |
| **Framer Motion** | 12.38.0 | Animation library |
| **Recharts** | 3.8.1 | Chart visualization |
| **React Flow** | 12.10.2 | Dependency graph |
| **Socket.IO Client** | 4.8.3 | WebSocket connection |
| **Lucide React** | 1.14.0 | Icon library |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Flask** | 3.1.0 | Web framework |
| **Flask-SocketIO** | 5.5.1 | WebSocket server |
| **Flask-CORS** | 5.0.1 | Cross-origin support |
| **asyncua** | 1.1.5 | OPC-UA server |
| **Pandas** | 2.0+ | Data analysis |
| **NumPy** | 1.24+ | Numerical computing |
| **Google Generative AI** | 0.8.5 | Gemini integration |
| **python-dotenv** | 1.0.1 | Environment variables |

---

## 📁 Project Structure

## 📁 Project Structure

```
OptiSense-HMI/
│
├── backend/                      # Python Flask backend
│   ├── app.py                   # Main Flask application
│   ├── requirements.txt         # Python dependencies
│   ├── .env.example            # Environment template
│   │
│   ├── simulator/              # OPC-UA server
│   │   ├── __init__.py
│   │   └── opc_ua_server.py   # OPC-UA server implementation
│   │
│   ├── engine/                 # Core business logic
│   │   ├── __init__.py
│   │   ├── alarm_manager.py   # Alarm CRUD operations
│   │   ├── isa_scoring.py     # ISA-18.2 health scoring
│   │   └── ai_explainer.py    # Gemini AI integration
│   │
│   └── data/                   # Mock data
│       └── mock_alarms.py     # Initial alarm dataset
│
├── frontend/                    # React frontend
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   ├── main.jsx           # React entry point
│   │   ├── ErrorBoundary.jsx  # Error handling
│   │   │
│   │   ├── components/        # React components
│   │   │   ├── AlarmCard/
│   │   │   ├── AlarmFeed/
│   │   │   ├── AlarmDetail/
│   │   │   ├── HealthScore/
│   │   │   ├── RoleToggle/
│   │   │   ├── EquipmentModal/
│   │   │   ├── PolicyModal/
│   │   │   ├── ShiftReport/
│   │   │   ├── TemplateLibrary/
│   │   │   ├── ArchitectureView/
│   │   │   ├── DependencyGraph/
│   │   │   └── TrendChart/
│   │   │
│   │   ├── hooks/             # Custom React hooks
│   │   │   ├── useLiveData.js
│   │   │   ├── useSocket.js
│   │   │   └── useRole.js
│   │   │
│   │   ├── styles/            # Styling
│   │   │   ├── globals.css    # Global styles
│   │   │   ├── tokens.js      # Design tokens
│   │   │   └── index.css      # Entry styles
│   │   │
│   │   └── data/              # Static data
│   │       ├── alarms.js
│   │       └── templates.js
│   │
│   ├── public/                # Static assets
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── package.json           # Node dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   └── eslint.config.js       # ESLint configuration
│
├── docs/                       # Technical documentation
│   ├── ABB_PRESENTATION_READY.md
│   └── (other technical docs)
│
├── qa-docs/                    # QA & Testing documentation
│   ├── README.md              # QA docs index
│   ├── DEMO_CHECKLIST.md      # Demo script (5-7 min)
│   ├── QA_FINAL_SUMMARY.md    # Executive QA summary
│   ├── QA_TEST_REPORT.md      # Comprehensive QA results
│   ├── TEST_SCRIPT.md         # Manual test cases
│   └── README_UPDATE_SUMMARY.md
│
├── .github/                    # GitHub configuration
│   └── copilot-instructions.md
│
├── README.md                   # This file
├── QUICK_START.md             # 2-minute setup guide
├── LICENSE                     # MIT License
└── .gitignore                 # Git ignore rules
```

---

## 🏗️ Architecture

## 🏗️ Architecture

### System Overview

```
┌─────────────────┐
│  ABB Equipment  │  (Drives, PLCs, Robots, Sensors)
└────────┬────────┘
         │ OPC-UA Protocol
         ▼
┌─────────────────┐
│  OPC-UA Server  │  (asyncua - Port 4840)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Python Backend  │  (Flask + SocketIO - Port 5000)
│                 │
│ ┌─────────────┐ │
│ │ Alarm Mgr   │ │  • CRUD operations
│ └─────────────┘ │  • Live value updates
│                 │
│ ┌─────────────┐ │
│ │ ISA Scoring │ │  • Health score calculation
│ └─────────────┘ │  • KPI monitoring
│                 │
│ ┌─────────────┐ │
│ │ AI Explainer│ │  • Gemini integration
│ └─────────────┘ │  • Fallback explanations
└────────┬────────┘
         │ WebSocket (Socket.IO)
         │ REST API
         ▼
┌─────────────────┐
│ React Frontend  │  (Vite + React 19 - Port 5173)
│                 │
│ ┌─────────────┐ │
│ │  Alarm Feed │ │  • Real-time updates
│ └─────────────┘ │  • Priority sorting
│                 │
│ ┌─────────────┐ │
│ │ Health Score│ │  • ISA-18.2 dashboard
│ └─────────────┘ │  • KPI visualization
│                 │
│ ┌─────────────┐ │
│ │ Dep. Graph  │ │  • React Flow
│ └─────────────┘ │  • Interactive nodes
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Operator UI   │  (Browser - Chrome/Edge)
└─────────────────┘
```

### Data Flow

1. **Equipment → OPC-UA Server:** Real-time sensor data via OPC-UA protocol
2. **OPC-UA → Backend:** Python backend reads values every 4 seconds
3. **Backend Processing:**
   - Alarm Manager updates live values
   - ISA Scoring calculates health metrics
   - AI Explainer generates explanations
4. **Backend → Frontend:** WebSocket emits `alarm_update` and `health_update` events
5. **Frontend Rendering:** React components update in real-time

### API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/api/health` | Backend health check |
| GET | `/api/alarms` | Get all alarms |
| GET | `/api/health-score` | Get ISA-18.2 health score |
| POST | `/api/alarms/:id/acknowledge` | Acknowledge alarm |
| POST | `/api/alarms/:id/snooze` | Snooze alarm |
| POST | `/api/alarms/:id/escalate` | Escalate to critical |
| POST | `/api/alarms/:id/explain` | Get AI explanation |
| POST | `/api/equipment` | Add new equipment |
| GET | `/api/shift-report` | Generate shift report |
| GET | `/api/templates` | Get equipment templates |

### WebSocket Events

| Event | Direction | Payload | Frequency |
|-------|-----------|---------|-----------|
| `connect` | Client → Server | None | On connection |
| `alarm_update` | Server → Client | Array of alarms | Every 4 seconds |
| `health_update` | Server → Client | Health score object | Every 4 seconds |

---

## 🎬 Demo

### 5-Minute Demo Flow

1. **Show Alarm Feed** (Operator view)
   - 8 alarms with severity colors
   - Real-time updates with pulse animations

2. **Click Critical Alarm**
   - AI analysis with confidence meter
   - 7-day trend chart (Recharts)
   - Live value vs threshold

3. **Toggle to Engineer Mode**
   - 4 tabs: Alarms, Health Score, Dependencies, Equipment

4. **Show Health Score Dashboard** ⭐
   - Overall score with letter grade
   - 4 ISA-18.2 KPI cards
   - AI recommendations

5. **Add Equipment**
   - Select Drive (ACS880)
   - Generate new alarm
   - Toast notification

6. **Show Architecture View**
   - Animated SVG topology
   - Flow dots showing data movement

7. **Open Privacy Policy**
   - Legal compliance documentation
   - ISA-18.2 compliance section

### Keyboard Shortcuts

- `Escape` — Close detail panel / modal
- `E` — Toggle Engineer mode
- `A` — Acknowledge selected alarm

---

## 📚 Documentation

### Main Documentation
| Document | Purpose |
|----------|---------|
| **README.md** | This file - complete project documentation |
| **QUICK_START.md** | 2-minute setup guide |
| **docs/ABB_PRESENTATION_READY.md** | Technical overview for ABB presentation |

### QA & Testing Documentation
All QA and testing resources are in the **`qa-docs/`** folder:

| Document | Purpose |
|----------|---------|
| **qa-docs/DEMO_CHECKLIST.md** | Step-by-step demo script (5-7 minutes) |
| **qa-docs/QA_FINAL_SUMMARY.md** | Executive QA summary (98/100 score) |
| **qa-docs/QA_TEST_REPORT.md** | Comprehensive QA results and test coverage |
| **qa-docs/TEST_SCRIPT.md** | Manual test cases (50+ scenarios, 15 minutes) |
| **qa-docs/README_UPDATE_SUMMARY.md** | Documentation of README updates |

📁 **See [qa-docs/README.md](qa-docs/README.md) for complete QA documentation index**

---

## 🐛 Troubleshooting

### Backend Issues

#### Problem: `python` command not found
**Solution:**
```bash
# Try these alternatives:
python3 app.py
py app.py
C:\Python311\python.exe app.py  # Windows with full path
```

#### Problem: `ModuleNotFoundError: No module named 'flask'`
**Solution:**
```bash
pip install -r requirements.txt --force-reinstall
```

#### Problem: Port 5000 already in use
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (Windows - replace PID)
taskkill /PID <PID> /F

# Or change port in app.py
socketio.run(app, port=5001)
```

#### Problem: Permission denied
**Solution:**
```bash
# Use virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

---

### Frontend Issues

#### Problem: `npm` command not found
**Solution:**
- Reinstall Node.js from [nodejs.org](https://nodejs.org/)
- Restart terminal after installation

#### Problem: `EACCES` permission errors
**Solution:**
```bash
# Windows: Run terminal as administrator
# macOS/Linux: Fix npm permissions
sudo chown -R $USER /usr/local/lib/node_modules
```

#### Problem: Build fails with dependency conflicts
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s /q node_modules & del package-lock.json  # Windows
npm install --legacy-peer-deps
```

#### Problem: WebSocket won't connect
**Solution:**
1. Verify backend is running: `curl http://localhost:5000/api/health`
2. Check CORS settings in `backend/app.py`
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try incognito mode
5. Check browser console (F12) for errors

---

### Common Issues

#### Problem: Alarms don't load
**Solution:**
```bash
# Test backend API
curl http://localhost:5000/api/alarms

# Check backend terminal for errors
# Restart both backend and frontend
```

#### Problem: Charts don't render
**Solution:**
```bash
# Verify Recharts is installed
npm list recharts

# Reinstall if needed
npm install recharts@3.8.1
```

#### Problem: Animations are laggy
**Solution:**
- Close other browser tabs
- Ensure browser zoom is at 100%
- Use Chrome or Edge (best performance)
- Check CPU usage in Task Manager

---

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
   ```bash
   # Backend tests
   cd backend
   python -m pytest

   # Frontend tests
   cd frontend
   npm run lint
   npm run build
   ```
5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- **Python:** Follow PEP 8
- **JavaScript:** Follow Airbnb style guide
- **Commits:** Use conventional commits (feat, fix, docs, style, refactor, test, chore)

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🏆 ABB Accelerator 2026

OptiSense HMI was built for the **ABB Accelerator 2026** program:

- ✅ Addresses alarm overload with ISA-18.2 compliance
- ✅ Implements measurable health scoring for continuous improvement
- ✅ Connects directly to ABB hardware via OPC-UA
- ✅ Production-ready with swap-in endpoints

---

## 👥 Team

- **Research Lead** — ISA-18.2 compliance and alarm management research
- **QA Lead** — Quality assurance and testing
- **Dev A** — Backend development (Flask, OPC-UA, AI)
- **Dev B** — Frontend development (React, UI/UX)
- **Systems Engineer** — Architecture and deployment

---

## 🌐 Links

- **Documentation:** [docs/](docs/)
- **Issues:** [GitHub Issues](https://github.com/yourusername/OptiSense-HMI/issues)
- **Discussions:** [GitHub Discussions](https://github.com/yourusername/OptiSense-HMI/discussions)

---

## 📞 Support

Need help? Here's how to get support:

1. **Check Documentation:** Start with [QUICK_START.md](QUICK_START.md)
2. **Search Issues:** Look for similar problems in GitHub Issues
3. **Ask Questions:** Open a new issue with the `question` label
4. **Emergency:** Check [QA_TEST_REPORT.md](QA_TEST_REPORT.md) Part H for troubleshooting

---

<div align="center">

**Built with ❤️ for ABB Accelerator 2026**

⭐ Star this repo if you find it useful!

[Report Bug](https://github.com/yourusername/OptiSense-HMI/issues) • [Request Feature](https://github.com/yourusername/OptiSense-HMI/issues) • [Documentation](docs/)

</div>
