# 🧪 OptiSense HMI — Manual Test Script

**Purpose:** Verify all features work correctly before ABB demo  
**Duration:** 15 minutes  
**Tester:** _______________  
**Date:** _______________

---

## Pre-Test Setup

### Step 1: Start Backend
```bash
cd backend
python app.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:5000
OPC-UA server started at opc.tcp://0.0.0.0:4840/freeopcua/server/
```

- [ ] Backend starts without errors
- [ ] Port 5000 is listening
- [ ] OPC-UA server URL printed

---

### Step 2: Start Frontend
```bash
cd frontend
npm run dev
```

**Expected Output:**
```
VITE v8.0.12  ready in XXX ms

➜  Local:   http://localhost:5173/
```

- [ ] Frontend starts without errors
- [ ] Browser opens automatically
- [ ] Page loads within 2 seconds

---

## Test Suite A: Initial Load & Connection

### Test A1: Page Load
**Action:** Open http://localhost:5173

**Verify:**
- [ ] Custom crosshair cursor visible
- [ ] No console errors (F12)
- [ ] All fonts loaded (Space Grotesk, Inter, JetBrains Mono)
- [ ] Background has subtle noise texture
- [ ] Sidebar renders with OptiSense logo

**Pass/Fail:** _______________

---

### Test A2: WebSocket Connection
**Action:** Wait 3 seconds after page load

**Verify:**
- [ ] Connection status shows "OPC-UA Connected"
- [ ] Green pulse dot animating in sidebar
- [ ] Alarms load in feed (should see 8 cards)
- [ ] Health Score shows in header

**Pass/Fail:** _______________

---

### Test A3: Alarm Cards Rendering
**Action:** Scroll through alarm feed

**Verify:**
- [ ] All 8 alarm cards visible
- [ ] Severity colors correct:
  - [ ] Red border for CRITICAL (P1)
  - [ ] Orange border for HIGH (P2)
  - [ ] Yellow border for MEDIUM (P3)
  - [ ] Blue border for LOW (P4)
- [ ] Gradient sparklines visible on each card
- [ ] Hover effect works (card lifts up)
- [ ] Cursor changes to pointer on hover

**Pass/Fail:** _______________

---

## Test Suite B: Alarm Detail Panel

### Test B1: Open Detail Panel
**Action:** Click on first CRITICAL alarm (red border)

**Verify:**
- [ ] Panel slides in from right with smooth animation
- [ ] Severity badge shows "CRITICAL"
- [ ] Priority badge shows "P1"
- [ ] Equipment name and fault description visible
- [ ] Close button (X) visible in top-right

**Pass/Fail:** _______________

---

### Test B2: AI Analysis Section
**Action:** Wait for AI explanation to load

**Verify:**
- [ ] Loading skeleton shows initially (3 gray bars)
- [ ] Explanation text appears after 1-2 seconds
- [ ] Confidence meter shows percentage (e.g., "87% confidence")
- [ ] Progress bar animates to correct width
- [ ] Text is readable (2-3 sentences)

**Pass/Fail:** _______________

---

### Test B3: Live Value Display
**Action:** Observe live value section

**Verify:**
- [ ] Large numeric value visible (e.g., "87.3")
- [ ] Unit label visible (e.g., "°C")
- [ ] Value color matches severity (red for CRITICAL)
- [ ] Progress bar shows value vs threshold
- [ ] Threshold label visible below bar

**Pass/Fail:** _______________

---

### Test B4: 7-Day Trend Chart
**Action:** Observe trend chart (Recharts)

**Verify:**
- [ ] Chart renders with 7 data points (D1-D7)
- [ ] Teal line animates from left to right
- [ ] X-axis labels visible (D1, D2, D3, etc.)
- [ ] Y-axis labels visible (numeric values)
- [ ] Threshold line visible (dashed, colored by severity)
- [ ] Anomaly dot visible on D6 (if applicable)
- [ ] Hover tooltip works (shows value and day)

**Pass/Fail:** _______________

---

### Test B5: Alert Settings
**Action:** Scroll to Alert Settings section

**Verify:**
- [ ] Custom threshold slider visible
- [ ] Focus Mode toggle switch visible
- [ ] Priority override buttons visible (Trust AI, Always First, Suppress)
- [ ] Toggle switch animates smoothly
- [ ] Selected override button highlights in teal

**Pass/Fail:** _______________

---

### Test B6: Action Buttons
**Action:** Test all action buttons

**Verify:**
- [ ] "Acknowledge Alarm" button:
  - [ ] Hover effect (teal glow)
  - [ ] Click shows toast notification
  - [ ] Toast says "Alarm acknowledged."
- [ ] "Snooze" button:
  - [ ] Hover effect
  - [ ] Click opens dropdown with 4 options
  - [ ] Select "15 minutes" shows toast
- [ ] "Escalate" button:
  - [ ] Hover effect (orange glow)
  - [ ] Click shows toast "Alarm escalated to critical."

**Pass/Fail:** _______________

---

### Test B7: Close Panel
**Action:** Click X button or press Escape key

**Verify:**
- [ ] Panel slides out to right
- [ ] Main view visible again
- [ ] No errors in console

