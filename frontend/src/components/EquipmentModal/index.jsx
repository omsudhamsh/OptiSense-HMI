import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Cpu, Bot, Server, Radio, Plus } from 'lucide-react'
import { C } from '../../styles/tokens'

const TEMPLATES = {
  drive:  { label:'Drive',  icon:Cpu,    signals:['Output Temperature', 'Output Current', 'Motor Speed', 'DC Bus Voltage', 'Fault Code'] },
  plc:    { label:'PLC',    icon:Server, signals:['CPU Load', 'Scan Time', 'I/O Latency', 'Memory Utilization', 'Comm Errors'] },
  robot:  { label:'Robot',  icon:Bot,    signals:['Joint Torque', 'Axis Temp', 'Path Deviation', 'Drive Current', 'Payload Weight'] },
  sensor: { label:'Sensor', icon:Radio,  signals:['Signal Noise', 'Drift Rate', 'Response Time', 'Calibration Age', 'Signal Quality'] }
}
const TYPES = Object.keys(TEMPLATES)

export default function EquipmentModal({ open, onClose, onGenerate }) {
  const [type, setType] = useState('drive')
  const [id, setId] = useState('')
  const [location, setLocation] = useState('')
  const [loading, setLoading] = useState(false)

  const template = useMemo(() => TEMPLATES[type], [type])
  const TypeIcon = template.icon

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    await onGenerate({ equipment_type:type, equipment:id||`ABB ${template.label}`, location:location||'New Line', templateLabel:template.label, templateSignals:template.signals.length })
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          style={{ position:'fixed', inset:0, zIndex:40, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(4,6,14,0.85)', backdropFilter:'blur(10px)' }}
          onClick={onClose}>
          <motion.div initial={{scale:0.95,opacity:0,y:12}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.95,opacity:0,y:8}} transition={{type:'spring',stiffness:280,damping:26}}
            style={{ width:'100%', maxWidth:480, overflow:'hidden', background:'rgba(10,15,26,0.98)', border:`1px solid ${C.border}`, borderRadius:20, boxShadow:'0 32px 80px rgba(0,0,0,0.75)', backdropFilter:'blur(32px)' }}
            onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:C.accentDim, border:`1px solid ${C.accentBorder}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Plus size={16} color={C.accent} />
                </div>
                <div>
                  <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:16, fontWeight:600, color:C.textPrimary }}>Add Equipment</h3>
                  <p style={{ fontSize:12, color:C.textTertiary }}>Configure monitoring signals</p>
                </div>
              </div>
              <button type="button" onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', background:'transparent', border:'none', color:C.textTertiary, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 160ms' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.elevated; e.currentTarget.style.color = C.textPrimary }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.textTertiary }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:20 }}>
              {/* Type selector */}
              <div>
                <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.09em', textTransform:'uppercase', color:C.textTertiary, marginBottom:12 }}>Equipment Type</p>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:8 }}>
                  {TYPES.map(t => {
                    const { label, icon:Icon } = TEMPLATES[t]
                    const active = type === t
                    return (
                      <button key={t} type="button" onClick={() => setType(t)}
                        style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6, borderRadius:10, padding:'12px 8px', fontSize:12, fontWeight:500, background: active ? 'rgba(0,212,170,0.1)' : 'rgba(18,27,46,0.6)', border: `1px solid ${active ? 'rgba(0,212,170,0.3)' : C.border}`, color: active ? C.accent : C.textTertiary, cursor:'pointer', transition:'all 160ms', fontFamily:'Inter,sans-serif' }}>
                        <Icon size={16} />
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* ID */}
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:600, letterSpacing:'0.09em', textTransform:'uppercase', color:C.textTertiary, marginBottom:8 }}>Equipment ID</label>
                <input value={id} onChange={e => setId(e.target.value)} placeholder={`e.g. ABB ${template.label}-09`}
                  style={{ width:'100%', background:'rgba(8,12,24,0.6)', border:`1px solid ${C.border}`, borderRadius:9, padding:'10px 14px', fontFamily:'JetBrains Mono,monospace', fontSize:13, color:C.textPrimary, transition:'all 160ms', outline:'none' }}
                  onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px rgba(0,212,170,0.12)` }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Location */}
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:600, letterSpacing:'0.09em', textTransform:'uppercase', color:C.textTertiary, marginBottom:8 }}>Location</label>
                <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. MCC-4, Bay 3"
                  style={{ width:'100%', background:'rgba(8,12,24,0.6)', border:`1px solid ${C.border}`, borderRadius:9, padding:'10px 14px', fontFamily:'Inter,sans-serif', fontSize:13, color:C.textPrimary, transition:'all 160ms', outline:'none' }}
                  onFocus={e => { e.target.style.borderColor = C.accent; e.target.style.boxShadow = `0 0 0 3px rgba(0,212,170,0.12)` }}
                  onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none' }}
                />
              </div>

              {/* Template preview */}
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <TypeIcon size={13} color={C.accent} />
                  <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.09em', textTransform:'uppercase', color:C.textTertiary }}>{template.label} Template — {template.signals.length} signals</p>
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                  {template.signals.map(signal => (
                    <span key={signal} style={{ background:'rgba(30,45,69,0.5)', border:`1px solid ${C.border}`, borderRadius:8, padding:'4px 10px', fontSize:12, color:C.textSecondary }}>
                      {signal}
                    </span>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading}
                style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, width:'100%', background:C.accent, color:C.base, border:`1px solid ${C.accent}`, borderRadius:10, padding:'12px 20px', fontSize:14, fontWeight:600, fontFamily:'Inter,sans-serif', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition:'all 160ms', minHeight:44 }}>
                {loading ? (
                  <>
                    <span className="spin" style={{ width:16, height:16, border:'2px solid rgba(8,12,24,0.3)', borderTopColor:C.base, borderRadius:'50%' }} />
                    Configuring…
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    Add to Monitoring
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
