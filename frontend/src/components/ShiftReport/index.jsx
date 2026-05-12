import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { format } from 'date-fns'
import { X, Download, AlertCircle, Clock, CheckCircle, Activity, Zap } from 'lucide-react'
import { C } from '../../styles/tokens'

export default function ShiftReport({ open, onClose, alarms = [] }) {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)

  useEffect(() => {
    if (!open) return
    let mounted = true
    setLoading(true)
    fetch('http://localhost:5000/api/shift-report')
      .then(r => r.json())
      .then(data => { if (mounted) setReport(data) })
      .catch(() => { if (mounted) setReport(null) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [open])

  const handleExportCSV = () => {
    if (!alarms || alarms.length === 0) return
    const headers = ['ID', 'Equipment', 'Location', 'Severity', 'Value', 'Unit', 'Fault', 'Trend', 'Acknowledged']
    const rows = alarms.map(a => [
      a.id,
      `"${a.equipment || ''}"`,
      `"${a.location || ''}"`,
      a.severity,
      a.value,
      a.unit,
      `"${a.fault || ''}"`,
      a.trend,
      a.acknowledged
    ])
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `shift-report-${format(new Date(), 'yyyy-MM-dd-HHmm')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const sections = report ? [
    { id:'summary', label:'Executive Summary', icon:Activity, color:C.accent, content: <p style={{fontSize:13,lineHeight:1.6,color:C.textSecondary}}>{report.summary || 'No summary available.'}</p> },
    { id:'critical', label:'Critical Events', icon:AlertCircle, color:C.p1, content: (
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {(report.critical_events||[]).map((event,i) => (
          <div key={event} style={{display:'flex',alignItems:'flex-start',gap:12}}>
            <span style={{width:20,height:20,borderRadius:'50%',background:'rgba(255,45,45,0.15)',color:C.p1,fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2,fontFamily:'JetBrains Mono,monospace'}}>{i+1}</span>
            <p style={{fontSize:13,color:C.textSecondary}}>{event}</p>
          </div>
        ))}
        {!(report.critical_events?.length) && <p style={{fontSize:13,color:C.textTertiary}}>No critical events this shift.</p>}
      </div>
    )},
    { id:'unresolved', label:'Unresolved Alarms', icon:Clock, color:C.p2, content: (
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {(report.unresolved_alarms||[]).map(alarm => (
          <div key={alarm} style={{background:'rgba(18,27,46,0.6)',border:`1px solid ${C.border}`,borderRadius:10,padding:'10px 12px',fontSize:13,color:C.textSecondary}}>{alarm}</div>
        ))}
        {!(report.unresolved_alarms?.length) && <p style={{fontSize:13,color:C.textTertiary}}>All alarms resolved.</p>}
      </div>
    )},
    { id:'actions', label:'Recommended Actions', icon:CheckCircle, color:C.accent, content: (
      <ol style={{display:'flex',flexDirection:'column',gap:8,listStyle:'none',padding:0,margin:0}}>
        {(report.recommended_actions||[]).map((action,i) => (
          <li key={action} style={{display:'flex',alignItems:'flex-start',gap:12}}>
            <span style={{width:20,height:20,borderRadius:'50%',background:'rgba(0,212,170,0.12)',color:C.accent,border:`1px solid ${C.accentBorder}`,fontSize:10,fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,marginTop:2}}>{i+1}</span>
            <p style={{fontSize:13,color:C.textSecondary}}>{action}</p>
          </li>
        ))}
      </ol>
    )},
    { id:'health', label:'Health Score Summary', icon:Zap, color:C.p3, content: <p style={{fontSize:13,lineHeight:1.6,color:C.textSecondary}}>{report.health_score_summary || 'Health score metrics pending.'}</p> }
  ] : []

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
          style={{position:'fixed',inset:0,zIndex:50,overflowY:'auto',background:'rgba(4,6,14,0.9)',backdropFilter:'blur(12px)'}}>
          <div style={{display:'flex',minHeight:'100%',alignItems:'flex-start',justifyContent:'center',padding:'40px 16px'}}>
            <motion.div initial={{scale:0.96,opacity:0,y:16}} animate={{scale:1,opacity:1,y:0}} exit={{scale:0.96,opacity:0,y:8}} transition={{type:'spring',stiffness:260,damping:26}}
              style={{width:'100%',maxWidth:896,overflow:'hidden',background:'rgba(8,12,24,0.98)',border:`1px solid ${C.border}`,borderRadius:20,boxShadow:'0 40px 100px rgba(0,0,0,0.75)',backdropFilter:'blur(32px)'}}>
              
              {/* Header */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'24px 32px',borderBottom:`1px solid ${C.border}`}}>
                <div>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:4}}>
                    <div style={{width:32,height:32,borderRadius:8,background:C.accentDim,border:`1px solid ${C.accentBorder}`,display:'flex',alignItems:'center',justifyContent:'center'}}>
                      <Activity size={14} color={C.accent} />
                    </div>
                    <h2 style={{fontFamily:'Space Grotesk,sans-serif',fontSize:20,fontWeight:700,color:C.textPrimary}}>Shift Handover Report</h2>
                  </div>
                  <p style={{fontSize:12,color:C.textTertiary,paddingLeft:44}}>{format(new Date(), 'PPpp')} · Generated by OptiSense AI</p>
                </div>
                <div className="no-print" style={{display:'flex',alignItems:'center',gap:8}}>
                  <Btn onClick={handleExportCSV}><Download size={13} /> Export CSV</Btn>
                  <Btn onClick={() => window.print()}><Download size={13} /> Export PDF</Btn>
                  <button type="button" onClick={onClose} style={{width:32,height:32,borderRadius:'50%',background:'transparent',border:'none',color:C.textTertiary,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',transition:'all 160ms'}}
                    onMouseEnter={e => { e.currentTarget.style.background = C.elevated; e.currentTarget.style.color = C.textPrimary }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.textTertiary }}>
                    <X size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={{padding:'24px 32px',display:'flex',flexDirection:'column',gap:24}}>
                {loading ? (
                  [1,2,3,4,5].map(i => (
                    <div key={i} style={{display:'flex',flexDirection:'column',gap:8}}>
                      <div className="skeleton" style={{height:16,width:160,borderRadius:4}} />
                      <div className="skeleton" style={{height:64,borderRadius:12}} />
                    </div>
                  ))
                ) : (
                  sections.map(({id, label, icon:Icon, color, content}, i) => (
                    <motion.section key={id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}>
                      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:12}}>
                        <Icon size={14} color={color} />
                        <h3 style={{fontSize:11,fontWeight:600,letterSpacing:'0.09em',textTransform:'uppercase',color}}>{label}</h3>
                      </div>
                      <div style={{background:'rgba(13,20,36,0.7)',border:`1px solid rgba(30,45,69,0.6)`,borderRadius:12,padding:16}}>
                        {content}
                      </div>
                    </motion.section>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="no-print" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'16px 32px',borderTop:`1px solid rgba(30,45,69,0.5)`}}>
                <p style={{fontSize:12,color:C.textTertiary}}>OptiSense HMI · ISA-18.2 Compliant · ABB Accelerator 2026</p>
                <Btn onClick={onClose}>Close Report</Btn>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Btn({ onClick, children }) {
  const [hov, setHov] = useState(false)
  return (
    <button type="button" onClick={onClick} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{display:'inline-flex',alignItems:'center',justifyContent:'center',gap:6,fontFamily:'Inter,sans-serif',fontWeight:500,fontSize:13,borderRadius:8,padding:'8px 16px',background:'transparent',color:C.textSecondary,border:`1px solid ${C.border}`,cursor:'pointer',transition:'all 160ms',...(hov?{borderColor:'rgba(0,212,170,0.35)',color:C.textPrimary,background:'rgba(0,212,170,0.06)'}:{})}}>
      {children}
    </button>
  )
}
