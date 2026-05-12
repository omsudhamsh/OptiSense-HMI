import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, AlertTriangle, ChevronRight, Factory, Network, Plus, Shield, X, Zap } from 'lucide-react'
import AlarmDetail from './components/AlarmDetail'
import AlarmFeed from './components/AlarmFeed'
import ArchitectureView from './components/ArchitectureView'
import DependencyGraph from './components/DependencyGraph'
import EquipmentModal from './components/EquipmentModal'
import HealthScore from './components/HealthScore'
import PolicyModal from './components/PolicyModal'
import RoleToggle from './components/RoleToggle'
import ShiftReport from './components/ShiftReport'
import TemplateLibrary from './components/TemplateLibrary'
import { useLiveData } from './hooks/useLiveData'
import { useRole } from './hooks/useRole'

const NAV = [
  { id: 'operations',   label: 'Operations',  icon: Activity },
  { id: 'architecture', label: 'Architecture', icon: Network }
]
const ENG_TABS = [
  { id: 'alarms',       label: 'Alarm Feed',   icon: AlertTriangle },
  { id: 'health',       label: 'Health Score', icon: Activity },
  { id: 'dependencies', label: 'Dependencies', icon: Network },
  { id: 'equipment',    label: 'Equipment',    icon: Factory }
]
const POLICIES = {
  privacy: { title: 'Privacy Policy', lastUpdated: 'May 2026', sections: [
    { heading: 'Data Collection', body: 'OptiSense HMI collects only operational telemetry required for alarm visibility and health scoring. No personal data is collected in the default deployment.' },
    { heading: 'Data Storage', body: 'All telemetry data is stored locally within your plant network. No data is transmitted to external servers unless explicitly configured.' },
    { heading: 'Data Usage', body: 'Collected data is used exclusively for alarm prioritization, health scoring, and AI-assisted explanations. The Gemini AI integration sends only anonymized alarm context.' },
    { heading: 'Your Rights', body: 'Plant administrators can export, anonymize, or delete all stored telemetry at any time. Contact your site IT administrator for data access requests.' }
  ]},
  terms: { title: 'Terms of Use', lastUpdated: 'May 2026', sections: [
    { heading: 'Intended Use', body: 'OptiSense is designed for industrial monitoring and decision support only. It must not be used to bypass or replace certified safety systems.' },
    { heading: 'Operator Responsibility', body: 'Operators are solely responsible for validating all actions before execution on live equipment. AI explanations are informational aids only.' },
    { heading: 'Limitations', body: 'OptiSense does not guarantee 100% alarm detection accuracy. Use as a supplementary tool alongside existing plant safety procedures.' },
    { heading: 'Modifications', body: 'Unauthorized modification of OptiSense source code in production environments is prohibited without written approval from your plant safety officer.' }
  ]},
  security: { title: 'Security', lastUpdated: 'May 2026', sections: [
    { heading: 'Network Security', body: 'OPC-UA endpoints must be protected behind plant network segmentation and access control lists. Only accessible from approved operator workstations.' },
    { heading: 'API Security', body: 'All production deployments must enable HTTPS with valid certificates. API access should be restricted to approved operator workstations.' },
    { heading: 'Authentication', body: 'Role-based access control is enforced at the application level. Engineer mode requires elevated credentials. All events are logged for audit.' },
    { heading: 'Vulnerability Reporting', body: 'Report security vulnerabilities to your plant IT security team. Follow your site responsible disclosure policy.' }
  ]},
  compliance: { title: 'ISA-18.2 Compliance', lastUpdated: 'May 2026', sections: [
    { heading: 'Standard Alignment', body: 'OptiSense continuously measures ISA-18.2 KPIs: alarm rate, chattering alarms, suppression ratio, and priority distribution. All metrics available for audit export.' },
    { heading: 'ABB Integration', body: 'Aligns with ABB commissioning workflows for alarm rationalization. Supports ACS880 drives, AC500 PLCs, IRB robots, and Zenon SCADA.' },
    { heading: 'Audit Trail', body: 'All alarm acknowledgements, snoozes, escalations, and configuration changes are logged with timestamps and operator IDs.' },
    { heading: 'Performance Targets', body: 'ISA-18.2 targets: ≤6 alarms/hour, ≤1 chattering alarm, <5% suppression ratio, P1/P2/P3 at 5%/15%/30%.' }
  ]}
}

