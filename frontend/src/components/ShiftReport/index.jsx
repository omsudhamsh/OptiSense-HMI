import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'date-fns'
import { X, Download, AlertCircle, Clock, CheckCircle, Activity, Zap } from 'lucide-react'

export default function ShiftReport({ open, onClose }) {
  const [loading, setLoading] = useState(false)
  const [report,  setReport]  = useState(null)

  useEffect(() => {
    if (!open) return
    let mounted = true
    setLoading(true)
    fetch('http://localhost:5000/api/shift-report')
      .then((r) => r.json())
      .then((data) => { if (mounted) setReport(data) })
      .catch(() => { if (mounted) setReport(null) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [open])

  const sections = report ? [
    {
      id: 'summary',
      label: 'Executive Summary',
      icon: Activity,
      color: 'var(--accent)',
      content: (
        <p className="text-sm leading-relaxed text-text-secondary">
          {report.summary || 'No summary available.'}
        </p>
      )
    },
    {
      id: 'critical',
      label: 'Critical Events',
      icon: AlertCircle,
      color: 'var(--isa-p1)',
      content: (
        <div className="space-y-2">
          {(report.critical_events || []).map((event, i) => (
            <div key={event} className="flex items-start gap-3">
              <span
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full font-mono text-[10px] font-bold mt-0.5"
                style={{ background: 'rgba(255,45,45,0.15)', color: 'var(--isa-p1)' }}
              >
                {i + 1}
              </span>
              <p className="text-sm text-text-secondary">{event}</p>
            </div>
          ))}
          {!(report.critical_events?.length) && (
            <p className="text-sm text-text-tertiary">No critical events this shift.</p>
          )}
        </div>
      )
    },
    {
      id: 'unresolved',
      label: 'Unresolved Alarms',
      icon: Clock,
      color: 'var(--isa-p2)',
      content: (
        <div className="space-y-2">
          {(report.unresolved_alarms || []).map((alarm) => (
            <div
              key={alarm}
              className="rounded-lg px-3 py-2.5 text-sm text-text-secondary"
              style={{ background: 'rgba(18,27,46,0.6)', border: '1px solid rgba(30,45,69,0.7)' }}
            >
              {alarm}
            </div>
          ))}
          {!(report.unresolved_alarms?.length) && (
            <p className="text-sm text-text-tertiary">All alarms resolved.</p>
          )}
        </div>
      )
    },
    {
      id: 'actions',
      label: 'Recommended Actions',
      icon: CheckCircle,
      color: 'var(--accent)',
      content: (
        <ol className="space-y-2">
          {(report.recommended_actions || []).map((action, i) => (
            <li key={action} className="flex items-start gap-3">
              <span
                className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full text-[10px] font-bold mt-0.5"
                style={{ background: 'rgba(0,212,170,0.12)', color: 'var(--accent)', border: '1px solid rgba(0,212,170,0.2)' }}
              >
                {i + 1}
              </span>
              <p className="text-sm text-text-secondary">{action}</p>
            </li>
          ))}
        </ol>
      )
    },
    {
      id: 'health',
      label: 'Health Score Summary',
      icon: Zap,
      color: 'var(--isa-p3)',
      content: (
        <p className="text-sm leading-relaxed text-text-secondary">
          {report.health_score_summary || 'Health score metrics pending.'}
        </p>
      )
    }
  ] : []

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: 'rgba(4,6,14,0.88)', backdropFilter: 'blur(12px)' }}
        >
          <div className="flex min-h-full items-start justify-center px-4 py-10">
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              transition={{ type: 'spring', stiffness: 260, damping: 26 }}
              className="w-full max-w-3xl rounded-2xl overflow-hidden"
              style={{
                background: 'rgba(10,15,26,0.98)',
                border: '1px solid rgba(30,45,69,0.9)',
                boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
                backdropFilter: 'blur(32px)'
              }}
            >
              {/* Header */}
              <div
                className="flex items-center justify-between px-8 py-6"
                style={{ borderBottom: '1px solid rgba(30,45,69,0.7)' }}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-lg"
                      style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)' }}
                    >
                      <Activity size={14} style={{ color: 'var(--accent)' }} />
                    </div>
                    <h2 className="font-display text-xl font-bold text-text-primary">
                      Shift Handover Report
                    </h2>
                  </div>
                  <p className="text-xs text-text-tertiary pl-10">
                    {format(new Date(), 'PPpp')} · Generated by OptiSense AI
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-secondary btn-sm no-print"
                  >
                    <Download size={13} />
                    Export PDF
                  </button>
                  <button type="button" onClick={onClose} className="btn btn-ghost" aria-label="Close">
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div className="px-8 py-6 space-y-6">
                {loading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="space-y-2">
                        <div className="skeleton h-4 w-40 rounded" />
                        <div className="skeleton h-16 rounded-xl" />
                      </div>
                    ))}
                  </div>
                ) : (
                  sections.map(({ id, label, icon: Icon, color, content }, i) => (
                    <motion.section
                      key={id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Icon size={14} style={{ color }} />
                        <h3 className="section-label" style={{ color }}>{label}</h3>
                      </div>
                      <div
                        className="rounded-xl p-4"
                        style={{ background: 'rgba(13,20,36,0.7)', border: '1px solid rgba(30,45,69,0.6)' }}
                      >
                        {content}
                      </div>
                    </motion.section>
                  ))
                )}
              </div>

              {/* Footer */}
              <div
                className="flex items-center justify-between px-8 py-4 no-print"
                style={{ borderTop: '1px solid rgba(30,45,69,0.5)' }}
              >
                <p className="text-xs text-text-tertiary">
                  OptiSense HMI · ISA-18.2 Compliant · ABB Accelerator 2026
                </p>
                <button type="button" onClick={onClose} className="btn btn-secondary btn-sm">
                  Close Report
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
