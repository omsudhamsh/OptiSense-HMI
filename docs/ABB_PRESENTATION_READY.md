# OptiSense HMI — ABB Presentation Ready ✅

## 🎯 Status: PRODUCTION READY

All UI/UX components have been redesigned to **impress ABB recruiters** with a premium industrial-grade interface.

---

## 🚀 Quick Start

### Frontend (Development)
```bash
cd frontend
npm run dev
```
Visit: http://localhost:5173

### Backend (OPC-UA + API)
```bash
cd backend
python app.py
```
API: http://localhost:5000

---

## ✨ Key Features for ABB Demo

### 1. **Premium Dark Industrial UI**
- Custom crosshair cursor throughout the app
- Glassmorphic cards with backdrop blur
- Smooth animations powered by Framer Motion
- ISA-18.2 compliant color coding (P1-P4 severity levels)

### 2. **Real-time Alarm Management**
- Live OPC-UA connection status indicator
- WebSocket-powered alarm feed with pulse animations
- AI-powered alarm explanations via Google Gemini
- Priority-based alarm sorting (ISA-18.2)

### 3. **Beautiful Data Visualizations**
- **Recharts** integration with custom tooltips
- 7-day trend charts with anomaly detection
- Animated SVG donut charts for health scores
- Gradient sparklines on alarm cards

### 4. **Engineer vs Operator Modes**
- Role toggle with smooth sliding animation
- Engineer mode: Full access to all tabs (Alarms, Health, Dependencies, Equipment)
- Operator mode: Simplified alarm feed view

### 5. **ISA-18.2 Compliance Dashboard**
- Real-time KPI tracking:
  - Alarm Rate (target: ≤6/hour)
  - Chattering Alarms (target: 0)
  - Suppression Ratio (target: <5%)
  - Priority Distribution (P1/P2/P3: 5%/15%/30%)
- Animated progress bars with spring physics
- AI-powered recommendations

### 6. **Interactive Architecture View**
- Animated SVG topology diagram
- Flow dots showing data movement
- Equipment type visualization

### 7. **Dependency Graph**
- React Flow powered interactive graph
- Custom styled nodes with severity indicators
- Drag-and-drop node positioning

### 8. **Legal & Compliance**
- **Privacy Policy** modal
- **Terms of Use** modal
- **Security** guidelines modal
- **ISA-18.2 Compliance** documentation
- Persistent footer links in sidebar and main content

---

## 🎨 Design System

### Color Palette
- **Base Surface**: `#080C18` (near-black with blue undertone)
- **Card Surface**: `#0D1424`
- **Elevated Surface**: `#121B2E`
- **Border**: `#1E2D45`
- **Accent (Teal)**: `#00D4AA` — primary interactive, success, AI
- **ISA P1 (Critical)**: `#FF2D2D` — red with pulse animation
- **ISA P2 (High)**: `#FF8C00` — orange
- **ISA P3 (Medium)**: `#FFD700` — yellow
- **ISA P4 (Low)**: `#3B82F6` — blue

### Typography
- **Display**: Space Grotesk — headings, brand, KPI numbers
- **Body**: Inter — all prose, labels, descriptions
- **Mono**: JetBrains Mono — values, thresholds, timestamps, IDs

### Button States
All buttons feature:
- `cursor: pointer` explicitly set
- Hover: background lightens + subtle scale(1.02) + box-shadow glow
- Active: scale(0.97) press-down feel
- Focus-visible: 2px teal outline offset 2px
- Smooth 160ms transitions

---

## 📊 Components Showcase

### Alarm Feed
- Real-time alarm cards with severity borders
- Gradient sparklines showing 7-day trends
- New alarm highlight animation (3-second fade)
- Acknowledge, Snooze, Escalate actions

### Alarm Detail Panel
- Slides in from right with spring animation
- AI Analysis section with confidence meter
- Live value display with threshold progress bar
- 7-Day trend chart (Recharts) with anomaly markers
- Alert Settings: custom threshold, focus mode, priority override
- Snooze dropdown with 4 preset durations

### Health Score Dashboard
- Animated SVG donut chart (96px diameter)
- Overall score with letter grade (A-F)
- 4 KPI cards with status indicators and progress bars
- AI Recommendations list with staggered animations

### Equipment Modal
- Equipment type selector grid (Drive, PLC, Robot, Sensor, Valve)
- Template signal configuration
- Smooth modal animations

### Shift Report
- Sectioned report with icons
- Print-friendly layout
- Operator notes and recommendations

### Policy Modals
- Tabbed navigation between Privacy, Terms, Security, ISA-18.2
- Scrollable content with section headings
- Last updated timestamps

---

## 🔧 Technical Stack

### Frontend
- **React 19** with hooks
- **Vite 8** for blazing fast builds
- **Framer Motion 12** for animations
- **Recharts 3** for data visualization
- **React Flow 12** for dependency graphs
- **Lucide React** for icons
- **Socket.IO Client** for WebSocket
- **Tailwind CSS 4** (minimal usage, mostly inline styles)

