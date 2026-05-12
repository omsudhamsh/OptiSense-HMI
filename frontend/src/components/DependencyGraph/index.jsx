import { useMemo } from 'react'
import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react'
import dagre from '@dagrejs/dagre'
import { Cpu } from 'lucide-react'
import '@xyflow/react/dist/style.css'
import { C, SEVERITY } from '../../styles/tokens'

const nodeTypes = {
  equipment: ({ data }) => (
    <div style={{background:'rgba(13,20,36,0.95)',border:`1px solid ${data.severityColor}40`,borderLeft:`3px solid ${data.severityColor}`,borderRadius:10,padding:'8px 12px',minWidth:160,boxShadow:`0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${data.severityColor}15`}}>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:4}}>
        <Cpu size={12} color={C.accent} style={{flexShrink:0}} />
        <span style={{color:C.textPrimary,fontSize:11,fontFamily:'Space Grotesk,sans-serif',fontWeight:600}}>{data.label}</span>
      </div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
        <span style={{color:data.severityColor,fontSize:9,fontFamily:'Inter,sans-serif',fontWeight:600,letterSpacing:'0.08em',textTransform:'uppercase'}}>{data.severity}</span>
        <span style={{color:C.textPrimary,fontSize:10,fontFamily:'JetBrains Mono,monospace',fontWeight:500}}>{data.value}</span>
      </div>
    </div>
  )
}

const layoutGraph = (nodes, edges) => {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir:'LR', nodesep:50, ranksep:80 })
  nodes.forEach(n => g.setNode(n.id, { width:180, height:64 }))
  edges.forEach(e => g.setEdge(e.source, e.target))
  dagre.layout(g)
  return {
    nodes: nodes.map(n => ({ ...n, position:{ x:g.node(n.id).x, y:g.node(n.id).y }})),
    edges
  }
}

export default function DependencyGraph({ alarms, onSelect }) {
  const { nodes, edges } = useMemo(() => {
    const baseNodes = alarms.map(alarm => ({
      id:alarm.id,
      type:'equipment',
      data:{ label:alarm.equipment, type:alarm.equipment_type, severity:alarm.severity, value:`${alarm.value}${alarm.unit||''}`, severityColor:(SEVERITY[alarm.severity]||SEVERITY.LOW).color },
      position:{ x:0, y:0 }
    }))

    const findId = match => alarms.find(a => a.equipment.includes(match))?.id
    const shiftNode = { id:'shift-report', type:'equipment', data:{ label:'Shift Report', type:'scada', severity:'INFO', value:'AI', severityColor:C.accent }, position:{ x:0, y:0 }}

    const edgesList = [
      { source:findId('ACS880-01'), target:findId('AC500 PLC') },
      { source:findId('ACS880-07'), target:findId('AC500 PLC') },
      { source:findId('IRB 6700'),  target:findId('AC500 PLC') },
      { source:findId('Safety PLC'), target:findId('AC500 PLC') },
      { source:findId('AC500 PLC'), target:findId('Zenon') },
      { source:findId('Zenon'),     target:'shift-report' }
    ].filter(e => e.source && e.target).map((e, i) => ({ id:`edge-${i}`, source:e.source, target:e.target, animated:true, style:{ stroke:'rgba(0,212,170,0.5)', strokeWidth:1.5 }}))

    return layoutGraph([...baseNodes, shiftNode], edgesList)
  }, [alarms])

  return (
    <section style={{display:'flex',flexDirection:'column',gap:16}}>
      <div>
        <h2 style={{fontFamily:'Space Grotesk,sans-serif',fontSize:20,fontWeight:700,color:C.textPrimary}}>Dependency Graph</h2>
        <p style={{fontSize:14,color:C.textSecondary,marginTop:4}}>Live equipment topology — click a node to inspect</p>
      </div>
      <div style={{height:520,overflow:'hidden',border:`1px solid ${C.border}`,background:'rgba(8,12,24,0.95)',borderRadius:18}}>
        <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView onNodeClick={(_, node) => onSelect?.(node.id)} style={{background:'transparent'}}>
          <Background gap={24} color="rgba(30,45,69,0.4)" style={{background:'transparent'}} />
          <MiniMap nodeColor={n => n.data?.severityColor || C.accent} maskColor="rgba(8,12,24,0.85)" style={{background:'rgba(13,20,36,0.9)',border:`1px solid ${C.border}`,borderRadius:8}} />
          <Controls style={{background:'rgba(13,20,36,0.9)',border:`1px solid ${C.border}`,borderRadius:8}} />
        </ReactFlow>
      </div>
    </section>
  )
}
