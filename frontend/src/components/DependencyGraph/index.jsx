import { useMemo } from 'react'
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react'
import dagre from '@dagrejs/dagre'
import { Bot, Cpu, MonitorCheck, Server } from 'lucide-react'
import '@xyflow/react/dist/style.css'

const NODE_ICONS = {
  drive:      Cpu,
  plc:        Cpu,
  robot:      Bot,
  panel:      MonitorCheck,
  scada:      Server,
  safety_plc: Cpu
}

const SEVERITY_COLORS = {
  CRITICAL:      '#FF2D2D',
  HIGH:          '#FF8C00',
  MEDIUM:        '#FFD700',
  LOW:           '#3B82F6',
  INFORMATIONAL: '#3B82F6'
}

const nodeTypes = {
  equipment: ({ data }) => {
    const Icon = NODE_ICONS[data.type] || Cpu
    return (
      <div
        style={{
          background: 'rgba(13,20,36,0.95)',
          border: `1px solid ${data.severityColor}40`,
          borderLeft: `3px solid ${data.severityColor}`,
          borderRadius: '10px',
          padding: '8px 12px',
          minWidth: '160px',
          boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${data.severityColor}15`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
          <Icon size={12} style={{ color: '#00D4AA', flexShrink: 0 }} />
          <span style={{ color: '#F0F4FF', fontSize: '11px', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
            {data.label}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: data.severityColor, fontSize: '9px', fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            {data.severity}
          </span>
          <span style={{ color: '#F0F4FF', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>
            {data.value}
          </span>
        </div>
      </div>
    )
  }
}

const layoutGraph = (nodes, edges) => {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'LR', nodesep: 50, ranksep: 80 })
  nodes.forEach((n) => g.setNode(n.id, { width: 180, height: 64 }))
  edges.forEach((e) => g.setEdge(e.source, e.target))
  dagre.layout(g)
  return {
    nodes: nodes.map((n) => ({ ...n, position: { x: g.node(n.id).x, y: g.node(n.id).y } })),
    edges
  }
}

export default function DependencyGraph({ alarms, onSelect }) {
  const { nodes, edges } = useMemo(() => {
    const baseNodes = alarms.map((alarm) => ({
      id:   alarm.id,
      type: 'equipment',
      data: {
        label:         alarm.equipment,
        type:          alarm.equipment_type,
        severity:      alarm.severity,
        value:         `${alarm.value}${alarm.unit || ''}`,
        severityColor: SEVERITY_COLORS[alarm.severity] || '#3B82F6'
      },
      position: { x: 0, y: 0 }
    }))

    const findId = (match) => alarms.find((a) => a.equipment.includes(match))?.id

    const shiftNode = {
      id:   'shift-report',
      type: 'equipment',
      data: { label: 'Shift Report', type: 'scada', severity: 'INFO', value: 'AI', severityColor: '#00D4AA' },
      position: { x: 0, y: 0 }
    }

    const edgesList = [
      { source: findId('ACS880-01'), target: findId('AC500 PLC') },
      { source: findId('ACS880-07'), target: findId('AC500 PLC') },
      { source: findId('IRB 6700'),  target: findId('AC500 PLC') },
      { source: findId('Safety PLC'), target: findId('AC500 PLC') },
      { source: findId('AC500 PLC'), target: findId('Zenon') },
      { source: findId('Zenon'),     target: 'shift-report' }
    ]
      .filter((e) => e.source && e.target)
      .map((e, i) => ({
        id:       `edge-${i}`,
        source:   e.source,
        target:   e.target,
        animated: true,
        style:    { stroke: 'rgba(0,212,170,0.5)', strokeWidth: 1.5 }
      }))

    return layoutGraph([...baseNodes, shiftNode], edgesList)
  }, [alarms])

  return (
    <section className="space-y-4">
      <div>
        <h2 className="font-display text-xl font-bold text-text-primary">Dependency Graph</h2>
        <p className="text-sm text-text-secondary mt-1">Live equipment topology — click a node to inspect</p>
      </div>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ height: '520px', border: '1px solid rgba(30,45,69,0.8)', background: 'rgba(8,12,24,0.9)' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          onNodeClick={(_, node) => onSelect?.(node.id)}
          style={{ background: 'transparent' }}
        >
          <Background
            gap={24}
            color="rgba(30,45,69,0.4)"
            style={{ background: 'transparent' }}
          />
          <MiniMap
            nodeColor={(n) => n.data?.severityColor || '#00D4AA'}
            maskColor="rgba(8,12,24,0.85)"
            style={{ background: 'rgba(13,20,36,0.9)', border: '1px solid rgba(30,45,69,0.7)', borderRadius: '8px' }}
          />
          <Controls
            style={{ background: 'rgba(13,20,36,0.9)', border: '1px solid rgba(30,45,69,0.7)', borderRadius: '8px' }}
          />
        </ReactFlow>
      </div>
    </section>
  )
}
