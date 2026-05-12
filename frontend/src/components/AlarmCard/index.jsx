import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Waves } from 'lucide-react'
import { C, SEVERITY } from '../../styles/tokens'

const TREND_ICONS = { rising: ArrowUpRight, falling: ArrowDownRight, oscillating: Waves, stable: ArrowRight }
const TREND_COLORS = { rising: C.p1, falling: C.accent, oscillating: C.p3, stable: C.textTertiary }

const fmt = (v, u) => !u ? `${v}` : u==='C' ? `${v}°C` : u==='%' ? `${v}%` : `${v} ${u}`
const spark = (vals=[]) => {
  if (vals.length < 2) return ''
  const w=100, h=28, min=Math.min(...vals), max=Math.max(...vals), range=max-min||1
  return vals.map((v,i) => {
    const x = (i/(vals.length-1))*w
    const y = h - ((v-min)/range)*(h-4) - 2
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
}

export default function AlarmCard({ alarm, selected, onSelect, onAcknowledge, onSnooze, onEscalate, isNew }) {
  const [hov, setHov] = useState(false)
  const cfg = SEVERITY[alarm.severity] || SEVERITY.LOW
  const TrendIcon = TREND_ICONS[alarm.trend] || ArrowRight
  const trendColor = TREND_COLORS[alarm.trend] || C.textTertiary
  const sparkPoints = spark(alarm.history)
  const isP1 = alarm.ai_priority === 1

  return (
    <motion.article
      layout
      initial={{ opacity:0, y:8 }}
      animate={{ opacity:1, y:0 }}
      onClick={onSelect}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className={isP1 ? 'pulse-critical' : ''}
      style={{
        position:'relative',
        overflow:'hidden',
        background: C.card,
        border: `1px solid ${selected ? 'rgba(0,212,170,0.3)' : C.border}`,
        borderLeft: `3px solid ${cfg.color}`,
        borderRadius: 14,
        cursor: 'pointer',
        transition: 'all 180ms',
        transform: hov ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: selected
          ? `0 0 0 1px rgba(0,212,170,0.15), 0 8px 32px rgba(0,0,0,0.5)`
          : hov
          ? '0 6px 24px rgba(0,0,0,0.4)'
          : '0 2px 12px rgba(0,0,0,0.3)'
      }}
    >
      {/* Glow stripe */}
      <div style={{ position:'absolute', left:0, top:0, width:3, height:'100%', background:`linear-gradient(180deg, ${cfg.color}, ${cfg.color}44)`, filter: isP1 ? `drop-shadow(0 0 6px ${cfg.color})` : 'none' }} />

      {isNew && (
        <motion.span initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
          style={{ position:'absolute', right:12, top:12, background:C.accentDim, color:C.accent, border:`1px solid ${C.accentBorder}`, borderRadius:999, padding:'2px 8px', fontSize:10, fontWeight:700, letterSpacing:'0.05em' }}>
          NEW
        </motion.span>
      )}

      <div style={{ padding:'14px 16px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
          {/* Left */}
          <div style={{ display:'flex', alignItems:'flex-start', gap:12, minWidth:0 }}>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:8, flexShrink:0 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:cfg.dim, border:`1px solid ${cfg.border}`, color:cfg.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'JetBrains Mono,monospace', fontSize:12, fontWeight:700, boxShadow: isP1 ? `0 0 12px ${cfg.color}40` : 'none' }}>
                P{alarm.ai_priority}
              </div>
              <TrendIcon size={14} color={trendColor} />
            </div>
            <div style={{ minWidth:0 }}>
              <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:14, fontWeight:600, color:C.textPrimary, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                {alarm.equipment}
              </h3>
              <p style={{ fontSize:12, color:C.textSecondary, marginBottom:6, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{alarm.fault}</p>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ background:'rgba(30,45,69,0.8)', color:C.textTertiary, borderRadius:5, padding:'2px 6px', fontSize:10, fontFamily:'JetBrains Mono,monospace' }}>{alarm.location}</span>
                <span style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:C.textTertiary }}>{new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4, flexShrink:0 }}>
            <div style={{ fontFamily:'JetBrains Mono,monospace', fontSize:20, fontWeight:700, color:C.textPrimary, lineHeight:1 }}>
              {fmt(alarm.value, alarm.unit)}
            </div>
            <div style={{ fontSize:10, fontFamily:'JetBrains Mono,monospace', color:C.textTertiary }}>
              Threshold {fmt(alarm.threshold, alarm.unit)}
            </div>
            {sparkPoints && (
              <svg width="100" height="28" style={{ marginTop:4 }}>
                <defs>
                  <linearGradient id={`sp-${alarm.id}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={cfg.color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={cfg.color} stopOpacity="1" />
                  </linearGradient>
                </defs>
                <polyline points={sparkPoints} fill="none" stroke={`url(#sp-${alarm.id})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ marginTop:12, paddingTop:12, borderTop:`1px solid ${C.border}`, display:'flex', gap:6 }} onClick={e => e.stopPropagation()}>
          <Btn variant="secondary" size="sm" onClick={onAcknowledge} style={{ flex:1 }}>Acknowledge</Btn>
          <select onChange={e => e.target.value && onSnooze(Number(e.target.value))} defaultValue="" style={{ flex:1, background:C.elevated, border:`1px solid ${C.border}`, borderRadius:7, padding:'5px 24px 5px 10px', fontSize:12, color:C.textSecondary, fontFamily:'Inter,sans-serif', cursor:'pointer', appearance:'none', backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%234A5A7A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 8px center' }}>
            <option value="" disabled>Snooze…</option>
            <option value="15">15 min</option>
            <option value="60">1 hour</option>
            <option value="240">4 hours</option>
            <option value="480">Next shift</option>
          </select>
          <Btn variant="danger" size="sm" onClick={onEscalate} style={{ flex:1 }}>Escalate</Btn>
        </div>
      </div>
    </motion.article>
  )
}

function Btn({ variant='secondary', size='md', onClick, children, style={} }) {
  const [hov, setHov] = useState(false)
  const [act, setAct] = useState(false)
  const base = { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6, fontFamily:'Inter,sans-serif', fontWeight:500, fontSize: size==='sm'?12:13, lineHeight:1, borderRadius: size==='sm'?7:9, padding: size==='sm'?'5px 11px':'8px 14px', border:'1px solid transparent', transition:'all 160ms', whiteSpace:'nowrap', cursor:'pointer', minHeight: size==='sm'?28:34 }
  const v = variant==='primary' ? { background:C.accent, color:C.base, borderColor:C.accent, fontWeight:600 }
    : variant==='danger' ? { background:C.p2Dim, color:C.p2, borderColor:C.p2Border }
    : { background:'transparent', color:C.textSecondary, borderColor:C.border }
  const hovStyle = variant==='primary' ? { background:'#00BFAA', boxShadow:'0 0 20px rgba(0,212,170,0.4)', transform:'translateY(-1px)' }
    : variant==='danger' ? { background:'rgba(255,140,0,0.2)', boxShadow:'0 0 14px rgba(255,140,0,0.25)', transform:'translateY(-1px)' }
    : { borderColor:'rgba(0,212,170,0.35)', color:C.textPrimary, background:'rgba(0,212,170,0.06)', transform:'translateY(-1px)' }
  return (
    <button type="button" onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>{setHov(false);setAct(false)}} onMouseDown={()=>setAct(true)} onMouseUp={()=>setAct(false)}
      style={{ ...base, ...v, ...(hov?hovStyle:{}), ...(act?{transform:'scale(0.97)',boxShadow:'none'}:{}), ...style }}>
      {children}
    </button>
  )
}
