import { AnimatePresence, motion } from 'framer-motion'
import { Shield, AlertTriangle, Zap, X, ChevronRight } from 'lucide-react'

const iconMap = { Shield, AlertTriangle, Zap }

const tabIcons = {
  privacy:    Shield,
  terms:      AlertTriangle,
  security:   Shield,
  compliance: Zap
}

export default function PolicyModal({ open, policyKey, content, allPolicies, onNavigate, onClose }) {
  if (!content) return null

  const tabs = Object.entries(allPolicies)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: 'rgba(4,6,14,0.85)', backdropFilter: 'blur(12px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl"
            style={{
              background: 'rgba(12,18,32,0.98)',
              border: '1px solid rgba(30,45,69,0.9)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
              backdropFilter: 'blur(32px)',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(30,45,69,0.7)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)' }}
                >
                  <Shield size={16} className="text-accent" style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold text-text-primary">
                    {content.title}
                  </h2>
                  <p className="text-xs text-text-tertiary">Last updated {content.lastUpdated}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-ghost"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Tab nav */}
            <div
              className="flex gap-1 px-6 py-3 flex-shrink-0 overflow-x-auto"
              style={{ borderBottom: '1px solid rgba(30,45,69,0.5)' }}
            >
              {tabs.map(([key, policy]) => {
                const Icon = tabIcons[key] || Shield
                const isActive = key === policyKey
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onNavigate(key)}
                    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all"
                    style={{
                      background: isActive ? 'rgba(0,212,170,0.1)' : 'transparent',
                      color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                      border: isActive ? '1px solid rgba(0,212,170,0.2)' : '1px solid transparent',
                      cursor: 'pointer'
                    }}
                  >
                    <Icon size={11} />
                    {policy.title}
                  </button>
                )
              })}
            </div>

            {/* Content */}
            <div className="overflow-y-auto px-6 py-6 space-y-6 flex-1">
              {content.sections.map((section, i) => (
                <motion.div
                  key={section.heading}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <ChevronRight size={13} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                    <h3 className="font-display text-sm font-semibold text-text-primary">
                      {section.heading}
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed pl-5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {section.body}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="flex items-center justify-between px-6 py-4 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(30,45,69,0.5)' }}
            >
              <p className="text-xs text-text-tertiary">
                OptiSense HMI · ABB Accelerator 2026 · ISA-18.2
              </p>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary btn-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
