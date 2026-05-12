import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Bot, Server, Radio, Package } from 'lucide-react'

const TYPE_ICONS = {
  drive:  Cpu,
  plc:    Server,
  robot:  Bot,
  sensor: Radio
}

const TYPE_COLORS = {
  drive:  '#FF8C00',
  plc:    '#3B82F6',
  robot:  '#FFD700',
  sensor: '#A78BFA'
}

export default function TemplateLibrary() {
  const [templates, setTemplates] = useState({})
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetch('http://localhost:5000/api/templates')
      .then((r) => r.json())
      .then((data) => { if (mounted) setTemplates(data) })
      .catch(() => { if (mounted) setTemplates({}) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  const entries = Object.entries(templates)

  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-display text-xl font-bold text-text-primary">Equipment Registry</h2>
        <p className="text-sm text-text-secondary mt-1">
          Templates auto-map signals and thresholds for rapid onboarding
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl" style={{ height: '160px' }} />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl py-16"
          style={{ background: 'rgba(13,20,36,0.6)', border: '1px solid rgba(30,45,69,0.7)' }}
        >
          <Package size={32} className="text-text-tertiary mb-3" />
          <p className="text-sm text-text-secondary">No templates available</p>
          <p className="text-xs text-text-tertiary mt-1">Connect to backend to load equipment templates</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map(([key, template], i) => {
            const Icon  = TYPE_ICONS[key] || Package
            const color = TYPE_COLORS[key] || 'var(--accent)'
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl p-5 transition-all"
                style={{
                  background: 'rgba(13,20,36,0.8)',
                  border: '1px solid rgba(30,45,69,0.7)',
                  cursor: 'default'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = `${color}40`
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px ${color}20`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(30,45,69,0.7)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                    >
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div>
                      <h4 className="font-display text-base font-semibold text-text-primary">
                        {template.label}
                      </h4>
                      <p className="text-xs text-text-tertiary">
                        {template.monitoring_points} monitoring points
                      </p>
                    </div>
                  </div>
                  <span
                    className="badge"
                    style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}
                  >
                    {template.signals?.length || 0} signals
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(template.signals || []).map((signal) => (
                    <span
                      key={signal}
                      className="rounded-lg px-2.5 py-1 text-xs text-text-secondary"
                      style={{ background: 'rgba(30,45,69,0.5)', border: '1px solid rgba(30,45,69,0.8)' }}
                    >
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
