import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Activity, AlertTriangle, ChevronRight, Factory, Network, Plus, Shield, X, Zap } from 'lucide-react'
import { C, S, btn } from './styles/tokens'
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

function Btn({ variant='secondary', size='md', onClick, disabled, children, style={}, ...rest }) {
  const [hov, setHov] = useState(false)
  const [act, setAct] = useState(false)
  const base = { ...btn.base, ...(size==='sm'?btn.sm:size==='lg'?btn.lg:{}), ...btn[variant]||btn.secondary }
  const hoverStyle = variant==='primary'
    ? { background:'#00BFAA', boxShadow:'0 0 20px rgba(0,212,170,0.4)', transform:'translateY(-1px)' }
    : variant==='danger'
    ? { background:'rgba(255,140,0,0.2)', boxShadow:'0 0 14px rgba(255,140,0,0.25)', transform:'translateY(-1px)' }
    : variant==='critical'
    ? { background:'rgba(255,45,45,0.2)', boxShadow:'0 0 14px rgba(255,45,45,0.25)', transform:'translateY(-1px)' }
    : variant==='ghost'
    ? { background:C.elevated, color:C.textPrimary }
    : { borderColor:'rgba(0,212,170,0.35)', color:C.textPrimary, background:'rgba(0,212,170,0.06)', transform:'translateY(-1px)' }
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={()=>setHov(true)}
      onMouseLeave={()=>{setHov(false);setAct(false)}}
      onMouseDown={()=>setAct(true)}
      onMouseUp={()=>setAct(false)}
      style={{
        ...base,
        ...(hov&&!disabled?hoverStyle:{}),
        ...(act&&!disabled?{transform:'scale(0.97)',boxShadow:'none'}:{}),
        ...(disabled?{opacity:0.4,cursor:'not-allowed',pointerEvents:'none'}:{}),
        ...style
      }}
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
    <div style={{ display:'flex', minHeight:'100vh', background:C.base, color:C.textPrimary, fontFamily:'Inter,sans-serif', position:'relative' }}>

      {/* SIDEBAR */}
      <aside style={{ width:240, flexShrink:0, display:'flex', flexDirection:'column', background:'rgba(8,12,24,0.97)', borderRight:`1px solid ${C.border}`, position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>

        {/* Brand */}
        <div style={{ padding:'24px 20px 20px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
            <div style={{ width:32, height:32, borderRadius:9, background:'linear-gradient(135deg,#00D4AA,#0066CC)', boxShadow:'0 0 16px rgba(0,212,170,0.4)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Zap size={16} color="white" />
            </div>
            <span style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:20, fontWeight:700, color:C.textPrimary, letterSpacing:'-0.3px' }}>OptiSense</span>
          </div>
          <p style={{ fontSize:11, color:C.textTertiary, paddingLeft:42 }}>ABB Accelerator · ISA-18.2</p>
        </div>

        <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.border},transparent)`, margin:'0 20px' }} />

        {/* Nav */}
        <nav style={{ padding:'12px 12px 0' }}>
          {NAV.map(({id, label, icon:Icon}) => {
            const active = activeView === id
            return (
              <NavItem key={id} active={active} onClick={() => setActiveView(id)}>
                <Icon size={15} color={active ? C.accent : C.textSecondary} />
                <span style={{ flex:1 }}>{label}</span>
                {active && <ChevronRight size={13} color={C.accent} style={{ opacity:0.6 }} />}
              </NavItem>
            )
          })}
        </nav>

        {/* Equipment groups */}
        <div style={{ padding:'20px 20px 0' }}>
          <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.09em', textTransform:'uppercase', color:C.textTertiary, marginBottom:10 }}>Equipment Groups</p>
          <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
            {equipmentGroups.length === 0
              ? [1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height:32 }} />)
              : equipmentGroups.map(([type, items]) => {
                  const crit = items.filter(a => a.severity==='CRITICAL').length
                  return (
                    <div key={type} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(18,27,46,0.7)', border:`1px solid ${C.border}`, borderRadius:9, padding:'7px 12px' }}>
                      <span style={{ fontSize:13, color:C.textSecondary, textTransform:'capitalize' }}>{type.replace('_',' ')}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        {crit > 0 && <span style={{ width:18, height:18, borderRadius:'50%', background:C.p1, color:'white', fontSize:10, fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center' }}>{crit}</span>}
                        <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:12, color:C.textTertiary }}>{items.length}</span>
                      </div>
                    </div>
                  )
                })}
          </div>
        </div>

        {/* Bottom */}
        <div style={{ marginTop:'auto', padding:'0 20px 20px', display:'flex', flexDirection:'column', gap:12 }}>
          {/* Connection */}
          <div style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(18,27,46,0.7)', border:`1px solid ${C.border}`, borderRadius:9, padding:'9px 12px' }}>
            <div style={{ position:'relative', flexShrink:0 }}>
              <span className={isConnected ? 'pulse-dot' : ''} style={{ display:'block', width:8, height:8, borderRadius:'50%', background: isConnected ? C.accent : C.p2 }} />
            </div>
            <div>
              <p style={{ fontSize:12, fontWeight:500, color:C.textSecondary }}>{isConnected ? 'OPC-UA Connected' : 'Reconnecting…'}</p>
              <p style={{ fontSize:10, color:C.textTertiary }}>localhost:4840</p>
            </div>
          </div>

          <RoleToggle role={role} toggleRole={toggleRole} />

          <div style={{ height:1, background:`linear-gradient(90deg,transparent,${C.border},transparent)` }} />

          {/* Policy links */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4px 8px' }}>
            {Object.entries(POLICIES).map(([key, p]) => (
              <PolicyLink key={key} onClick={() => setActivePolicy(key)}>{p.title}</PolicyLink>
            ))}
          </div>
          <p style={{ fontSize:10, color:C.textTertiary }}>v1.0.0 · ABB Hackathon 2026</p>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>

        {/* Header */}
        <header style={{ height:64, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 24px', background:'rgba(8,12,24,0.92)', borderBottom:`1px solid ${C.border}`, backdropFilter:'blur(16px)', zIndex:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <HealthScore variant="compact" healthScore={healthScore} />
            <div style={{ width:1, height:32, background:C.border }} />
            <div>
              <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.09em', textTransform:'uppercase', color:C.textTertiary }}>Shift 06:00–14:00</p>
              <p style={{ fontSize:12, color:C.textSecondary, marginTop:2 }}>ISA-18.2 compliance active</p>
            </div>
          </div>
          {role === 'engineer' && activeView === 'operations' && (
            <div style={{ display:'flex', gap:8 }}>
              <Btn variant="secondary" size="sm" onClick={() => setShowShiftReport(true)}>Shift Report</Btn>
              <Btn variant="primary" size="sm" onClick={() => setShowEquipmentModal(true)}>
                <Plus size={13} /> Add Equipment
              </Btn>
            </div>
          )}
        </header>

        {/* Content area */}
        <div style={{ flex:1, overflowY:'auto' }}>
          <div style={{ padding:'24px' }}>
            {activeView === 'architecture' ? (
              <ArchitectureView />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={role} initial={{opacity:0,y:6}} animate={{opacity:1,y:0}} exit={{opacity:0,y:6}} transition={{duration:0.18}} style={{ display:'flex', flexDirection:'column', gap:20 }}>

                  {/* Engineer tabs */}
                  {role === 'engineer' && (
                    <div style={{ display:'flex', gap:4, background:'rgba(13,20,36,0.9)', border:`1px solid ${C.border}`, borderRadius:12, padding:4, width:'fit-content' }}>
                      {ENG_TABS.map(({id, label, icon:Icon}) => {
                        const active = engineerTab === id
                        return (
                          <EngTab key={id} active={active} onClick={() => setEngineerTab(id)}>
                            <Icon size={12} />
                            {label}
                          </EngTab>
                        )
                      })}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {role==='engineer' && engineerTab==='health' && (
                      <motion.div key="health" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}>
                        <HealthScore variant="full" healthScore={healthScore} />
                      </motion.div>
                    )}
                    {role==='engineer' && engineerTab==='dependencies' && (
                      <motion.div key="deps" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}>
                        <DependencyGraph alarms={alarms} onSelect={setSelectedAlarmId} />
                      </motion.div>
                    )}
                    {role==='engineer' && engineerTab==='equipment' && (
                      <motion.div key="equip" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}>
                        <TemplateLibrary />
                      </motion.div>
                    )}
                    {(role==='operator' || engineerTab==='alarms') && (
                      <motion.div key="alarms" initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}>
                        <AlarmFeed alarms={alarms} selectedAlarmId={selectedAlarmId} onSelect={setSelectedAlarmId} onAcknowledge={handleAcknowledge} onSnooze={handleSnooze} onEscalate={handleEscalate} newAlarmIds={newAlarmIds} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Footer */}
          <footer style={{ borderTop:`1px solid ${C.border}`, padding:'10px 24px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(8,12,24,0.6)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:C.textTertiary }}>
              <Zap size={11} color={C.accent} />
              <span>OptiSense HMI · ABB Accelerator 2026</span>
            </div>
            <div style={{ display:'flex', gap:20 }}>
              {Object.entries(POLICIES).map(([key, p]) => (
                <PolicyLink key={key} onClick={() => setActivePolicy(key)}>{p.title}</PolicyLink>
              ))}
            </div>
          </footer>
        </div>
      </main>

      {/* DETAIL PANEL */}
      <AnimatePresence>
        {selectedAlarm && (
          <motion.aside key="detail" initial={{x:'100%',opacity:0}} animate={{x:0,opacity:1}} exit={{x:'100%',opacity:0}} transition={{type:'spring',stiffness:260,damping:28}}
            style={{ width:400, flexShrink:0, borderLeft:`1px solid ${C.border}`, background:'rgba(10,15,26,0.98)', backdropFilter:'blur(24px)', overflowY:'auto', display:'flex', flexDirection:'column' }}>
            <AlarmDetail alarm={selectedAlarm} onClose={() => setSelectedAlarmId(null)} onAcknowledge={() => handleAcknowledge(selectedAlarm.id)} onSnooze={min => handleSnooze(selectedAlarm.id, min)} onEscalate={() => handleEscalate(selectedAlarm.id)} fetchExplanation={fetchExplanation} />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MODALS */}
      <EquipmentModal open={showEquipmentModal} onClose={() => setShowEquipmentModal(false)} onGenerate={handleAddEquipment} />
      <ShiftReport open={showShiftReport} onClose={() => setShowShiftReport(false)} />
      <PolicyModal open={!!activePolicy} policyKey={activePolicy} content={activePolicy ? POLICIES[activePolicy] : null} allPolicies={POLICIES} onNavigate={setActivePolicy} onClose={() => setActivePolicy(null)} />

      {/* TOASTS */}
      <div className="no-print" style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:8 }}>
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div key={toast.id} initial={{opacity:0,y:10,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:8,scale:0.95}} transition={{type:'spring',stiffness:300,damping:25}}
              style={{ display:'flex', alignItems:'center', gap:10, background:'rgba(18,27,46,0.97)', border:`1px solid ${toast.variant==='success'?'rgba(0,212,170,0.3)':toast.variant==='danger'?'rgba(255,45,45,0.3)':C.border}`, borderRadius:12, padding:'10px 14px', fontSize:13, color:C.textSecondary, backdropFilter:'blur(16px)', maxWidth:300, boxShadow:'0 8px 32px rgba(0,0,0,0.4)' }}>
              <div style={{ width:24, height:24, borderRadius:'50%', background:toast.variant==='success'?'rgba(0,212,170,0.12)':toast.variant==='danger'?'rgba(255,45,45,0.12)':'rgba(30,45,69,0.6)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <Factory size={12} color={toast.variant==='success'?C.accent:toast.variant==='danger'?C.p1:C.textSecondary} />
              </div>
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function NavItem({ active, onClick, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'9px 10px', borderRadius:9, border:`1px solid ${active?'rgba(0,212,170,0.18)':hov?C.border:'transparent'}`, background:active?'rgba(0,212,170,0.08)':hov?'rgba(30,45,69,0.5)':'transparent', color:active?C.textPrimary:hov?C.textPrimary:C.textSecondary, fontSize:14, fontWeight:500, fontFamily:'Inter,sans-serif', cursor:'pointer', transition:'all 160ms', marginBottom:2, position:'relative' }}>
      {active && <span style={{ position:'absolute', left:0, top:'20%', height:'60%', width:2, background:C.accent, borderRadius:'0 2px 2px 0' }} />}
      {children}
    </button>
  )
}

function EngTab({ active, onClick, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:6, padding:'7px 14px', borderRadius:9, border:`1px solid ${active?'rgba(0,212,170,0.22)':'transparent'}`, background:active?'rgba(0,212,170,0.10)':hov?'rgba(30,45,69,0.5)':'transparent', color:active?C.accent:hov?C.textPrimary:C.textSecondary, fontSize:13, fontWeight:500, fontFamily:'Inter,sans-serif', cursor:'pointer', transition:'all 160ms', whiteSpace:'nowrap' }}>
      {children}
    </button>
  )
}

function PolicyLink({ onClick, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ background:'none', border:'none', padding:0, fontSize:11, color:hov?C.accent:C.textTertiary, cursor:'pointer', transition:'color 160ms', textAlign:'left', fontFamily:'Inter,sans-serif' }}>
      {children}
    </button>
  )
}

export default App
