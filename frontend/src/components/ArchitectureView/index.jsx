import { useState } from 'react'
import { motion } from 'framer-motion'
import { Cpu, Server, Bot, Monitor, Database, Zap } from 'lucide-react'

const NODES = [
  { id: 'acs880',   label: 'ABB ACS880',      sub: 'Industrial Drive',   icon: Cpu,      x: 60,  y: 60,  color: '#FF8C00' },
  { id: 'ac500',    label: 'ABB AC500 PLC',    sub: 'PM573',              icon: Cpu,      x: 360, y: 60,  color: '#3B82F6' },
  { id: 'irb6700',  label: 'ABB IRB 6700',     sub: 'Robot Unit',         icon: Bot,      x: 660, y: 60,  color: '#FFD700' },
  { id: 'opcua',    label: 'OPC-UA Server',    sub: 'opc.tcp://4840',     icon: Server,   x: 360, y: 200, color: '#00D4AA' },
  { id: 'backend',  label: 'Python Backend',   sub: 'Flask + Socket.IO',  icon: Database, x: 100, y: 330, color: '#8B9CC8' },
  { id: 'isa',      label: 'ISA-18.2 Engine',  sub: 'Alarm Scoring',      icon: Zap,      x: 380, y: 330, color: '#00D4AA' },
  { id: 'ai',       label: 'Gemini AI',        sub: 'Explainability',     icon: Zap,      x: 650, y: 330, color: '#A78BFA' },
  { id: 'hmi',      label: 'OptiSense HMI',    sub: 'React + Vite',       icon: Monitor,  x: 360, y: 450, color: '#00D4AA' }
]

const EDGES = [
  { from: 'acs880',  to: 'opcua',   path: 'M170 116 L170 200 L470 200' },
  { from: 'ac500',   to: 'opcua',   path: 'M470 116 L470 200' },
  { from: 'irb6700', to: 'opcua',   path: 'M770 116 L770 200 L470 200' },
  { from: 'opcua',   to: 'backend', path: 'M470 256 L210 330' },
  { from: 'opcua',   to: 'isa',     path: 'M470 256 L490 330' },
  { from: 'opcua',   to: 'ai',      path: 'M470 256 L760 330' },
  { from: 'isa',     to: 'hmi',     path: 'M490 386 L470 450' }
]

export default function ArchitectureView() {
  const [hoveredNode, setHoveredNode] = useState(null)

  return (
    <section className="space-y-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-text-primary">System Architecture</h2>
        <p className="text-sm text-text-secondary mt-1">
          Live topology — OptiSense to ABB hardware data flow
        </p>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: 'rgba(8,12,24,0.9)',
          border: '1px solid rgba(30,45,69,0.8)',
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Ccircle cx='20' cy='20' r='0.5' fill='%231E2D45' opacity='0.6'/%3E%3C/svg%3E\")"
        }}
      >
        <svg viewBox="0 0 960 560" className="w-full" style={{ height: '460px' }}>
          <defs>
            <filter id="node-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="edge-glow">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="rgba(0,212,170,0.6)" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map((edge, i) => (
            <g key={edge.from + edge.to}>
              {/* Glow layer */}
              <path
                d={edge.path}
                fill="none"
                stroke="rgba(0,212,170,0.15)"
                strokeWidth="4"
                filter="url(#edge-glow)"
              />
              {/* Main line */}
              <path
                d={edge.path}
                fill="none"
                stroke="rgba(0,212,170,0.4)"
                strokeWidth="1.5"
                strokeDasharray="6 4"
                markerEnd="url(#arrowhead)"
              />
              {/* Animated dot */}
              <circle r="3" fill="#00D4AA" opacity="0.9">
                <animateMotion
                  dur={`${3.5 + i * 0.4}s`}
                  repeatCount="indefinite"
                  path={edge.path}
                />
              </circle>
            </g>
          ))}

          {/* Nodes */}
          {NODES.map((node) => {
            const isHovered = hoveredNode === node.id
            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{ cursor: 'pointer' }}
                filter={isHovered ? 'url(#node-glow)' : undefined}
              >
                {/* Card bg */}
                <rect
                  x={node.x}
                  y={node.y}
                  rx="12"
                  ry="12"
                  width="220"
                  height="56"
                  fill={isHovered ? 'rgba(18,27,46,0.98)' : 'rgba(13,20,36,0.95)'}
                  stroke={isHovered ? node.color : 'rgba(30,45,69,0.9)'}
                  strokeWidth={isHovered ? '1.5' : '1'}
                />
                {/* Color accent bar */}
                <rect
                  x={node.x}
                  y={node.y}
                  rx="12"
                  ry="12"
                  width="4"
                  height="56"
                  fill={node.color}
                  opacity="0.8"
                />
                {/* Label */}
                <text
                  x={node.x + 20}
                  y={node.y + 22}
                  fill="#F0F4FF"
                  fontSize="12"
                  fontFamily="Space Grotesk, sans-serif"
                  fontWeight="600"
                >
                  {node.label}
                </text>
                <text
                  x={node.x + 20}
                  y={node.y + 38}
                  fill="#4A5A7A"
                  fontSize="10"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {node.sub}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'OPC-UA Endpoint', value: 'opc.tcp://localhost:4840', color: 'var(--accent)' },
          { label: 'API Server',      value: 'http://localhost:5000',     color: 'var(--isa-p4)' },
          { label: 'HMI Frontend',    value: 'http://localhost:5173',     color: 'var(--isa-p3)' }
        ].map(({ label, value, color }) => (
          <div
            key={label}
            className="rounded-xl p-4"
            style={{ background: 'rgba(13,20,36,0.8)', border: '1px solid rgba(30,45,69,0.7)' }}
          >
            <p className="section-label mb-1">{label}</p>
            <p className="font-mono text-xs" style={{ color }}>{value}</p>
          </div>
        ))}
      </div>

      <div
        className="flex items-center gap-3 rounded-xl p-4"
        style={{ background: 'rgba(0,212,170,0.05)', border: '1px solid rgba(0,212,170,0.15)' }}
      >
        <Zap size={16} style={{ color: 'var(--accent)', flexShrink: 0 }} />
        <p className="text-sm text-text-secondary">
          In production: swap OPC-UA URL to connect to real ABB hardware. Zero code changes required.
        </p>
      </div>
    </section>
  )
}