function Btn({ variant='secondary', size='md', onClick, disabled, children, className='', ...rest }) {
  const baseClasses = "inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-200 select-none outline-none whitespace-nowrap rounded-lg border";
  
  const sizeClasses = {
    sm: "text-xs px-3 py-1.5 min-h-[28px]",
    md: "text-sm px-4 py-2 min-h-[34px]",
    lg: "text-base px-5 py-3 min-h-[42px]"
  }[size] || sizeClasses.md;

  const variantClasses = {
    primary: "bg-accent text-surface-base border-accent hover:shadow-[0_0_20px_rgba(0,212,170,0.4)] hover:-translate-y-px font-semibold",
    secondary: "bg-transparent text-text-secondary border-surface-border hover:bg-surface-hover hover:text-text-primary",
    danger: "bg-isa-p2/10 text-isa-p2 border-isa-p2/30 hover:bg-isa-p2/20 hover:shadow-[0_0_14px_rgba(255,140,0,0.25)] hover:-translate-y-px",
    critical: "bg-isa-p1/10 text-isa-p1 border-isa-p1/30 hover:bg-isa-p1/20 hover:shadow-[0_0_14px_rgba(255,45,45,0.25)] hover:-translate-y-px",
    ghost: "bg-transparent text-text-tertiary border-transparent hover:bg-surface-elevated hover:text-text-primary !p-1.5 rounded-full min-h-[32px] min-w-[32px]"
  }[variant] || variantClasses.secondary;

  const disabledClasses = "opacity-40 cursor-not-allowed pointer-events-none";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${disabled ? disabledClasses : 'active:scale-[0.97]'} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}

