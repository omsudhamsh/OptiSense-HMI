import { useState } from 'react'
import { Sliders } from 'lucide-react'

export default function AlertSettings({
  threshold, onThresholdChange,
  focusMode, onToggleFocus,
  override, onOverrideChange
}) {
  return (
    <div
      className="rounded-xl p-4 space-y-4"
      style={{ background: 'rgba(13,20,36,0.8)', border: '1px solid rgba(30,45,69,0.7)' }}
    >
      <div className="flex items-center gap-2">
        <Sliders size={13} className="text-text-tertiary" />
        <p className="section-label">Alert Settings</p>
      </div>

      {/* Threshold */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-text-secondary">Custom threshold</p>
          <span className="font-mono text-xs text-text-tertiary">{threshold}</span>
        </div>
        <input
          type="range"
          min={0}
          max={threshold * 1.5}
          value={threshold}
          onChange={(e) => onThresholdChange(Number(e.target.value))}
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
          onClick={onToggleFocus}
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
              onClick={() => onOverrideChange(label)}
              className="flex-1 rounded-lg py-1.5 text-xs font-medium transition-all"
              style={{
                background: override === label ? 'rgba(0,212,170,0.12)' : 'rgba(30,45,69,0.4)',
                border: `1px solid ${override === label ? 'rgba(0,212,170,0.3)' : 'rgba(30,45,69,0.7)'}`,
                color: override === label ? 'var(--accent)' : 'var(--text-tertiary)',
                cursor: 'pointer'
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
