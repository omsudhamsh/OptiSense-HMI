import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Shield, AlertTriangle, Zap, X, ChevronRight } from 'lucide-react'
import { C } from '../../styles/tokens'

const ICONS = { privacy:Shield, terms:AlertTriangle, security:Shield, compliance:Zap }

export default function PolicyModal({ open, policyKey, content, allPolicies, onNavigate, onClose }) {
  if (!content) return null
  const tabs = Object.entries(allPolicies)
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          style={{ position:'fixed', inset:0, zIndex:50, display:'flex', alignItems:'center', justifyContent:'center', padding:16, background:'rgba(4,6,14,0.88)', backdropFilter:'blur(12px)' }}
          onClick={onClose}>
          <motion.div initial={{scale:0.95,opacity:0,y:16}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.95,opacity:0,y:8}} transition={{type:'spring',stiffness:280,damping:26}}
            style={{ position:'relative', width:'100%', maxWidth:768, maxHeight:'85vh', display:'flex', flexDirection:'column', overflow:'hidden', background:'rgba(10,15,26,0.98)', border:`1px solid ${C.border}`, borderRadius:20, boxShadow:'0 32px 80px rgba(0,0,0,0.75)', backdropFilter:'blur(32px)' }}
            onClick={e => e.stopPropagation()}>
            
            {/* Header */}
            <div style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 24px', borderBottom:`1px solid ${C.border}` }}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:36, height:36, borderRadius:10, background:C.accentDim, border:`1px solid ${C.accentBorder}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Shield size={16} color={C.accent} />
                </div>
                <div>
                  <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:18, fontWeight:600, color:C.textPrimary }}>{content.title}</h2>
                  <p style={{ fontSize:12, color:C.textTertiary }}>Last updated {content.lastUpdated}</p>
                </div>
              </div>
              <button type="button" onClick={onClose} style={{ width:32, height:32, borderRadius:'50%', background:'transparent', border:'none', color:C.textTertiary, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'all 160ms' }}
                onMouseEnter={e => { e.currentTarget.style.background = C.elevated; e.currentTarget.style.color = C.textPrimary }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.textTertiary }}>
                <X size={18} />
              </button>
            </div>

            {/* Tabs */}
            <div style={{ flexShrink:0, display:'flex', gap:4, padding:'12px 24px', borderBottom:`1px solid rgba(30,45,69,0.5)`, overflowX:'auto' }}>
              {tabs.map(([key, policy]) => {
                const Icon = ICONS[key] || Shield
                const active = key === policyKey
                return (
                  <button key={key} type="button" onClick={() => onNavigate(key)}
                    style={{ display:'flex', alignItems:'center', gap:6, borderRadius:8, padding:'6px 12px', fontSize:12, fontWeight:500, whiteSpace:'nowrap', background: active ? 'rgba(0,212,170,0.1)' : 'transparent', color: active ? C.accent : C.textTertiary, border: `1px solid ${active ? 'rgba(0,212,170,0.2)' : 'transparent'}`, cursor:'pointer', transition:'all 160ms', fontFamily:'Inter,sans-serif' }}>
                    <Icon size={11} />
                    {policy.title}
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <div style={{ flex:1, overflowY:'auto', padding:'24px', display:'flex', flexDirection:'column', gap:24 }}>
              {content.sections.map((section, i) => (
                <motion.div key={section.heading} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.06}}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
                    <ChevronRight size={13} color={C.accent} style={{ flexShrink:0 }} />
                    <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:14, fontWeight:600, color:C.textPrimary }}>{section.heading}</h3>
                  </div>
                  <p style={{ fontSize:13, lineHeight:1.6, color:C.textSecondary, paddingLeft:21 }}>{section.body}</p>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div style={{ flexShrink:0, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 24px', borderTop:`1px solid rgba(30,45,69,0.5)` }}>
              <p style={{ fontSize:12, color:C.textTertiary }}>OptiSense HMI · ABB Accelerator 2026 · ISA-18.2</p>
              <Btn onClick={onClose}>Close</Btn>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Btn({ onClick, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button type="button" onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, fontFamily:'Inter,sans-serif', fontWeight:500, fontSize:13, borderRadius:8, padding:'8px 16px', background:'transparent', color:C.textSecondary, border:`1px solid ${C.border}`, cursor:'pointer', transition:'all 160ms', ...(hov?{borderColor:'rgba(0,212,170,0.35)', color:C.textPrimary, background:'rgba(0,212,170,0.06)'}:{}) }}>
      {children}
    </button>
  )
}