**Pass/Fail:** _______________

---

## Test Suite C: Role Toggle & Engineer Mode

### Test C1: Toggle to Engineer Mode
**Action:** Click role toggle in sidebar (Operator → Engineer)

**Verify:**
- [ ] Toggle animates smoothly (sliding pill)
- [ ] 4 tabs appear: Alarms, Health Score, Dependencies, Equipment
- [ ] "Add Equipment" button appears in header
- [ ] "Shift Report" button appears in header

**Pass/Fail:** _______________

---

### Test C2: Health Score Tab
**Action:** Click "Health Score" tab

**Verify:**
- [ ] Overall score animates from 0 to actual value (e.g., 85)
- [ ] Large donut chart visible (96px diameter)
- [ ] Letter grade visible in center (e.g., "B")
- [ ] 4 KPI cards visible:
  - [ ] Alarm Rate / hr
  - [ ] Chattering Alarms
  - [ ] Suppression Ratio
  - [ ] P1 / P2 / P3 Ratio
- [ ] Each KPI card has:
  - [ ] Status badge (ok/warning/critical)
  - [ ] Numeric value
  - [ ] Target label
  - [ ] Animated progress bar
- [ ] AI Recommendations section visible (if any)

**Pass/Fail:** _______________

---

### Test C3: Dependencies Tab
**Action:** Click "Dependencies" tab

**Verify:**
- [ ] React Flow graph renders
- [ ] 8 nodes visible (one per alarm)
- [ ] Connecting edges visible
- [ ] Nodes colored by severity
- [ ] Can drag nodes to reposition
- [ ] Zoom controls work (mouse wheel)

**Pass/Fail:** _______________

---

### Test C4: Equipment Tab
**Action:** Click "Equipment" tab

**Verify:**
- [ ] Template library cards visible
- [ ] At least 5 templates shown (Drive, PLC, Robot, Sensor, Valve)
- [ ] Each card has:
  - [ ] Equipment icon
  - [ ] Name and description
  - [ ] Signal count
- [ ] Hover effect works (card lifts)

**Pass/Fail:** _______________

---

### Test C5: Toggle Back to Operator
**Action:** Click role toggle (Engineer → Operator)

**Verify:**
- [ ] Tabs disappear
- [ ] Only alarm feed visible
- [ ] "Add Equipment" button hidden
- [ ] Smooth animation

**Pass/Fail:** _______________

---

## Test Suite D: Add Equipment Modal

### Test D1: Open Modal
**Action:** Switch to Engineer mode, click "Add Equipment"

**Verify:**
- [ ] Modal opens with backdrop blur
- [ ] Equipment type selector grid visible
- [ ] 5 equipment types shown:
  - [ ] Drive (ACS880)
  - [ ] PLC (AC500)
  - [ ] Robot (IRB 6700)
  - [ ] Sensor (Temperature)
  - [ ] Valve (Control Valve)
- [ ] Each type has icon and label

**Pass/Fail:** _______________

---

### Test D2: Select Equipment Type
**Action:** Click "Drive" equipment type

**Verify:**
- [ ] Selected type highlights with teal border
- [ ] Template signals count shows (e.g., "12 signals")
- [ ] "Generate Equipment" button enabled

**Pass/Fail:** _______________

---

### Test D3: Generate Equipment
**Action:** Click "Generate Equipment" button

**Verify:**
- [ ] Modal closes
- [ ] New alarm card appears at top of feed
- [ ] New card has highlight animation (3 seconds)
- [ ] Toast notification shows success message
- [ ] Toast says "Drive added — 12 signals configured."

**Pass/Fail:** _______________

---

## Test Suite E: Policy Modals

### Test E1: Open Privacy Policy
**Action:** Click "Privacy Policy" in footer

**Verify:**
- [ ] Modal opens with backdrop blur
- [ ] 4 tabs visible: Privacy Policy, Terms of Use, Security, ISA-18.2 Compliance
- [ ] "Privacy Policy" tab active (teal underline)
- [ ] Content scrollable
- [ ] 4 sections visible:
  - [ ] Data Collection
  - [ ] Data Storage
  - [ ] Data Usage
  - [ ] Your Rights
- [ ] Last updated timestamp visible

**Pass/Fail:** _______________

---

### Test E2: Navigate Tabs
**Action:** Click each tab in order

**Verify:**
- [ ] Terms of Use tab:
  - [ ] 4 sections visible
  - [ ] Content relevant to terms
- [ ] Security tab:
  - [ ] 4 sections visible
  - [ ] Content about network security, API security, etc.
- [ ] ISA-18.2 Compliance tab:
  - [ ] 4 sections visible
  - [ ] Content about standard alignment, ABB integration, etc.
- [ ] Tab transitions smooth
- [ ] Active tab always highlighted

**Pass/Fail:** _______________

---

### Test E3: Close Modal
**Action:** Click X button or press Escape

**Verify:**
- [ ] Modal closes smoothly
- [ ] Main view visible
- [ ] No errors

**Pass/Fail:** _______________

---

## Test Suite F: Architecture View

