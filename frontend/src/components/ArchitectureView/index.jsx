import { useState } from 'react'
import { Zap } from 'lucide-react'
import { C } from '../../styles/tokens'

const NODES = [
  { id:'acs880',  label:'ABB ACS880',      sub:'Industrial Drive', x:60,  y:60,  color:C.p2 },
  { id:'ac500',   label:'ABB AC500 PLC',   sub:'PM573',            x:360, y:60,  color:C.p4 },
  { id:'irb6700', label:'ABB IRB 6700',    sub:'Robot Unit',       x:660, y:60,  color:C.p3 },
  { id:'opcua',   label:'OPC-UA Server',   sub:'opc.tcp://4840',   x:360, y:200, color:C.accent },
  { id:'backend', label:'Python Backend',  sub:'Flask + Socket.IO',x:100, y:330, color:'#8B9CC8' },
  { id:'isa',     label:'ISA-18.2 Engine', sub:'Alarm Scoring',    x:380, y:330, color:C.accent },
  { id:'ai',      label:'Gemini AI',       sub:'Explainability',   x:650, y:330, color:'#A78BFA' },
  { id:'hmi',     label:'OptiSense HMI',   sub:'React + Vite',     x:360, y:450, color:C.accent }
]

const EDGES = [
  { from:'acs880',  to:'opcua',   path:'M170 116 L170 200 L470 200' },
  { from:'ac500',   to:'opcua',   path:'M470 116 L470 200' },
  { from:'irb6700', to:'opcua',   path:'M770 116 L770 200 L470 200' },
  { from:'opcua',   to:'backend', path:'M470 256 L210 330' },
  { from:'opcua',   to:'isa',     path:'M470 256 L490 330' },
  { from:'opcua',   to:'ai',      path:'M470 256 L760 330' },
  { from:'isa',     to:'hmi',     path:'M490 386 L470 450' }
]

export default function ArchitectureView() {
  const [hoveredNode, setHoveredNode] = useState(null)

  return (
    <section style={{display:'flex',flexDirection:'column',gap:20}}>
      <div>
        <h2 style={{fontFamily:'Space Grotesk,sans-serif',fontSize:20,fontWeight:700,color:C.textPrimary}}>System Architecture</h2>
        <p style={{fontSize:14,color:C.textSecondary,marginTop:4}}>Live topology — OptiSense to ABB hardware data flow</p>
      </div>

      <div style={{position:'relative',overflow:'hidden',background:'rgba(8,12,24,0.95)',border:`1px solid ${C.border}`,borderRadius:18,backgroundImage:"url(\"data:image/svg+xml,%3Csvg width='40' height='40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0z' fill='none'/%3E%3Ccircle cx='20' cy='20' r='0.5' fill='%231E2D45' opacity='0.6'/%3E%3C/svg%3E\")"}}>
        <svg viewBox="0 0 960 560" style={{width:'100%',height:460}}>
          <defs>
            <filter id="node-glow">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="rgba(0,212,170,0.6)" />
            </marker>
          </defs>

          {/* Edges */}
          {EDGES.map((edge, i) => (
            <g key={edge.from + edge.to}>
              <path d={edge.path} fill="none" stroke="rgba(0,212,170,0.15)" strokeWidth="4" filter="url(#node-glow)" />
              <path d={edge.path} fill="none" stroke="rgba(0,212,170,0.4)" strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#arrowhead)" />
              <circle r="3" fill={C.accent} opacity="0.9">
                <animateMotion dur={`${3.5 + i * 0.4}s`} repeatCount="indefinite" path={edge.path} />
              </circle>
            </g>
          ))}

          {/* Nodes */}
          {NODES.map(node => {
            const isHovered = hoveredNode === node.id
            return (
              <g key={node.id} onMouseEnter={() => setHoveredNode(node.id)} onMouseLeave={() => setHoveredNode(null)} style={{cursor:'pointer'}} filter={isHovered ? 'url(#node-glow)' : undefined}>
                <rect x={node.x} y={node.y} rx="12" ry="12" width="220" height="56" fill={isHovered ? 'rgba(18,27,46,0.98)' : 'rgba(13,20,36,0.95)'} stroke={isHovered ? node.color : 'rgba(30,45,69,0.9)'} strokeWidth={isHovered ? '1.5' : '1'} />
                <rect x={node.x} y={node.y} rx="12" ry="12" width="4" height="56" fill={node.color} opacity="0.8" />
                <text x={node.x + 20} y={node.y + 22} fill={C.textPrimary} fontSize="12" fontFamily="Space Grotesk, sans-serif" fontWeight="600">{node.label}</text>
                <text x={node.x + 20} y={node.y + 38} fill={C.textTertiary} fontSize="10" fontFamily="JetBrains Mono, monospace">{node.sub}</text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Info cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:12}}>
        {[
          { label:'OPC-UA Endpoint', value:'opc.tcp://localhost:4840', color:C.accent },
          { label:'API Server',      value:'http://localhost:5000',     color:C.p4 },
          { label:'HMI Frontend',    value:'http://localhost:5173',     color:C.p3 }
        ].map(({label, value, color}) => (
          <div key={label} style={{background:'rgba(13,20,36,0.85)',border:`1px solid ${C.border}`,borderRadius:12,padding:16}}>
            <p style={{fontSize:11,fontWeight:600,letterSpacing:'0.09em',textTransform:'uppercase',color:C.textTertiary,marginBottom:4}}>{label}</p>
            <p style={{fontFamily:'JetBrains Mono,monospace',fontSize:12,color}}>{value}</p>
          </div>
        ))}
      </div>

      <div style={{display:'flex',alignItems:'center',gap:12,background:'rgba(0,212,170,0.05)',border:`1px solid ${C.accentBorder}`,borderRadius:12,padding:16}}>
        <Zap size={16} color={C.accent} style={{flexShrink:0}} />
        <p style={{fontSize:13,color:C.textSecondary}}>
          In production: swap OPC-UA URL to connect to real ABB hardware. Zero code changes required.
        </p>
      </div>
    </section>
  )
}