function App() {
  const { alarms, healthScore, connectionStatus, acknowledgeAlarm, snoozeAlarm, escalateAlarm, fetchExplanation, addEquipment } = useLiveData()
  const { role, toggleRole } = useRole()
  const [selectedAlarmId, setSelectedAlarmId] = useState(null)
  const [activeView, setActiveView] = useState('operations')
  const [engineerTab, setEngineerTab] = useState('alarms')
  const [showEquipmentModal, setShowEquipmentModal] = useState(false)
  const [showShiftReport, setShowShiftReport] = useState(false)
  const [newAlarmIds, setNewAlarmIds] = useState([])
  const [toasts, setToasts] = useState([])
  const [activePolicy, setActivePolicy] = useState(null)

  const selectedAlarm = useMemo(() => alarms.find(a => a.id === selectedAlarmId) || null, [alarms, selectedAlarmId])
  const equipmentGroups = useMemo(() => {
    const g = new Map()
    alarms.forEach(a => { const t = a.equipment_type||'equipment'; if(!g.has(t))g.set(t,[]); g.get(t).push(a) })
    return Array.from(g.entries())
  }, [alarms])

  const isConnected = connectionStatus === 'connected'

  const pushToast = (message, variant='default') => {
    const id = Date.now()
    setToasts(p => [...p, {id, message, variant}])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }

  const handleAddEquipment = async payload => {
    const created = await addEquipment(payload)
    if (created?.id) {
      setShowEquipmentModal(false)
      setNewAlarmIds(p => [...p, created.id])
      setTimeout(() => setNewAlarmIds(p => p.filter(id => id !== created.id)), 3000)
      pushToast(`${created.equipment} added — ${payload.templateSignals} signals configured.`, 'success')
    }
  }
  const handleAcknowledge = async id => { await acknowledgeAlarm(id); pushToast('Alarm acknowledged.', 'success') }
  const handleSnooze = async (id, min) => { await snoozeAlarm(id, min); pushToast(`Snoozed for ${min} min.`) }
  const handleEscalate = async id => { await escalateAlarm(id); pushToast('Alarm escalated to critical.', 'danger') }

  return (
    <div className="flex min-h-screen bg-surface-base text-text-primary font-body relative overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-60 shrink-0 flex flex-col bg-surface-card/90 backdrop-blur-xl border-r border-surface-border sticky top-0 h-screen overflow-hidden z-20 shadow-2xl">
        
        {/* Brand */}
        <div className="p-6 pb-5">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-blue-600 shadow-[0_0_16px_rgba(0,212,170,0.4)] flex items-center justify-center shrink-0">
              <Zap size={16} className="text-white" />
            </div>
            <span className="font-display text-xl font-bold text-text-primary tracking-tight">OptiSense</span>
          </div>
          <p className="text-[11px] text-text-tertiary pl-11">ABB Accelerator · ISA-18.2</p>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-surface-border to-transparent mx-5" />

        {/* Nav */}
        <nav className="p-3 pt-4 flex flex-col gap-1">
          {NAV.map(({id, label, icon:Icon}) => {
            const active = activeView === id
            return (
              <NavItem key={id} active={active} onClick={() => setActiveView(id)}>
                <Icon size={16} className={active ? "text-accent" : "text-text-secondary"} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={14} className="text-accent opacity-60" />}
              </NavItem>
            )
          })}
        </nav>

        {/* Equipment groups */}
        <div className="p-5 pt-3">
          <p className="text-[11px] font-semibold tracking-wider uppercase text-text-tertiary mb-3">Equipment Groups</p>
          <div className="flex flex-col gap-1.5">
            {equipmentGroups.length === 0
              ? [1,2,3,4].map(i => <div key={i} className="skeleton h-8 w-full rounded-lg" />)
              : equipmentGroups.map(([type, items]) => {
                  const crit = items.filter(a => a.severity==='CRITICAL').length
                  return (
                    <div key={type} className="flex items-center justify-between bg-surface-elevated/50 border border-surface-border/50 rounded-lg px-3 py-2 transition-colors hover:bg-surface-elevated/80">
                      <span className="text-xs text-text-secondary capitalize font-medium">{type.replace('_',' ')}</span>
                      <div className="flex items-center gap-2">
                        {crit > 0 && <span className="w-5 h-5 rounded-full bg-isa-p1 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(255,45,45,0.4)] animate-pulse-slow">{crit}</span>}
                        <span className="font-mono text-xs text-text-tertiary">{items.length}</span>
                      </div>
                    </div>
                  )
                })}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-auto p-5 flex flex-col gap-3">
          {/* Connection */}
          <div className="flex items-center gap-3 bg-surface-elevated/50 border border-surface-border/50 rounded-xl p-3">
            <div className="relative shrink-0 flex items-center justify-center w-3 h-3">
              {isConnected && <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20"></span>}
              <span className={`block w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-accent shadow-[0_0_8px_rgba(0,212,170,0.6)]' : 'bg-isa-p2'} z-10`} />
            </div>
            <div>
              <p className="text-xs font-medium text-text-secondary">{isConnected ? 'OPC-UA Connected' : 'Reconnecting…'}</p>
              <p className="text-[10px] text-text-tertiary">localhost:4840</p>
            </div>
          </div>

          <RoleToggle role={role} toggleRole={toggleRole} />

          <div className="h-px bg-gradient-to-r from-transparent via-surface-border to-transparent" />

          {/* Policy links */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1">
            {Object.entries(POLICIES).map(([key, p]) => (
              <PolicyLink key={key} onClick={() => setActivePolicy(key)}>{p.title}</PolicyLink>
            ))}
          </div>
          <p className="text-[10px] text-text-tertiary mt-1">v2.0.0 · OptiSense Core</p>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-surface-elevated/20 via-surface-base to-surface-base relative">
        
        {/* Dynamic Background Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />

        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-6 bg-surface-card/40 border-b border-surface-border/50 backdrop-blur-2xl z-10 sticky top-0">
          <div className="flex items-center gap-5">
            <HealthScore variant="compact" healthScore={healthScore} />
            <div className="w-px h-8 bg-surface-border/50" />
            <div className="flex flex-col">
              <span className="text-[10px] font-bold tracking-widest uppercase text-text-tertiary">Shift 06:00–14:00</span>
              <span className="text-xs text-text-secondary font-medium mt-0.5 flex items-center gap-1.5">
                <Shield size={12} className="text-accent" /> ISA-18.2 Active
              </span>
            </div>
          </div>
          {role === 'engineer' && activeView === 'operations' && (
            <div className="flex gap-3">
              <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-border text-sm font-medium text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-all duration-200 outline-none" onClick={() => setShowShiftReport(true)}>Shift Report</button>
              <button type="button" className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-accent/40 bg-accent/10 text-sm font-medium text-accent hover:bg-accent hover:text-base hover:shadow-[0_0_12px_rgba(0,212,170,0.4)] transition-all duration-200 outline-none" onClick={() => setShowEquipmentModal(true)}>
                <Plus size={14} /> Add Equipment
              </button>
            </div>
          )}
        </header>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto relative z-0 p-6">
          {activeView === 'architecture' ? (
            <ArchitectureView />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div key={role} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.2}} className="flex flex-col gap-6 max-w-7xl mx-auto">

                {/* Engineer tabs */}
                {role === 'engineer' && (
                  <div className="flex gap-1 bg-surface-elevated/40 border border-surface-border/50 rounded-xl p-1 w-fit backdrop-blur-md">
                    {ENG_TABS.map(({id, label, icon:Icon}) => {
                      const active = engineerTab === id
                      return (
                        <EngTab key={id} active={active} onClick={() => setEngineerTab(id)}>
                          <Icon size={14} />
                          {label}
                        </EngTab>
                      )
                    })}
                  </div>
                )}

                <AnimatePresence mode="wait">
                  {role==='engineer' && engineerTab==='health' && (
                    <motion.div key="health" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
                      <HealthScore variant="full" healthScore={healthScore} />
                    </motion.div>
                  )}
                  {role==='engineer' && engineerTab==='dependencies' && (
                    <motion.div key="deps" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
                      <DependencyGraph alarms={alarms} onSelect={setSelectedAlarmId} />
                    </motion.div>
                  )}
                  {role==='engineer' && engineerTab==='equipment' && (
                    <motion.div key="equip" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
                      <TemplateLibrary />
                    </motion.div>
                  )}
                  {(role==='operator' || engineerTab==='alarms') && (
                    <motion.div key="alarms" initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
                      <AlarmFeed alarms={alarms} selectedAlarmId={selectedAlarmId} onSelect={setSelectedAlarmId} onAcknowledge={handleAcknowledge} onSnooze={handleSnooze} onEscalate={handleEscalate} newAlarmIds={newAlarmIds} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-surface-border/50 px-6 py-3 flex items-center justify-between bg-surface-base/50 backdrop-blur-md z-10">
          <div className="flex items-center gap-2 text-[11px] text-text-tertiary font-medium">
            <Zap size={12} className="text-accent" />
            <span>OptiSense HMI · Advanced Industrial Operations</span>
          </div>
          <div className="flex gap-5">
            {Object.entries(POLICIES).map(([key, p]) => (
              <PolicyLink key={key} onClick={() => setActivePolicy(key)}>{p.title}</PolicyLink>
            ))}
          </div>
        </footer>
      </main>

      {/* DETAIL PANEL */}
      <AnimatePresence>
        {selectedAlarm && (
          <motion.aside key="detail" initial={{x:'100%', opacity:0.5}} animate={{x:0, opacity:1}} exit={{x:'100%', opacity:0}} transition={{type:'spring', stiffness:300, damping:30}}
            className="w-[420px] shrink-0 border-l border-surface-border/50 bg-surface-card/95 backdrop-blur-2xl overflow-y-auto flex flex-col absolute right-0 top-0 bottom-0 z-30 shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">
            <AlarmDetail alarm={selectedAlarm} onClose={() => setSelectedAlarmId(null)} onAcknowledge={() => handleAcknowledge(selectedAlarm.id)} onSnooze={min => handleSnooze(selectedAlarm.id, min)} onEscalate={() => handleEscalate(selectedAlarm.id)} fetchExplanation={fetchExplanation} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* OVERLAY for detail panel on small screens */}
      <AnimatePresence>
        {selectedAlarm && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 pointer-events-auto lg:pointer-events-none" onClick={() => setSelectedAlarmId(null)} />
        )}
      </AnimatePresence>

      {/* MODALS */}
      <EquipmentModal open={showEquipmentModal} onClose={() => setShowEquipmentModal(false)} onGenerate={handleAddEquipment} />
      <ShiftReport open={showShiftReport} onClose={() => setShowShiftReport(false)} alarms={alarms} />
      <PolicyModal open={!!activePolicy} policyKey={activePolicy} content={activePolicy ? POLICIES[activePolicy] : null} allPolicies={POLICIES} onNavigate={setActivePolicy} onClose={() => setActivePolicy(null)} />

      {/* TOASTS */}
      <div className="no-print fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id} initial={{opacity:0,y:20,scale:0.9}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:10,scale:0.95}} transition={{type:'spring',stiffness:400,damping:25}}
              className={`flex items-center gap-3 bg-surface-card/95 border rounded-xl p-3 pr-4 text-sm text-text-primary backdrop-blur-xl max-w-sm shadow-card pointer-events-auto ${toast.variant==='success'?'border-accent/30 shadow-[0_8px_32px_rgba(0,212,170,0.15)]':toast.variant==='danger'?'border-isa-p1/30 shadow-[0_8px_32px_rgba(255,45,45,0.15)]':'border-surface-border'}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${toast.variant==='success'?'bg-accent/10 text-accent':toast.variant==='danger'?'bg-isa-p1/10 text-isa-p1':'bg-surface-elevated text-text-secondary'}`}>
                <Factory size={14} />
              </div>
              <span className="font-medium">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function NavItem({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl border font-medium text-sm transition-all duration-200 relative group outline-none
        ${active ? 'bg-accent/10 border-accent/20 text-text-primary' : 'bg-transparent border-transparent text-text-secondary hover:bg-surface-elevated/50 hover:text-text-primary hover:border-surface-border/50'}`}>
      {active && <span className="absolute left-0 top-[20%] h-[60%] w-[3px] bg-accent rounded-r-md shadow-[0_0_8px_rgba(0,212,170,0.6)]" />}
      {children}
    </button>
  )
}

function EngTab({ active, onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 outline-none
        ${active ? 'bg-accent/10 border-accent/30 text-accent shadow-[0_0_12px_rgba(0,212,170,0.1)]' : 'bg-transparent border-transparent text-text-secondary hover:bg-surface-hover hover:text-text-primary'}`}>
      {children}
    </button>
  )
}

function PolicyLink({ onClick, children }) {
  return (
    <button type="button" onClick={onClick}
      className="bg-transparent border-none p-0 text-[11px] text-text-tertiary hover:text-accent transition-colors text-left font-body outline-none">
      {children}
    </button>
  )
}

export default App
