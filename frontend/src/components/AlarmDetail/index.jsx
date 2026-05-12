import { useEffect, useMemo, useState } from 'react'
import {
  Line, LineChart, ReferenceDot, ReferenceLine,
  ResponsiveContainer, Tooltip, XAxis, YAxis
} from 'recharts'
import { X, Brain, TrendingUp, Sliders, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const SEVERITY_CONFIG = {
  CRITICAL:      { color: '#FF2D2D', bg: 'rgba(255,45,45,0.1)',   border: 'rgba(255,45,45,0.25)'   },
  HIGH:          { color: '#FF8C00', bg: 'rgba(255,140,0,0.1)',   border: 'rgba(255,140,0,0.25)'   },
  MEDIUM:        { color: '#FFD700', bg: 'rgba(255,215,0,0.1)',   border: 'rgba(255,215,0,0.25)'   },
  LOW:           { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)'  },
  INFORMATIONAL: { color: '#3B82F6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)'  }
}

const SNOOZE_OPTIONS = [
  { value: 15,  label: '15 minutes' },
  { value: 60,  label: '1 hour' },
  { value: 240, label: '4 hours' },
  { value: 480, label: 'Next shift' }
]

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs"
      style={{
        background: 'rgba(18,27,46,0.97)',
        border: '1px solid rgba(30,45,69,0.9)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <p className="font-mono text-text-primary">{payload[0].value}</p>
      <p className="text-text-tertiary">{payload[0].payload.day}</p>
    </div>
  )
}

export default function AlarmDetail({
  alarm, onClose, onAcknowledge, onSnooze, onEscalate, fetchExplanation
}) {
  const [explanation,        setExplanation]        = useState('')
  const [loadingExplanation, setLoadingExplanation] = useState(false)
  const [snoozeOpen,         setSnoozeOpen]         = useState(false)
  const [overrideMode,       setOverrideMode]       = useState('Trust AI')
  const [focusMode,          setFocusMode]          = useState(false)

  const cfg = SEVERITY_CONFIG[alarm.severity] || SEVERITY_CONFIG.LOW

  useEffect(() => {
    let mounted = true
    setExplanation('')
    setLoadingExplanation(true)
    fetchExplanation(alarm).then((result) => {
      if (mounted) {
        setExplanation(result || alarm.ai_reason || '')
        setLoadingExplanation(false)
      }
    })
    return () => { mounted = false }
  }, [alarm, fetchExplanation])

  const chartData = useMemo(() => {
    const history = alarm.history || []
    const base    = history.length >= 7 ? history.slice(-7) : history
    const padded  = [...Array(7 - base.length).fill(base[0] || alarm.value), ...base]
    return padded.map((v, i) => ({ day: `D${i + 1}`, value: Number(v) }))
  }, [alarm])

  const anomalyPoint = chartData[chartData.length - 2]
  const unitLabel    = alarm.unit === 'C' ? '°C' : (alarm.unit || '')

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div
        className="flex flex-shrink-0 items-start justify-between px-5 py-5"
        style={{ borderBottom: '1px solid rgba(30,45,69,0.7)' }}
      >
        <div className="min-w-0 pr-3">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="badge text-[10px]"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            >
              {alarm.severity}
            </span>
            <span
              className="badge text-[10px]"
              style={{ background: 'rgba(30,45,69,0.6)', color: 'var(--text-tertiary)', border: '1px solid rgba(30,45,69,0.8)' }}
            >
              P{alarm.ai_priority}
            </span>
          </div>
          <h2 className="font-display text-base font-semibold text-text-primary leading-tight">
            {alarm.equipment}
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">{alarm.fault}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="btn btn-ghost flex-shrink-0"
          aria-label="Close detail panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

        {/* AI Analysis */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain size={13} style={{ color: 'var(--accent)' }} />
            <p className="section-label" style={{ color: 'var(--accent)' }}>AI Analysis</p>
            <span
              className="ml-auto font-mono text-[10px]"
              style={{ color: 'var(--accent)', opacity: 0.7 }}
            >
              {Math.round(alarm.ai_confidence * 100)}% confidence
            </span>
          </div>

          <div className="min-h-[60px] text-sm leading-relaxed text-text-secondary">
            {loadingExplanation ? (
              <div className="space-y-2">
                <div className="skeleton h-3.5 rounded w-full" />
                <div className="skeleton h-3.5 rounded w-5/6" />
                <div className="skeleton h-3.5 rounded w-3/4" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.p
                  key={explanation}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {explanation || alarm.ai_reason}
                </motion.p>
              </AnimatePresence>
            )}
          </div>

          {/* Confidence bar */}
          <div className="mt-3">
            <div
              className="h-1 w-full rounded-full overflow-hidden"
              style={{ background: 'rgba(30,45,69,0.8)' }}
            >
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'var(--accent)' }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.round(alarm.ai_confidence * 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>

        {/* Live Value */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(13,20,36,0.8)', border: '1px solid rgba(30,45,69,0.7)' }}
        >
          <p className="section-label mb-3">Live Value</p>
          <div className="flex items-baseline gap-2">
            <span
              className="font-mono text-4xl font-semibold"
              style={{ color: cfg.color }}
            >
              {alarm.value}
            </span>
            <span className="text-lg text-text-secondary">{unitLabel}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div
              className="h-1 flex-1 rounded-full overflow-hidden"
              style={{ background: 'rgba(30,45,69,0.8)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min((Number(alarm.value) / (Number(alarm.threshold) * 1.5)) * 100, 100)}%`,
                  background: `linear-gradient(90deg, var(--accent), ${cfg.color})`
                }}
              />
            </div>
            <span className="font-mono text-[10px] text-text-tertiary flex-shrink-0">
              Threshold {alarm.threshold}{unitLabel}
            </span>
          </div>
        </div>

        {/* 7-Day Trend */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(13,20,36,0.8)', border: '1px solid rgba(30,45,69,0.7)' }}
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={13} className="text-text-tertiary" />
            <p className="section-label">7-Day Trend</p>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="day"
                  stroke="#4A5A7A"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <YAxis
                  stroke="#4A5A7A"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={alarm.threshold}
                  stroke={cfg.color}
                  strokeDasharray="4 3"
                  strokeOpacity={0.6}
                />
                {anomalyPoint && (
                  <ReferenceDot
                    x={anomalyPoint.day}
                    y={anomalyPoint.value}
                    r={5}
                    fill={cfg.color}
                    stroke="rgba(8,12,24,0.8)"
                    strokeWidth={2}
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--accent)"
                  strokeWidth={2}
                  dot={false}
                  animationDuration={900}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alert Settings */}
        <div
          className="rounded-xl p-4"
          style={{ background: 'rgba(13,20,36,0.8)', border: '1px solid rgba(30,45,69,0.7)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sliders size={13} className="text-text-tertiary" />
            <p className="section-label">Alert Settings</p>
          </div>

          <div className="space-y-4">
            {/* Threshold slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs text-text-secondary">Custom threshold</p>
                <span className="font-mono text-xs text-text-tertiary">{alarm.threshold}{unitLabel}</span>
              </div>
              <input
                type="range"
                min={0}
                max={alarm.threshold * 1.5}
                defaultValue={alarm.threshold}
                className="w-full"
                aria-label="Custom threshold"
              />
            </div>

            {/* Focus mode */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-secondary">Focus Mode</p>
                <p className="text-[10px] text-text-tertiary">Suppress lower-priority alarms</p>
              </div>
              <button
                type="button"
                onClick={() => setFocusMode((v) => !v)}
                className="relative h-6 w-11 rounded-full transition-all"
                style={{
                  background: focusMode ? 'var(--accent)' : 'rgba(30,45,69,0.8)',
                  border: `1px solid ${focusMode ? 'var(--accent)' : 'rgba(30,45,69,1)'}`,
                  cursor: 'pointer'
                }}
                aria-pressed={focusMode}
                aria-label="Toggle focus mode"
              >
                <span
                  className="absolute top-0.5 h-5 w-5 rounded-full transition-all"
                  style={{
                    background: focusMode ? 'var(--surface-base)' : 'var(--text-tertiary)',
                    left: focusMode ? 'calc(100% - 22px)' : '2px'
                  }}
                />
              </button>
            </div>

            {/* Priority override */}
            <div>
              <p className="text-xs text-text-secondary mb-2">Priority override</p>
              <div className="flex gap-2">
                {['Trust AI', 'Always First', 'Suppress'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setOverrideMode(label)}
                    className="flex-1 rounded-lg py-1.5 text-xs font-medium transition-all"
                    style={{
                      background: overrideMode === label ? 'rgba(0,212,170,0.12)' : 'rgba(30,45,69,0.4)',
                      border: `1px solid ${overrideMode === label ? 'rgba(0,212,170,0.3)' : 'rgba(30,45,69,0.7)'}`,
                      color: overrideMode === label ? 'var(--accent)' : 'var(--text-tertiary)',
                      cursor: 'pointer'
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action footer */}
      <div
        className="flex-shrink-0 px-5 py-4 space-y-2"
        style={{ borderTop: '1px solid rgba(30,45,69,0.7)', background: 'rgba(8,12,24,0.6)' }}
      >
        <button
          type="button"
          onClick={onAcknowledge}
          className="btn btn-primary w-full"
        >
          Acknowledge Alarm
        </button>
        <div className="flex gap-2">
          {/* Snooze dropdown */}
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => setSnoozeOpen((v) => !v)}
              className="btn btn-secondary w-full"
            >
              Snooze
              <ChevronDown size={13} className={`ml-auto transition-transform ${snoozeOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {snoozeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.97 }}
                  className="absolute bottom-full left-0 right-0 mb-1 rounded-xl overflow-hidden z-10"
                  style={{
                    background: 'rgba(18,27,46,0.98)',
                    border: '1px solid rgba(30,45,69,0.9)',
                    backdropFilter: 'blur(16px)'
                  }}
                >
                  {SNOOZE_OPTIONS.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => { onSnooze(value); setSnoozeOpen(false) }}
                      className="w-full px-4 py-2.5 text-left text-sm text-text-secondary transition-colors hover:bg-surface-hover hover:text-text-primary"
                      style={{ cursor: 'pointer' }}
                    >
                      {label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            type="button"
            onClick={onEscalate}
            className="btn btn-danger flex-1"
          >
            Escalate
          </button>
        </div>
      </div>
    </div>
  )
}
