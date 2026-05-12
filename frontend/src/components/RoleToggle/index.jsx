import { motion } from 'framer-motion'
import { User, Wrench } from 'lucide-react'
import { C } from '../../styles/tokens'

export default function RoleToggle({ role, toggleRole }) {
  const isOp = role === 'operator'
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <p style={{ fontSize:11, fontWeight:600, letterSpacing:'0.09em', textTransform:'uppercase', color:C.textTertiary }}>Role</p>
        <span style={{ fontSize:10, fontWeight:600, color: isOp ? C.p4 : C.accent }}>
          {isOp ? 'Operator' : 'Engineer'}
        </span>
      </div>

      <div style={{ position:'relative', display:'flex', background:'rgba(8,12,24,0.9)', border:`1px solid ${C.border}`, borderRadius:10, padding:4 }}>
        <motion.div
          style={{ position:'absolute', top:4, left:4, height:'calc(100% - 8px)', width:'calc(50% - 4px)', borderRadius:8, background: isOp ? 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.1))' : 'linear-gradient(135deg, rgba(0,212,170,0.2), rgba(0,212,170,0.1))', border: `1px solid ${isOp ? 'rgba(59,130,246,0.3)' : 'rgba(0,212,170,0.3)'}` }}
          animate={{ x: isOp ? 0 : '100%' }}
          transition={{ type:'spring', stiffness:280, damping:24 }}
        />
        <button type="button" onClick={() => isOp || toggleRole()} style={{ position:'relative', zIndex:1, flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, borderRadius:8, padding:'8px 0', fontSize:12, fontWeight:700, color: isOp ? C.p4 : C.textTertiary, cursor:'pointer', background:'none', border:'none', transition:'color 160ms', fontFamily:'Inter,sans-serif' }}>
          <User size={12} /> OPR
        </button>
        <button type="button" onClick={() => isOp && toggleRole()} style={{ position:'relative', zIndex:1, flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:6, borderRadius:8, padding:'8px 0', fontSize:12, fontWeight:700, color: !isOp ? C.accent : C.textTertiary, cursor:'pointer', background:'none', border:'none', transition:'color 160ms', fontFamily:'Inter,sans-serif' }}>
          <Wrench size={12} /> ENG
        </button>
      </div>

      <p style={{ fontSize:10, color:C.textTertiary, lineHeight:1.4 }}>
        {isOp ? 'Operator — 3 priority actions visible' : 'Engineer — Full data access enabled'}
      </p>
    </div>
  )
}
