import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Cpu, Bot, Server, Radio, Plus } from 'lucide-react'

const TEMPLATES = {
  drive:  { label: 'Drive',  icon: Cpu,    signals: ['Output Temperature', 'Output Current', 'Motor Speed', 'DC Bus Voltage', 'Fault Code'] },
  plc:    { label: 'PLC',    icon: Server, signals: ['CPU Load', 'Scan Time', 'I/O Latency', 'Memory Utilization', 'Comm Errors'] },
  robot:  { label: 'Robot',  icon: Bot,    signals: ['Joint Torque', 'Axis Temp', 'Path Deviation', 'Drive Current', 'Payload Weight'] },
  sensor: { label: 'Sensor', icon: Radio,  signals: ['Signal Noise', 'Drift Rate', 'Response Time', 'Calibration Age', 'Signal Quality'] }
}

const EQUIPMENT_TYPES = Object.keys(TEMPLATES)

export default function EquipmentModal({ open, onClose, onGenerate }) {
  const [equipmentType, setEquipmentType] = useState('drive')
  const [equipmentId,   setEquipmentId]   = useState('')
  const [location,      setLocation]      = useState('')
  const [loading,       setLoading]       = useState(false)

  const template = useMemo(() => TEMPLATES[equipmentType], [equipmentType])
  const TypeIcon = template.icon

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await onGenerate({
      equipment_type:   equipmentType,
      equipment:        equipmentId || `ABB ${template.label}`,
      location:         location || 'New Line',
      templateLabel:    template.label,
      templateSignals:  template.signals.length
    })
    setLoading(false)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: 'rgba(4,6,14,0.8)', backdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            className="w-full max-w-md rounded-2xl overflow-hidden"
            style={{
              background: 'rgba(12,18,32,0.98)',
              border: '1px solid rgba(30,45,69,0.9)',
              boxShadow: '0 32px 80px rgba(0,0,0,0.7)',
              backdropFilter: 'blur(32px)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 py-5"
              style={{ borderBottom: '1px solid rgba(30,45,69,0.7)' }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.2)' }}
                >
                  <Plus size={16} style={{ color: 'var(--accent)' }} />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold text-text-primary">Add Equipment</h3>
                  <p className="text-xs text-text-tertiary">Configure monitoring signals</p>
                </div>
              </div>
              <button type="button" onClick={onClose} className="btn btn-ghost" aria-label="Close">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
              {/* Equipment type selector */}
              <div>
                <p className="section-label mb-3">Equipment Type</p>
                <div className="grid grid-cols-4 gap-2">
                  {EQUIPMENT_TYPES.map((type) => {
                    const { label, icon: Icon } = TEMPLATES[type]
                    const isActive = equipmentType === type
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setEquipmentType(type)}
                        className="flex flex-col items-center gap-1.5 rounded-xl py-3 px-2 text-xs font-medium transition-all"
                        style={{
                          background: isActive ? 'rgba(0,212,170,0.1)' : 'rgba(18,27,46,0.6)',
                          border: `1px solid ${isActive ? 'rgba(0,212,170,0.3)' : 'rgba(30,45,69,0.7)'}`,
                          color: isActive ? 'var(--accent)' : 'var(--text-tertiary)',
                          cursor: 'pointer'
                        }}
                      >
                        <Icon size={16} />
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Equipment ID */}
              <div>
                <label className="section-label block mb-2" htmlFor="equipment-id">
                  Equipment ID
                </label>
                <input
                  id="equipment-id"
                  value={equipmentId}
                  onChange={(e) => setEquipmentId(e.target.value)}
                  placeholder={`e.g. ABB ${template.label}-09`}
                  className="input font-mono"
                />
              </div>

              {/* Location */}
              <div>
                <label className="section-label block mb-2" htmlFor="location">
                  Location
                </label>
                <input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. MCC-4, Bay 3"
                  className="input"
                />
              </div>

              {/* Template preview */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <TypeIcon size={13} style={{ color: 'var(--accent)' }} />
                  <p className="section-label">{template.label} Template — {template.signals.length} signals</p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {template.signals.map((signal) => (
                    <span
                      key={signal}
                      className="rounded-lg px-2.5 py-1 text-xs text-text-secondary"
                      style={{ background: 'rgba(30,45,69,0.5)', border: '1px solid rgba(30,45,69,0.8)' }}
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full btn-lg"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded-full border-2 border-surface-base border-t-transparent animate-spin" />
                    Configuring…
                  </span>
                ) : (
                  <>
                    <Plus size={15} />
                    Add to Monitoring
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
