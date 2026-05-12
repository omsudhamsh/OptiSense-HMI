# ⚡ OptiSense HMI — Quick Start Guide

**For ABB Demo — 2 Minute Setup**

---

## 🚀 Start Backend

```bash
cd backend
python app.py
```

**Wait for:** `OPC-UA server started at opc.tcp://0.0.0.0:4840/freeopcua/server/`

---

## 🎨 Start Frontend

```bash
cd frontend
npm run dev
```

**Wait for:** `Local: http://localhost:5173/`

---

## ✅ Verify

1. Open http://localhost:5173
2. Check green pulse dot in sidebar (connected)
3. See 8 alarm cards in feed
4. No console errors (F12)

---

## 🎯 Demo Flow (5 minutes)

1. **Show alarm feed** (Operator view)
2. **Click critical alarm** → AI analysis + charts
3. **Toggle to Engineer** → 4 tabs
4. **Show Health Score** ⭐ (highlight this!)
5. **Add equipment** → new alarm appears
6. **Show Architecture** → animated topology
7. **Open Privacy Policy** → legal compliance

---

## ⌨️ Keyboard Shortcuts

- `Esc` — Close panel/modal
- `E` — Toggle Engineer mode
- `A` — Acknowledge alarm

---

## 🆘 Emergency Fixes

### Backend won't start?
```bash
pip install -r requirements.txt --force-reinstall
```

### Frontend won't connect?
1. Check backend is running
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try incognito mode

### Alarms don't load?
```bash
curl http://localhost:5000/api/alarms
```

---

## 📚 Full Documentation

- **QA_TEST_REPORT.md** — Comprehensive QA results
- **TEST_SCRIPT.md** — Step-by-step test cases
- **DEMO_CHECKLIST.md** — Detailed demo script
- **ABB_PRESENTATION_READY.md** — Technical overview

---

## ✨ Key Features to Highlight

1. **Real-time OPC-UA** integration
2. **AI-powered** alarm explanations (Gemini)
3. **ISA-18.2 compliance** dashboard
4. **Beautiful UI/UX** (custom cursor, animations)
5. **ABB equipment** templates (ACS880, AC500, IRB)

---

**You're ready! Good luck! 🚀**
