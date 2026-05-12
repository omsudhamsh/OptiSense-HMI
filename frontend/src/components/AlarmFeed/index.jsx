import { motion, AnimatePresence } from 'framer-motion'
import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { C } from '../../styles/tokens'
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
    { label:'Active', value:activeCount, icon:AlertTriangle, color: criticalCount>0 ? C.p1 : C.textPrimary },
    { label:'Acknowledged', value:ackCount, icon:CheckCircle, color:C.accent },
    { label:'Snoozed', value:snoozedCount, icon:Clock, color:C.p3 }
  ]

  return (
    <section style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Stats */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(13,20,36,0.85)', border:`1px solid ${C.border}`, borderRadius:12, padding:'12px 16px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:20 }}>
          {stats.map(({label, value, icon:Icon, color}) => (
            <div key={label} style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Icon size={13} color={color} />
              <span style={{ fontFamily:'JetBrains Mono,monospace', fontSize:14, fontWeight:700, color }}>{value}</span>
              <span style={{ fontSize:12, color:C.textTertiary }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div className="pulse-dot" style={{ width:6, height:6, borderRadius:'50%', background:C.accent }} />
          <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.09em', textTransform:'uppercase', color:C.textTertiary }}>Live · AI Priority</span>
        </div>
      </div>

      {/* List */}
      <motion.div layout style={{ display:'flex', flexDirection:'column', gap:12 }} initial="hidden" animate="show" variants={{ show:{ transition:{ staggerChildren:0.04 }}}}>
        <AnimatePresence mode="popLayout">
          {sorted.length === 0
            ? [1,2,3,4].map(i => <div key={`sk-${i}`} className="skeleton" style={{ height: i===1?120:100, borderRadius:14 }} />)
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
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:8, padding:'8px 0' }}>
          <Activity size={12} color={C.textTertiary} />
          <p style={{ fontSize:12, color:C.textTertiary }}>
            {sorted.length} alarm{sorted.length !== 1 ? 's' : ''} · sorted by AI priority
          </p>
        </div>
      )}
    </section>
  )
}
