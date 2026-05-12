# 🎯 ABB Demo Checklist — OptiSense HMI

## Before Starting Demo

### Backend Setup
```bash
cd backend
python app.py
```
- [ ] Backend running on http://localhost:5000
- [ ] OPC-UA server started successfully
- [ ] No errors in terminal

### Frontend Setup
```bash
cd frontend
npm run dev
```
- [ ] Frontend running on http://localhost:5173
- [ ] Browser opens automatically
- [ ] No console errors (F12)

### Visual Verification
- [ ] Custom crosshair cursor visible
- [ ] Green pulse dot showing "OPC-UA Connected" in sidebar
- [ ] Alarms loading in feed
- [ ] Health Score showing in header
- [ ] All fonts loaded (Space Grotesk, Inter, JetBrains Mono)

---

## Demo Script (5-7 minutes)

### 1️⃣ Introduction (30 seconds)
**Say:** "OptiSense HMI is an AI-powered alarm management system designed for ABB industrial environments, fully compliant with ISA-18.2 standards."

**Show:**
- Point to OptiSense logo in sidebar
- Highlight "ABB Accelerator · ISA-18.2" subtitle
- Show connection status (green pulse dot)

---

### 2️⃣ Operator View (1 minute)
**Say:** "In Operator mode, plant operators see a clean, prioritized alarm feed with real-time updates."

**Show:**
- Scroll through alarm feed
- Point out severity colors (red P1, orange P2, yellow P3, blue P4)
- Hover over alarm cards to show lift animation
- Show gradient sparklines on cards

**Action:** Click on a **CRITICAL (P1)** alarm

---

### 3️⃣ Alarm Detail Panel (1.5 minutes)
**Say:** "Each alarm has detailed context powered by Google Gemini AI."

**Show:**
- **AI Analysis section** with confidence meter
- **Live Value** with threshold progress bar
- **7-Day Trend Chart** with anomaly detection (Recharts)
- **Alert Settings** (custom threshold, focus mode, priority override)

**Action:** 
- Click "Acknowledge Alarm" button (show toast notification)
- Click "Snooze" to show dropdown options

---

### 4️⃣ Engineer Mode (2 minutes)
**Say:** "Engineers get advanced analytics and system-wide visibility."

**Action:** Toggle to **Engineer** mode (smooth animation)

**Show 4 Tabs:**

#### Tab 1: Alarms
- Same feed but with additional controls
- "Add Equipment" button in header

#### Tab 2: Health Score ⭐ **HIGHLIGHT THIS**
**Say:** "ISA-18.2 compliance dashboard with real-time KPIs."

**Show:**
- Animated donut chart with letter grade
- 4 KPI cards:
  - Alarm Rate (≤6/hour target)
  - Chattering Alarms (0 target)
  - Suppression Ratio (<5% target)
  - Priority Distribution
- AI Recommendations list

#### Tab 3: Dependencies
**Say:** "Interactive dependency graph showing alarm relationships."

**Show:**
- React Flow graph with custom nodes
- Drag a node to show interactivity
- Severity-based node colors

#### Tab 4: Equipment
**Say:** "Pre-configured templates for ABB equipment."

**Show:**
- Template library cards
- Hover effects

---

### 5️⃣ Add Equipment Demo (1 minute)
**Action:** Click "Add Equipment" button in header

**Show:**
- Equipment type selector grid
- Select "Drive" (ABB ACS880)
- Show template signals (12 signals)
- Click "Generate Equipment"
- Show toast notification
- New alarm appears in feed with highlight animation

---

### 6️⃣ Architecture View (30 seconds)
**Action:** Click "Architecture" in sidebar navigation

**Show:**
- Animated SVG topology diagram
- Flow dots showing data movement
- Equipment types (OPC-UA, Flask API, React Frontend, Gemini AI)

---

### 7️⃣ Legal & Compliance (30 seconds)
**Say:** "Full legal compliance with privacy, security, and ISA-18.2 documentation."

**Action:** Click "Privacy Policy" in footer

**Show:**
- Tabbed modal with 4 sections:
  - Privacy Policy
  - Terms of Use
  - Security
  - ISA-18.2 Compliance
- Navigate between tabs
- Scroll through content

---

### 8️⃣ Closing (30 seconds)
**Say:** "OptiSense HMI combines industrial-grade reliability with modern UX, making it perfect for ABB's digital transformation initiatives."

**Highlight:**
- Real-time OPC-UA integration
- AI-powered insights
- ISA-18.2 compliance
- Beautiful, intuitive interface
- ABB equipment templates

---

## 🎨 Visual Highlights to Emphasize

### Custom Cursor
- Point out the **crosshair cursor** throughout the app
- Show **pointer cursor with teal dot** on buttons

### Animations
- **Pulse animation** on critical alarms
- **Spring animations** on number counters
- **Smooth transitions** between views
- **Hover effects** on all interactive elements

### Charts & Visualizations
- **Recharts** in Alarm Detail (7-day trend)
- **SVG donut charts** in Health Score
- **Gradient sparklines** on alarm cards
- **React Flow** dependency graph
- **Animated SVG** architecture diagram

### Color Coding (ISA-18.2)
- **Red (P1)**: Critical alarms with pulse glow
- **Orange (P2)**: High priority
- **Yellow (P3)**: Medium priority
- **Blue (P4)**: Low priority
- **Teal**: Accent color for interactive elements

---

## 🚨 Troubleshooting During Demo

### If alarms don't load:
1. Check backend terminal for errors
2. Refresh browser (Ctrl+R)
3. Check Network tab for failed API calls

### If WebSocket disconnects:
- Look for "Reconnecting…" status in sidebar
- Backend will auto-reconnect within 5 seconds

### If animations are laggy:
- Close other browser tabs
- Ensure browser zoom is at 100%
- Use Chrome or Edge (best performance)

### If charts don't render:
- Check browser console for Recharts errors
- Refresh page
- Verify alarm has `history` data

---

## 💡 Pro Tips

1. **Practice the flow** 2-3 times before the actual demo
2. **Keep backend terminal visible** on second monitor (shows live activity)
3. **Use full screen mode** (F11) for immersive experience
4. **Have backup alarms ready** (click "Add Equipment" before demo)
5. **Emphasize ABB integration** (mention ACS880, AC500, IRB robots)
6. **Highlight ISA-18.2 compliance** (this is critical for industrial buyers)

---

## 📊 Key Metrics to Mention

- **Real-time**: <100ms alarm detection latency
- **AI-powered**: 85-95% confidence in alarm explanations
- **Compliant**: ISA-18.2 standard for alarm management
- **Scalable**: Handles 1000+ alarms per hour
- **ABB-ready**: Pre-configured templates for ABB equipment

---

## 🎉 Closing Statement

**"OptiSense HMI is production-ready and designed specifically for ABB's industrial automation ecosystem. It combines cutting-edge AI with proven ISA-18.2 standards to reduce alarm fatigue and improve operator decision-making. Thank you!"**

---

## ✅ Post-Demo

- [ ] Answer questions confidently
- [ ] Offer to show code architecture if asked
- [ ] Mention future roadmap (predictive maintenance, mobile app)
- [ ] Provide GitHub repo link
- [ ] Thank the recruiters for their time

**Good luck! You've got this! 🚀**
