import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowRight, ArrowUpRight, Waves } from 'lucide-react'

const TREND_ICONS = { rising: ArrowUpRight, falling: ArrowDownRight, oscillating: Waves, stable: ArrowRight }
const TREND_COLORS = { rising: 'text-isa-p1', falling: 'text-accent', oscillating: 'text-isa-p3', stable: 'text-text-tertiary' }
const SEVERITY_CFG = {
  CRITICAL:      { color: '#FF2D2D', borderClass: 'border-isa-p1/30', bgClass: 'bg-isa-p1/10', textClass: 'text-isa-p1', shadowClass: 'shadow-[0_0_12px_rgba(255,45,45,0.25)]' },
  HIGH:          { color: '#FF8C00', borderClass: 'border-isa-p2/30', bgClass: 'bg-isa-p2/10', textClass: 'text-isa-p2', shadowClass: 'shadow-none' },
  MEDIUM:        { color: '#FFD700', borderClass: 'border-isa-p3/30', bgClass: 'bg-isa-p3/10', textClass: 'text-isa-p3', shadowClass: 'shadow-none' },
  LOW:           { color: '#3B82F6', borderClass: 'border-isa-p4/30', bgClass: 'bg-isa-p4/10', textClass: 'text-isa-p4', shadowClass: 'shadow-none' },
  INFORMATIONAL: { color: '#3B82F6', borderClass: 'border-isa-p4/30', bgClass: 'bg-isa-p4/10', textClass: 'text-isa-p4', shadowClass: 'shadow-none' },
}

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
  const cfg = SEVERITY_CFG[alarm.severity] || SEVERITY_CFG.LOW
  const TrendIcon = TREND_ICONS[alarm.trend] || ArrowRight
  const trendColorClass = TREND_COLORS[alarm.trend] || 'text-text-tertiary'
  const sparkPoints = spark(alarm.history)
  const isP1 = alarm.ai_priority === 1

  return (
    <motion.article
      layout
      initial={{ opacity:0, y:8 }}
      animate={{ opacity:1, y:0 }}
      onClick={onSelect}
      className={`relative overflow-hidden bg-surface-card rounded-2xl cursor-pointer transition-all duration-300 group
        ${isP1 ? 'pulse-critical' : ''}
        ${selected ? 'border-accent/30 shadow-[0_0_0_1px_rgba(0,212,170,0.15),0_12px_40px_rgba(0,0,0,0.6)] -translate-y-1' : 'border-surface-border shadow-card hover:shadow-card-hover hover:-translate-y-1'}`}
      style={{
        borderWidth: '1px',
        borderLeftWidth: '3px',
        borderLeftColor: cfg.color
      }}
    >
      {/* Glow stripe */}
      <div className={`absolute left-0 top-0 w-[3px] h-full ${isP1 ? 'drop-shadow-[0_0_8px_var(--color-isa-p1)]' : ''}`} style={{ background: `linear-gradient(180deg, ${cfg.color}, ${cfg.color}44)` }} />

      {isNew && (
        <motion.span initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
          className="absolute right-3 top-3 bg-accent/10 text-accent border border-accent/20 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-widest">
          NEW
        </motion.span>
      )}

      <div className="p-4 pl-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left */}
          <div className="flex items-start gap-4 min-w-0">
            <div className="flex flex-col items-center gap-2 shrink-0 pt-1">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono text-xs font-bold ${cfg.bgClass} ${cfg.borderClass} ${cfg.textClass} border ${cfg.shadowClass}`}>
                P{alarm.ai_priority}
              </div>
              <TrendIcon size={16} className={trendColorClass} />
            </div>
            <div className="min-w-0 flex flex-col justify-center pt-0.5">
              <h3 className="font-display text-[15px] font-bold text-text-primary mb-1 truncate">
                {alarm.equipment}
              </h3>
              <p className="text-sm text-text-secondary mb-2 truncate">{alarm.fault}</p>
              <div className="flex items-center gap-2 mt-auto">
                <span className="bg-surface-elevated/80 text-text-tertiary rounded p-1 px-2 text-[10px] font-mono border border-surface-border">{alarm.location}</span>
                <span className="text-[10px] font-mono text-text-tertiary">{new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex flex-col items-end gap-1 shrink-0 pt-1">
            <div className="font-mono text-[22px] font-bold text-text-primary leading-none tracking-tight">
              {fmt(alarm.value, alarm.unit)}
            </div>
            <div className="text-[10px] font-mono text-text-tertiary mt-1">
              Threshold {fmt(alarm.threshold, alarm.unit)}
            </div>
            {sparkPoints && (
              <svg width="100" height="28" className="mt-2 drop-shadow-md">
                <defs>
                  <linearGradient id={`sp-${alarm.id}`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor={cfg.color} stopOpacity="0.2" />
                    <stop offset="100%" stopColor={cfg.color} stopOpacity="1" />
                  </linearGradient>
                </defs>
                <polyline points={sparkPoints} fill="none" stroke={`url(#sp-${alarm.id})`} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-surface-border/60 flex gap-2" onClick={e => e.stopPropagation()}>
          <button type="button" onClick={onAcknowledge} className="flex-1 inline-flex items-center justify-center gap-2 font-body font-medium text-xs rounded-lg px-3 py-2 border bg-transparent text-text-secondary border-surface-border hover:bg-surface-elevated hover:text-text-primary transition-colors active:scale-95 outline-none">
            Acknowledge
          </button>
          
          <select onChange={e => e.target.value && onSnooze(Number(e.target.value))} defaultValue="" className="flex-1 bg-surface-elevated border border-surface-border rounded-lg px-3 py-2 text-xs text-text-secondary font-body cursor-pointer appearance-none outline-none hover:bg-surface-hover hover:text-text-primary transition-colors" style={{ backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238B9CC8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 10px center' }}>
            <option value="" disabled>Snooze…</option>
            <option value="15">15 min</option>
            <option value="60">1 hour</option>
            <option value="240">4 hours</option>
            <option value="480">Next shift</option>
          </select>
          
          <button type="button" onClick={onEscalate} className="flex-1 inline-flex items-center justify-center gap-2 font-body font-medium text-xs rounded-lg px-3 py-2 border bg-isa-p2/10 text-isa-p2 border-isa-p2/30 hover:bg-isa-p2/20 hover:shadow-[0_0_14px_rgba(255,140,0,0.25)] transition-all active:scale-95 outline-none">
            Escalate
          </button>
        </div>
      </div>
    </motion.article>
  )
}
