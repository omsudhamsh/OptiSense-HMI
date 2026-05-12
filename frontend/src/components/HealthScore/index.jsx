import { useEffect, useMemo, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { C } from '../../styles/tokens'

const SCORE_CFG = [
  { min:80, color:C.accent, label:'Excellent' },
  { min:60, color:C.p3, label:'Good' },
  { min:40, color:C.p2, label:'Warning' },
  { min:0, color:C.p1, label:'Critical' }
]
const STATUS_CFG = {
  ok:       { color:C.accent, bg:C.accentDim, border:C.accentBorder, icon:TrendingUp },
  warning:  { color:C.p3, bg:C.p3Dim, border:C.p3Border, icon:Minus },
  critical: { color:C.p1, bg:C.p1Dim, border:C.p1Border, icon:TrendingDown }
}

function useAnimNum(target, precision=0) {
  const spring = useSpring(target, { stiffness:100, damping:20 })
  const [display, setDisplay] = useState(target)
  useEffect(() => { spring.set(target) }, [spring, target])
  useEffect(() => spring.on('change', v => setDisplay(precision===0 ? Math.round(v) : Number(v.toFixed(precision)))), [spring, precision])
  return display
}

export default function HealthScore({ variant='compact', healthScore }) {
  const score = healthScore?.overall_score ?? 0
  const grade = healthScore?.grade ?? '—'
  const scoreDisplay = useAnimNum(score)
  const cfg = SCORE_CFG.find(r => score >= r.min) || SCORE_CFG[3]
  const circ = 2 * Math.PI * 20
  const dash = (score / 100) * circ

  const kpis = useMemo(() => [
    { label:'Alarm Rate / hr', value:healthScore?.alarm_rate??0, target:'≤ 6', status:healthScore?.alarm_rate_status??'ok', progress:Math.min(((healthScore?.alarm_rate??0)/6)*100,100) },
    { label:'Chattering Alarms', value:healthScore?.chattering_count??0, target:'0', status:healthScore?.chattering_status??'ok', progress:Math.min(((healthScore?.chattering_count??0)/5)*100,100) },
    { label:'Suppression Ratio', value:`${healthScore?.suppression_ratio??0}%`, target:'< 5%', status:healthScore?.suppression_status??'ok', progress:Math.min(((healthScore?.suppression_ratio??0)/5)*100,100) },
    { label:'P1 / P2 / P3 Ratio', value:`${healthScore?.priority_distribution?.P1??0} / ${healthScore?.priority_distribution?.P2??0} / ${healthScore?.priority_distribution?.P3??0}`, target:'5/15/30%', status:'ok', progress:60 }
  ], [healthScore])

  if (variant === 'compact') {
    return (
      <div style={{ display:'flex', alignItems:'center', gap:12, background:'rgba(18,27,46,0.8)', border:`1px solid ${C.border}`, borderRadius:12, padding:'10px 12px' }}>
        <div style={{ position:'relative', width:44, height:44, flexShrink:0 }}>
          <svg width="44" height="44" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="22" cy="22" r="20" stroke="rgba(30,45,69,0.8)" strokeWidth="4" fill="none" />
            <motion.circle cx="22" cy="22" r="20" stroke={cfg.color} strokeWidth="4" fill="none" strokeLinecap="round"
              initial={{ strokeDasharray:`0 ${circ}` }}
              animate={{ strokeDasharray:`${dash} ${circ-dash}` }}
              transition={{ duration:1, ease:'easeOut' }}
              style={{ filter:`drop-shadow(0 0 6px ${cfg.color}60)` }}
            />
          </svg>
          <span style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'JetBrains Mono,monospace', fontSize:12, fontWeight:700, color:cfg.color }}>
            {scoreDisplay}
          </span>
        </div>
        <div>
          <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.09em', textTransform:'uppercase', color:C.textTertiary }}>Alarm Health</p>
          <p style={{ fontSize:12, color:C.textSecondary, marginTop:2 }}>ISA-18.2 · Grade {grade}</p>
        </div>
      </div>
    )
  }

  return (
    <section style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Hero */}
      <div style={{ background:'rgba(13,20,36,0.85)', border:`1px solid ${C.border}`, borderRadius:18, padding:24 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div>
            <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.09em', textTransform:'uppercase', color:C.textTertiary, marginBottom:8 }}>System Health Score</p>
            <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
              <motion.span style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:48, fontWeight:700, color:cfg.color }}>
                {scoreDisplay}
              </motion.span>
              <span style={{ fontSize:20, color:C.textTertiary }}>/100</span>
            </div>
            <p style={{ fontSize:14, color:C.textSecondary, marginTop:4 }}>{cfg.label} · ISA-18.2</p>
          </div>

          <div style={{ position:'relative', width:96, height:96 }}>
            <svg width="96" height="96" style={{ transform:'rotate(-90deg)' }}>
              <circle cx="48" cy="48" r="40" stroke="rgba(30,45,69,0.6)" strokeWidth="8" fill="none" />
              <motion.circle cx="48" cy="48" r="40" stroke={cfg.color} strokeWidth="8" fill="none" strokeLinecap="round"
                initial={{ strokeDasharray:`0 ${2*Math.PI*40}` }}
                animate={{ strokeDasharray:`${(score/100)*2*Math.PI*40} ${(1-score/100)*2*Math.PI*40}` }}
                transition={{ duration:1.2, ease:'easeOut' }}
                style={{ filter:`drop-shadow(0 0 10px ${cfg.color}50)` }}
              />
            </svg>
            <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
              <span style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:28, fontWeight:700, color:cfg.color }}>{grade}</span>
              <span style={{ fontSize:10, color:C.textTertiary }}>Grade</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        {kpis.map((kpi, i) => {
          const s = STATUS_CFG[kpi.status] || STATUS_CFG.ok
          const Icon = s.icon
          return (
            <motion.div key={kpi.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              style={{ background:'rgba(13,20,36,0.85)', border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                <p style={{ fontSize:12, color:C.textSecondary, lineHeight:1.3 }}>{kpi.label}</p>
                <span style={{ display:'flex', alignItems:'center', gap:4, background:s.bg, color:s.color, border:`1px solid ${s.border}`, borderRadius:999, padding:'2px 8px', fontSize:10, fontWeight:700, letterSpacing:'0.05em', textTransform:'uppercase' }}>
                  <Icon size={9} />
                  {kpi.status}
                </span>
              </div>
              <p style={{ fontFamily:'JetBrains Mono,monospace', fontSize:20, fontWeight:700, color:C.textPrimary }}>{kpi.value}</p>
              <p style={{ fontSize:10, color:C.textTertiary, marginTop:2 }}>Target: {kpi.target}</p>
              <div style={{ marginTop:12, height:4, width:'100%', borderRadius:999, background:'rgba(30,45,69,0.8)', overflow:'hidden' }}>
                <motion.div style={{ height:'100%', borderRadius:999, background:s.color }}
                  initial={{ width:0 }}
                  animate={{ width:`${kpi.progress}%` }}
                  transition={{ duration:0.8, delay:i*0.07, ease:'easeOut' }}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recommendations */}
      {(healthScore?.recommendations||[]).length > 0 && (
        <div style={{ background:'rgba(13,20,36,0.85)', border:`1px solid ${C.border}`, borderRadius:14, padding:16 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
            <Activity size={13} color={C.accent} />
            <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.09em', textTransform:'uppercase', color:C.textTertiary }}>AI Recommendations</p>
          </div>
          <ul style={{ display:'flex', flexDirection:'column', gap:8, listStyle:'none', padding:0, margin:0 }}>
            {healthScore.recommendations.map((item, i) => (
              <motion.li key={item} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                style={{ display:'flex', alignItems:'flex-start', gap:10, fontSize:13, color:C.textSecondary }}>
                <span style={{ marginTop:6, width:6, height:6, borderRadius:'50%', background:C.accent, flexShrink:0 }} />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
