import { motion, AnimatePresence } from 'framer-motion'
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import AlarmCard from '../AlarmCard'

export default function AlarmFeed({ alarms, selectedAlarmId, onSelect, onAcknowledge, onSnooze, onEscalate, newAlarmIds }) {
  const activeCount = alarms.filter(a => Number(a.value) >= Number(a.threshold) && !a.snoozed_until).length
  const ackCount = alarms.filter(a => a.acknowledged).length
  const snoozedCount = alarms.filter(a => a.snoozed_until).length
  const criticalCount = alarms.filter(a => a.severity === 'CRITICAL').length

  const sorted = [...alarms].sort((a,b) => {
    if (a.ai_priority !== b.ai_priority) return a.ai_priority - b.ai_priority
    return (b.priority_score||0) - (a.priority_score||0)
  })

  const stats = [
    { label:'Active', value:activeCount, icon:AlertTriangle, colorClass: criticalCount>0 ? 'text-isa-p1' : 'text-text-primary' },
    { label:'Acknowledged', value:ackCount, icon:CheckCircle, colorClass: 'text-accent' },
    { label:'Snoozed', value:snoozedCount, icon:Clock, colorClass: 'text-isa-p3' }
  ]

  return (
    <section className="flex flex-col gap-6">
      {/* Stats Header */}
      <div className="flex items-center justify-between glass-panel-heavy rounded-2xl p-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-8 pl-2">
          {stats.map(({label, value, icon:Icon, colorClass}) => (
            <div key={label} className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-surface-elevated border border-surface-border/50 ${colorClass}`}>
                <Icon size={16} />
              </div>
              <div className="flex flex-col">
                <span className={`font-mono text-lg font-bold leading-tight ${colorClass}`}>{value}</span>
                <span className="text-xs text-text-tertiary font-medium">{label}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-lg bg-surface-base/50 border border-surface-border">
          <div className="relative flex items-center justify-center w-2 h-2">
            <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-30"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(0,212,170,0.8)] z-10"></span>
          </div>
          <span className="text-[10px] font-bold tracking-[0.1em] uppercase text-text-secondary">Live · AI Priority</span>
        </div>
      </div>

      {/* List */}
      <motion.div layout className="flex flex-col gap-3" initial="hidden" animate="show" variants={{ show:{ transition:{ staggerChildren:0.05 }}}}>
        <AnimatePresence mode="popLayout">
          {sorted.length === 0
            ? [1,2,3,4].map(i => <div key={`sk-${i}`} className={`skeleton rounded-2xl ${i===1 ? 'h-32' : 'h-24'}`} />)
            : sorted.map(alarm => (
                <AlarmCard
                  key={alarm.id}
                  alarm={alarm}
                  selected={selectedAlarmId === alarm.id}
                  onSelect={() => onSelect(alarm.id)}
                  onAcknowledge={() => onAcknowledge(alarm.id)}
                  onSnooze={min => onSnooze(alarm.id, min)}
                  onEscalate={() => onEscalate(alarm.id)}
                  isNew={newAlarmIds?.includes(alarm.id)}
                />
              ))}
        </AnimatePresence>
      </motion.div>

      {sorted.length > 0 && (
        <div className="flex items-center justify-center gap-2 py-4 opacity-60">
          <Activity size={14} className="text-text-tertiary" />
          <p className="text-xs font-medium text-text-tertiary">
            {sorted.length} alarm{sorted.length !== 1 ? 's' : ''} · sorted by AI priority
          </p>
        </div>
      )}
    </section>
  )
}
