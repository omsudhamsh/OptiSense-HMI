import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Bot, Server, Radio, Package } from 'lucide-react'
import { C } from '../../styles/tokens'

const ICONS = { drive:Cpu, plc:Server, robot:Bot, sensor:Radio }
const COLORS = { drive:C.p2, plc:C.p4, robot:C.p3, sensor:'#A78BFA' }

export default function TemplateLibrary() {
  const [templates, setTemplates] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('http://localhost:5000/api/templates')
      .then(r => r.json())
      .then(data => { if (mounted) setTemplates(data) })
      .catch(() => { if (mounted) setTemplates({}) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const entries = Object.entries(templates)

  return (
    <section style={{display:'flex',flexDirection:'column',gap:20}}>
      <div>
        <h2 style={{fontFamily:'Space Grotesk,sans-serif',fontSize:20,fontWeight:700,color:C.textPrimary}}>Equipment Registry</h2>
        <p style={{fontSize:14,color:C.textSecondary,marginTop:4}}>Templates auto-map signals and thresholds for rapid onboarding</p>
      </div>

      {loading ? (
        <div style={{display:'grid',gap:16,gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))'}}>
          {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{height:160,borderRadius:18}} />)}
        </div>
      ) : entries.length === 0 ? (
        <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',background:'rgba(13,20,36,0.6)',border:`1px solid ${C.border}`,borderRadius:18,padding:'64px 24px'}}>
          <Package size={32} color={C.textTertiary} style={{marginBottom:12}} />
          <p style={{fontSize:14,color:C.textSecondary}}>No templates available</p>
          <p style={{fontSize:12,color:C.textTertiary,marginTop:4}}>Connect to backend to load equipment templates</p>
        </div>
      ) : (
        <div style={{display:'grid',gap:16,gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))'}}>
          {entries.map(([key, template], i) => {
            const Icon = ICONS[key] || Package
            const color = COLORS[key] || C.accent
            const [hov, setHov] = useState(false)
            return (
              <motion.div key={key} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
                style={{background:'rgba(13,20,36,0.85)',border:`1px solid ${hov ? `${color}40` : C.border}`,borderRadius:18,padding:20,transition:'all 180ms',transform: hov ? 'translateY(-2px)' : 'translateY(0)',boxShadow: hov ? `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color}20` : 'none'}}>
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:16}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:40,height:40,borderRadius:10,background:`${color}18`,border:`1px solid ${color}30`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <Icon size={18} color={color} />
                    </div>
                    <div>
                      <h4 style={{fontFamily:'Space Grotesk,sans-serif',fontSize:16,fontWeight:600,color:C.textPrimary}}>{template.label}</h4>
                      <p style={{fontSize:12,color:C.textTertiary}}>{template.monitoring_points} monitoring points</p>
                    </div>
                  </div>
                  <span style={{background:`${color}15`,color,border:`1px solid ${color}30`,borderRadius:999,padding:'2px 8px',fontSize:10,fontWeight:700,letterSpacing:'0.05em',textTransform:'uppercase'}}>
                    {template.signals?.length || 0} signals
                  </span>
                </div>

                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {(template.signals || []).map(signal => (
                    <span key={signal} style={{background:'rgba(30,45,69,0.5)',border:`1px solid ${C.border}`,borderRadius:8,padding:'4px 10px',fontSize:12,color:C.textSecondary}}>
                      {signal}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </section>
  )
}