### Backend
- **Flask** with Flask-CORS and Flask-SocketIO
- **OPC-UA** server simulator (asyncua)
- **Google Gemini AI** for alarm explanations
- **ISA-18.2** scoring engine

---

## 📁 File Structure

```
frontend/src/
├── App.jsx                          # Main app shell with sidebar, header, footer
├── styles/
│   ├── tokens.js                    # Design system tokens (colors, buttons)
│   ├── globals.css                  # Custom cursor, animations, reset
│   └── index.css                    # Empty (cleared to avoid conflicts)
├── components/
│   ├── AlarmCard/                   # Individual alarm card with sparkline
│   ├── AlarmFeed/                   # Alarm list with stats bar
│   ├── AlarmDetail/                 # Detail panel with charts and AI
│   ├── HealthScore/                 # ISA-18.2 KPI dashboard
│   ├── RoleToggle/                  # Engineer/Operator mode switch
│   ├── EquipmentModal/              # Add equipment dialog
│   ├── PolicyModal/                 # Legal/compliance content
│   ├── ShiftReport/                 # Shift handover report
│   ├── TemplateLibrary/             # Equipment templates
│   ├── ArchitectureView/            # System topology diagram
│   ├── DependencyGraph/             # React Flow graph
│   └── TrendChart/                  # Reusable Recharts wrapper
├── hooks/
│   ├── useLiveData.js               # WebSocket + API integration
│   ├── useRole.js                   # Role state management
│   └── useSocket.js                 # Socket.IO connection
└── data/
    ├── alarms.js                    # Mock alarm data
    └── templates.js                 # Equipment templates

backend/
├── app.py                           # Flask API + WebSocket server
├── engine/
│   ├── alarm_manager.py             # Alarm CRUD operations
│   ├── ai_explainer.py              # Gemini AI integration
│   └── isa_scoring.py               # ISA-18.2 KPI calculations
├── simulator/
│   └── opc_ua_server.py             # OPC-UA server simulator
└── data/
    └── mock_alarms.py               # Initial alarm dataset
```

---

## 🎬 Demo Flow for ABB Recruiters

### 1. **Landing View (Operator Mode)**
- Show clean alarm feed with live connection status
- Highlight custom cursor and smooth animations
- Click on a P1 critical alarm to show detail panel

### 2. **Alarm Detail Panel**
- Point out AI Analysis section with confidence meter
- Show 7-day trend chart with anomaly detection
- Demonstrate Acknowledge, Snooze, Escalate actions

### 3. **Switch to Engineer Mode**
- Toggle role switch (smooth animation)
- Show 4 tabs: Alarms, Health Score, Dependencies, Equipment

### 4. **Health Score Dashboard**
- Highlight animated donut chart with letter grade
- Show 4 ISA-18.2 KPI cards with progress bars
- Point out AI Recommendations

### 5. **Dependencies Graph**
- Show interactive React Flow graph
- Drag nodes to demonstrate interactivity
- Highlight severity-based node styling

### 6. **Architecture View**
- Show animated SVG topology
- Point out flow dots showing data movement

### 7. **Add Equipment**
- Click "Add Equipment" button
- Select equipment type (e.g., Drive)
- Show template signal configuration

### 8. **Legal Compliance**
- Click Privacy Policy in footer
- Show tabbed navigation between all 4 policies
- Highlight ISA-18.2 Compliance section

---

## ✅ Pre-Demo Checklist

- [ ] Backend running on `localhost:5000`
- [ ] Frontend running on `localhost:5173`
- [ ] OPC-UA server connected (green pulse dot in sidebar)
- [ ] At least 5-10 alarms visible in feed
- [ ] Mix of P1, P2, P3, P4 alarms for visual variety
- [ ] Health Score showing realistic KPIs
- [ ] Browser zoom at 100% for optimal display
- [ ] Full screen mode (F11) for immersive demo

---

## 🐛 Known Issues (None!)

All critical issues have been resolved:
- ✅ CSS conflicts fixed (index.css cleared)
- ✅ Tailwind v4 compatibility ensured
- ✅ All components use inline styles
- ✅ Custom cursor working throughout
- ✅ Animations smooth and performant
- ✅ Charts rendering correctly
- ✅ Build completes successfully

---

## 🚀 Deployment Notes

### Production Build
```bash
cd frontend
npm run build
```
Output: `frontend/dist/` (ready for static hosting)

### Environment Variables
Create `backend/.env`:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
FLASK_ENV=production
```

---

## 📞 Support

For any issues during the ABB presentation:
1. Check browser console for errors
2. Verify backend is running (`curl http://localhost:5000/api/alarms`)
3. Check WebSocket connection in Network tab
4. Restart both frontend and backend if needed

---

## 🎉 Good Luck with ABB!

This UI is designed to **WOW** the recruiters. The combination of:
- Industrial-grade dark theme
- Premium animations
- Real-time data visualization
- ISA-18.2 compliance
- AI-powered insights

...makes OptiSense HMI a **standout project** for the ABB Accelerator program.

**You've got this!** 🚀
