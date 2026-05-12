import { useEffect, useMemo, useState } from 'react'
import { motion, useSpring } from 'framer-motion'
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react'

const SCORE_CFG = [
  { min:80, color:'var(--color-accent)', textClass:'text-accent', label:'Excellent' },
  { min:60, color:'var(--color-isa-p3)', textClass:'text-isa-p3', label:'Good' },
  { min:40, color:'var(--color-isa-p2)', textClass:'text-isa-p2', label:'Warning' },
  { min:0, color:'var(--color-isa-p1)', textClass:'text-isa-p1', label:'Critical' }
]
const STATUS_CFG = {
  ok:       { colorClass:'text-accent', bgClass:'bg-accent/10', borderClass:'border-accent/30', icon:TrendingUp },
  warning:  { colorClass:'text-isa-p3', bgClass:'bg-isa-p3/10', borderClass:'border-isa-p3/30', icon:Minus },
  critical: { colorClass:'text-isa-p1', bgClass:'bg-isa-p1/10', borderClass:'border-isa-p1/30', icon:TrendingDown }
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
      <div className="flex items-center gap-3 bg-surface-elevated/50 border border-surface-border/50 rounded-xl px-3 py-2 shadow-inner">
        <div className="relative w-11 h-11 shrink-0">
          <svg width="44" height="44" className="-rotate-90">
            <circle cx="22" cy="22" r="20" stroke="var(--color-surface-border)" strokeWidth="4" fill="none" />
            <motion.circle cx="22" cy="22" r="20" stroke={cfg.color} strokeWidth="4" fill="none" strokeLinecap="round"
              initial={{ strokeDasharray:`0 ${circ}` }}
              animate={{ strokeDasharray:`${dash} ${circ-dash}` }}
              transition={{ duration:1, ease:'easeOut' }}
              style={{ filter:`drop-shadow(0 0 6px ${cfg.color}60)` }}
            />
          </svg>
          <span className={`absolute inset-0 flex items-center justify-center font-mono text-[13px] font-bold ${cfg.textClass}`}>
            {scoreDisplay}
          </span>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[10px] font-bold tracking-widest uppercase text-text-tertiary">Alarm Health</p>
          <p className="text-xs text-text-secondary mt-0.5 font-medium">ISA-18.2 · Grade {grade}</p>
        </div>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-6">
      {/* Hero */}
      <div className="glass-panel-heavy rounded-3xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase text-text-tertiary mb-3">System Health Score</p>
            <div className="flex items-baseline gap-2">
              <motion.span className={`font-display text-6xl font-bold tracking-tight ${cfg.textClass} drop-shadow-[0_0_16px_currentColor]`}>
                {scoreDisplay}
              </motion.span>
              <span className="text-2xl text-text-tertiary font-medium">/100</span>
            </div>
            <p className="text-sm text-text-secondary mt-2 font-medium">{cfg.label} · ISA-18.2</p>
          </div>

          <div className="relative w-28 h-28">
            <svg width="112" height="112" className="-rotate-90">
              <circle cx="56" cy="56" r="48" stroke="var(--color-surface-border)" strokeWidth="10" fill="none" className="opacity-50" />
              <motion.circle cx="56" cy="56" r="48" stroke={cfg.color} strokeWidth="10" fill="none" strokeLinecap="round"
                initial={{ strokeDasharray:`0 ${2*Math.PI*48}` }}
                animate={{ strokeDasharray:`${(score/100)*2*Math.PI*48} ${(1-score/100)*2*Math.PI*48}` }}
                transition={{ duration:1.2, ease:'easeOut' }}
                style={{ filter:`drop-shadow(0 0 12px ${cfg.color}80)` }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-display text-3xl font-bold ${cfg.textClass} drop-shadow-[0_0_8px_currentColor]`}>{grade}</span>
              <span className="text-[11px] text-text-tertiary font-medium">Grade</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4">
        {kpis.map((kpi, i) => {
          const s = STATUS_CFG[kpi.status] || STATUS_CFG.ok
          const Icon = s.icon
          return (
            <motion.div key={kpi.label} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              className="glass-panel rounded-2xl p-5 hover:bg-surface-elevated/70 transition-colors">
              <div className="flex items-start justify-between mb-4">
                <p className="text-[13px] text-text-secondary font-medium leading-snug">{kpi.label}</p>
                <span className={`flex items-center gap-1.5 ${s.bgClass} ${s.colorClass} border ${s.borderClass} rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase`}>
                  <Icon size={10} />
                  {kpi.status}
                </span>
              </div>
              <p className="font-mono text-2xl font-bold text-text-primary tracking-tight">{kpi.value}</p>
              <p className="text-[11px] text-text-tertiary mt-1 font-medium">Target: {kpi.target}</p>
              <div className="mt-4 h-1.5 w-full rounded-full bg-surface-base border border-surface-border overflow-hidden">
                <motion.div className="h-full rounded-full bg-current shadow-[0_0_8px_currentColor]" style={{ color: s.colorClass.replace('text-', 'var(--color-') + ')' }}
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
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={14} className="text-accent" />
            <p className="text-[11px] font-bold tracking-widest uppercase text-accent">AI Recommendations</p>
          </div>
          <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
            {healthScore.recommendations.map((item, i) => (
              <motion.li key={item} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.05}}
                className="flex items-start gap-3 text-sm text-text-secondary font-medium">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0 shadow-[0_0_8px_rgba(0,212,170,0.8)]" />
                {item}
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
