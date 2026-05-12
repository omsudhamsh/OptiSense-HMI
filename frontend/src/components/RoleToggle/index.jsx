import { motion } from 'framer-motion'
import { User, Wrench } from 'lucide-react'

export default function RoleToggle({ role, toggleRole }) {
  const isOp = role === 'operator'
  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center justify-between px-1">
        <p className="text-[11px] font-bold tracking-widest uppercase text-text-tertiary">Role</p>
        <span className={`text-[10px] font-bold tracking-wide transition-colors ${isOp ? 'text-isa-p4 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'text-accent drop-shadow-[0_0_8px_rgba(0,212,170,0.6)]'}`}>
          {isOp ? 'OPERATOR' : 'ENGINEER'}
        </span>
      </div>

      <div className="relative flex bg-surface-card/80 border border-surface-border/80 rounded-xl p-1 shadow-inner backdrop-blur-md">
        <motion.div
          className={`absolute top-1 left-1 h-[calc(100%-8px)] w-[calc(50%-4px)] rounded-lg border shadow-lg ${isOp ? 'bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-blue-500/30' : 'bg-gradient-to-br from-accent/20 to-accent/5 border-accent/30'}`}
          animate={{ x: isOp ? 0 : '100%' }}
          transition={{ type:'spring', stiffness:350, damping:25 }}
        />
        <button type="button" onClick={() => isOp || toggleRole()} className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-colors font-body outline-none ${isOp ? 'text-isa-p4' : 'text-text-tertiary hover:text-text-secondary'}`}>
          <User size={14} /> OPR
        </button>
        <button type="button" onClick={() => isOp && toggleRole()} className={`relative z-10 flex-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-colors font-body outline-none ${!isOp ? 'text-accent' : 'text-text-tertiary hover:text-text-secondary'}`}>
          <Wrench size={14} /> ENG
        </button>
      </div>

      <p className="text-[10px] text-text-tertiary leading-relaxed px-1 font-medium">
        {isOp ? 'Operator — 3 priority actions visible' : 'Engineer — Full data access enabled'}
      </p>
    </div>
  )
}
