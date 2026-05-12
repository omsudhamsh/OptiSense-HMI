import { useEffect, useMemo, useState } from 'react'
import { Line, LineChart, ReferenceDot, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { X, Brain, TrendingUp, Sliders, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SNOOZE = [
  { value:15, label:'15 minutes' },
  { value:60, label:'1 hour' },
  { value:240, label:'4 hours' },
  { value:480, label:'Next shift' }
]

const SEVERITY_CFG = {
  CRITICAL:      { color: '#FF2D2D', borderClass: 'border-isa-p1/30', bgClass: 'bg-isa-p1/10', textClass: 'text-isa-p1' },
  HIGH:          { color: '#FF8C00', borderClass: 'border-isa-p2/30', bgClass: 'bg-isa-p2/10', textClass: 'text-isa-p2' },
  MEDIUM:        { color: '#FFD700', borderClass: 'border-isa-p3/30', bgClass: 'bg-isa-p3/10', textClass: 'text-isa-p3' },
  LOW:           { color: '#3B82F6', borderClass: 'border-isa-p4/30', bgClass: 'bg-isa-p4/10', textClass: 'text-isa-p4' },
  INFORMATIONAL: { color: '#3B82F6', borderClass: 'border-isa-p4/30', bgClass: 'bg-isa-p4/10', textClass: 'text-isa-p4' },
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-elevated/95 border border-surface-border rounded-lg px-3 py-2 text-xs backdrop-blur-md shadow-card">
      <p className="font-mono text-text-primary mb-0.5">{payload[0].value}</p>
      <p className="text-text-tertiary text-[11px]">{payload[0].payload.day}</p>
    </div>
  )
}

export default function AlarmDetail({ alarm, onClose, onAcknowledge, onSnooze, onEscalate, fetchExplanation }) {
  const [explanation, setExplanation] = useState('')
  const [loading, setLoading] = useState(false)
  const [snoozeOpen, setSnoozeOpen] = useState(false)
  const [override, setOverride] = useState('Trust AI')
  const [focus, setFocus] = useState(false)

  const cfg = SEVERITY_CFG[alarm.severity] || SEVERITY_CFG.LOW

  useEffect(() => {
    let mounted = true
    setExplanation('')
    setLoading(true)
    fetchExplanation(alarm).then(result => {
      if (mounted) {
        setExplanation(result || alarm.ai_reason || '')
        setLoading(false)
      }
    })
    return () => { mounted = false }
  }, [alarm, fetchExplanation])

  const chartData = useMemo(() => {
    const history = alarm.history || []
    const base = history.length >= 7 ? history.slice(-7) : history
    const padded = [...Array(7 - base.length).fill(base[0] || alarm.value), ...base]
    return padded.map((v, i) => ({ day:`D${i+1}`, value:Number(v) }))
  }, [alarm])

  const anomalyPoint = chartData[chartData.length - 2]
  const unitLabel = alarm.unit === 'C' ? '°C' : (alarm.unit || '')

  return (
    <div className="flex flex-col h-full font-body">
      {/* Header */}
      <div className="shrink-0 flex items-start justify-between p-6 pb-5 border-b border-surface-border">
        <div className="min-w-0 pr-3">
          <div className="flex items-center gap-2 mb-2">
            <span className={`${cfg.bgClass} ${cfg.textClass} border ${cfg.borderClass} rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase shadow-[0_0_8px_rgba(0,0,0,0.2)]`}>
              {alarm.severity}
            </span>
            <span className="bg-surface-elevated/60 text-text-tertiary border border-surface-border rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase">
              P{alarm.ai_priority}
            </span>
          </div>
          <h2 className="font-display text-lg font-bold text-text-primary leading-tight mb-1 truncate">
            {alarm.equipment}
          </h2>
          <p className="text-xs text-text-secondary truncate">{alarm.fault}</p>
        </div>
        <button type="button" onClick={onClose} className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-text-tertiary hover:bg-surface-hover hover:text-text-primary transition-colors outline-none">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5">

        {/* AI Analysis */}
        <div className="bg-accent/5 border border-accent/20 rounded-2xl p-5 shadow-[0_4px_24px_rgba(0,212,170,0.05)]">
          <div className="flex items-center gap-2 mb-3">
            <Brain size={14} className="text-accent" />
            <p className="text-[11px] font-bold tracking-widest uppercase text-accent">AI Analysis</p>
            <span className="ml-auto font-mono text-[10px] text-accent/70">
              {Math.round(alarm.ai_confidence * 100)}% confidence
            </span>
          </div>

          <div className="min-h-[60px] text-[13px] leading-relaxed text-text-secondary font-medium">
            {loading ? (
              <div className="flex flex-col gap-2.5">
                <div className="skeleton h-3.5 rounded" />
                <div className="skeleton h-3.5 rounded w-[85%]" />
                <div className="skeleton h-3.5 rounded w-[75%]" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.p key={explanation} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.3}}>
                  {explanation || alarm.ai_reason}
                </motion.p>
              </AnimatePresence>
            )}
          </div>

          <div className="mt-4 h-1 w-full rounded-full bg-surface-elevated overflow-hidden relative">
            <motion.div className="h-full rounded-full bg-gradient-to-r from-accent to-blue-400 absolute left-0 top-0 shadow-[0_0_8px_rgba(0,212,170,0.5)]"
              initial={{ width:0 }}
              animate={{ width:`${Math.round(alarm.ai_confidence * 100)}%` }}
              transition={{ duration:0.8, ease:'easeOut', delay:0.2 }}
            />
          </div>
        </div>

        {/* Live Value */}
        <div className="glass-panel rounded-2xl p-5">
          <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary mb-3">Live Value</p>
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-4xl font-bold tracking-tight" style={{ color: cfg.color }}>
              {alarm.value}
            </span>
            <span className="text-lg text-text-secondary font-medium">{unitLabel}</span>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-1.5 rounded-full bg-surface-elevated overflow-hidden border border-surface-border">
              <div className="h-full rounded-full" style={{ width: `${Math.min((Number(alarm.value) / (Number(alarm.threshold) * 1.5)) * 100, 100)}%`, background: `linear-gradient(90deg, var(--color-accent), ${cfg.color})` }} />
            </div>
            <span className="font-mono text-[11px] text-text-tertiary shrink-0 font-medium">
              Threshold {alarm.threshold}{unitLabel}
            </span>
          </div>
        </div>

        {/* 7-Day Trend */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={14} className="text-text-tertiary" />
            <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary">7-Day Trend</p>
          </div>
          <div className="h-44 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top:8, right:8, left:-10, bottom:0 }}>
                <XAxis dataKey="day" stroke="var(--color-text-tertiary)" tickLine={false} axisLine={false} tick={{ fontSize:10, fontFamily:'var(--font-mono)' }} dy={5} />
                <YAxis stroke="var(--color-text-tertiary)" tickLine={false} axisLine={false} tick={{ fontSize:10, fontFamily:'var(--font-mono)' }} dx={-5} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--color-surface-border)', strokeWidth: 2 }} />
                <ReferenceLine y={alarm.threshold} stroke={cfg.color} strokeDasharray="4 4" strokeOpacity={0.6} />
                {anomalyPoint && <ReferenceDot x={anomalyPoint.day} y={anomalyPoint.value} r={5} fill={cfg.color} stroke="var(--color-surface-base)" strokeWidth={2} />}
                <Line type="monotone" dataKey="value" stroke="var(--color-accent)" strokeWidth={2.5} dot={false} animationDuration={900} animationEasing="ease-out" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Settings */}
        <div className="glass-panel rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Sliders size={14} className="text-text-tertiary" />
            <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary">Alert Settings</p>
          </div>

          <div className="flex flex-col gap-5">
            {/* Threshold */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-text-secondary font-medium">Custom threshold</p>
                <span className="font-mono text-xs text-text-tertiary bg-surface-elevated px-2 py-0.5 rounded border border-surface-border">{alarm.threshold}{unitLabel}</span>
              </div>
              <input type="range" min={0} max={alarm.threshold * 1.5} defaultValue={alarm.threshold} className="w-full accent-accent h-1.5 bg-surface-elevated rounded-lg appearance-none cursor-pointer" />
            </div>

            {/* Focus mode */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-text-secondary">Focus Mode</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">Suppress lower-priority alarms</p>
              </div>
              <button type="button" onClick={() => setFocus(v => !v)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out outline-none ${focus ? 'bg-accent border-accent' : 'bg-surface-elevated border-surface-border'} border`}>
                <span className={`absolute top-[1px] w-5 h-5 rounded-full transition-all duration-200 ease-in-out shadow-sm ${focus ? 'left-[calc(100%-21px)] bg-surface-base' : 'left-[1px] bg-text-tertiary'}`} />
              </button>
            </div>

            {/* Priority override */}
            <div>
              <p className="text-xs text-text-secondary font-medium mb-2.5">Priority override</p>
              <div className="flex gap-2">
                {['Trust AI', 'Always First', 'Suppress'].map(label => (
                  <button key={label} type="button" onClick={() => setOverride(label)}
                    className={`flex-1 rounded-lg py-2 text-xs font-medium transition-all duration-200 outline-none
                      ${override === label 
                        ? 'bg-accent/10 border-accent/30 text-accent shadow-[0_0_12px_rgba(0,212,170,0.1)]' 
                        : 'bg-surface-elevated/50 border-surface-border text-text-tertiary hover:bg-surface-hover hover:text-text-secondary'} border`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 p-5 pt-4 border-t border-surface-border bg-surface-base/80 backdrop-blur-xl flex flex-col gap-3">
        <button type="button" onClick={onAcknowledge} className="w-full inline-flex items-center justify-center gap-2 font-body font-semibold text-sm rounded-xl px-4 py-3 bg-accent text-surface-base border border-accent hover:shadow-[0_0_24px_rgba(0,212,170,0.4)] hover:-translate-y-0.5 transition-all outline-none active:scale-95">
          Acknowledge Alarm
        </button>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <button type="button" onClick={() => setSnoozeOpen(v => !v)} className="w-full inline-flex items-center justify-between font-body font-medium text-sm rounded-xl px-4 py-3 bg-transparent text-text-secondary border border-surface-border hover:bg-surface-elevated hover:text-text-primary transition-colors outline-none">
              Snooze
              <ChevronDown size={16} className={`transition-transform duration-200 ${snoozeOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {snoozeOpen && (
                <motion.div initial={{opacity:0,y:-8,scale:0.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:-4,scale:0.98}}
                  className="absolute bottom-[calc(100%+8px)] left-0 right-0 bg-surface-elevated/95 border border-surface-border rounded-xl overflow-hidden z-20 backdrop-blur-xl shadow-card-hover p-1">
                  {SNOOZE.map(({value, label}) => (
                    <button key={value} type="button" onClick={() => { onSnooze(value); setSnoozeOpen(false) }}
                      className="w-full px-4 py-2.5 text-left text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary rounded-lg transition-colors outline-none">
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button type="button" onClick={onEscalate} className="flex-1 inline-flex items-center justify-center gap-2 font-body font-medium text-sm rounded-xl px-4 py-3 bg-isa-p2/10 text-isa-p2 border border-isa-p2/30 hover:bg-isa-p2/20 hover:shadow-[0_0_16px_rgba(255,140,0,0.25)] hover:-translate-y-0.5 transition-all active:scale-95 outline-none">
            Escalate
          </button>
        </div>
      </div>
    </div>
  )
}