### Test F1: Navigate to Architecture
**Action:** Click "Architecture" in sidebar navigation

**Verify:**
- [ ] View switches from Operations to Architecture
- [ ] SVG topology diagram visible
- [ ] 4 nodes visible:
  - [ ] OPC-UA Server
  - [ ] Flask API
  - [ ] React Frontend
  - [ ] Gemini AI
- [ ] Connecting lines between nodes
- [ ] Flow dots animate along paths
- [ ] Node icons visible

**Pass/Fail:** _______________

---

## Test Suite G: Shift Report

### Test G1: Open Shift Report
**Action:** Switch to Engineer mode, click "Shift Report"

**Verify:**
- [ ] Modal opens
- [ ] Report sections visible:
  - [ ] Summary
  - [ ] Critical Events
  - [ ] Unresolved Alarms
  - [ ] Recommended Actions
- [ ] Icons visible for each section
- [ ] Content readable
- [ ] Timestamp visible

**Pass/Fail:** _______________

---

## Test Suite H: Keyboard Shortcuts

### Test H1: Escape Key
**Action:** Open alarm detail panel, press Escape

**Verify:**
- [ ] Panel closes

**Action:** Open policy modal, press Escape

**Verify:**
- [ ] Modal closes

**Pass/Fail:** _______________

---

### Test H2: E Key (Toggle Role)
**Action:** Press "E" key (not in input field)

**Verify:**
- [ ] Role toggles between Operator and Engineer
- [ ] Works in both directions

**Pass/Fail:** _______________

---

### Test H3: A Key (Acknowledge)
**Action:** Open alarm detail panel, press "A" key

**Verify:**
- [ ] Alarm acknowledged
- [ ] Toast notification shows

**Pass/Fail:** _______________

---

## Test Suite I: WebSocket Reconnection

### Test I1: Disconnect Backend
**Action:** Stop backend (Ctrl+C in terminal)

**Verify:**
- [ ] Connection status changes to "Reconnecting…"
- [ ] Pulse dot changes to orange
- [ ] No console errors

**Pass/Fail:** _______________

---

### Test I2: Reconnect Backend
**Action:** Restart backend (`python app.py`)

**Verify:**
- [ ] Connection status changes to "OPC-UA Connected"
- [ ] Pulse dot changes to green
- [ ] Alarms refresh automatically
- [ ] No page reload required

**Pass/Fail:** _______________

---

## Test Suite J: Error Boundary

### Test J1: Trigger Error (Optional)
**Action:** Open browser console, type: `throw new Error('Test error')`

**Verify:**
- [ ] Error boundary catches error
- [ ] Error screen shows with:
  - [ ] Red alert icon
  - [ ] "Something Went Wrong" heading
  - [ ] Error details (expandable)
  - [ ] "Reload Application" button
- [ ] Click reload button refreshes page

**Pass/Fail:** _______________

---

## Test Suite K: Performance

### Test K1: Animation Smoothness
**Action:** Open Chrome DevTools → Performance tab, record 10 seconds

**Verify:**
- [ ] Frame rate stays at 60 FPS
- [ ] No dropped frames during animations
- [ ] No jank or stuttering

**Pass/Fail:** _______________

---

### Test K2: Memory Usage
**Action:** Open Chrome DevTools → Memory tab, take heap snapshot

**Verify:**
- [ ] Memory usage < 100 MB after 5 minutes
- [ ] No memory leaks (take 2nd snapshot after 5 more minutes, compare)

**Pass/Fail:** _______________

---

## Test Suite L: Typography & Styling

### Test L1: Font Verification
**Action:** Inspect elements in DevTools

**Verify:**
- [ ] Headings use Space Grotesk
- [ ] Body text uses Inter
- [ ] Numeric values use JetBrains Mono:
  - [ ] Alarm values
  - [ ] Thresholds
  - [ ] Timestamps
  - [ ] Chart axis labels
  - [ ] Confidence percentages

**Pass/Fail:** _______________

---

### Test L2: Custom Cursor
**Action:** Move cursor around page

**Verify:**
- [ ] Default cursor is crosshair with teal dot
- [ ] Cursor changes to pointer on buttons
- [ ] Cursor changes to pointer on links
- [ ] Cursor changes to pointer on alarm cards

**Pass/Fail:** _______________

---

### Test L3: Noise Texture
**Action:** Inspect body element background

**Verify:**
- [ ] Subtle noise texture visible on background
- [ ] Texture doesn't interfere with readability

**Pass/Fail:** _______________

---

## Final Checklist

### Critical Issues (Must Fix)
- [ ] No critical issues found

### Non-Critical Issues (Nice to Fix)
- [ ] List any minor issues: _______________

### Overall Assessment
- [ ] **PASS** — Ready for ABB demo
- [ ] **FAIL** — Needs fixes before demo

---

## Tester Notes

**Issues Found:**
_______________________________________________
_______________________________________________
_______________________________________________

**Recommendations:**
_______________________________________________
_______________________________________________
_______________________________________________

**Overall Impression:**
_______________________________________________
_______________________________________________
_______________________________________________

---

**Test Completed:** _______________  
**Signature:** _______________
