import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { C } from '../../styles/tokens'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'rgba(18,27,46,0.97)', border:`1px solid ${C.border}`, borderRadius:8, padding:'8px 12px', fontSize:12, backdropFilter:'blur(8px)' }}>
      <p style={{ fontFamily:'JetBrains Mono,monospace', color:C.textPrimary, marginBottom:2 }}>{payload[0].value}</p>
      <p style={{ color:C.textTertiary, fontSize:11 }}>{payload[0].payload.label}</p>
    </div>
  )
}

export default function TrendChart({ data, dataKey = 'value', color = C.accent }) {
  return (
    <div style={{ height:160 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top:10, right:10, left:-10, bottom:0 }}>
          <XAxis dataKey="label" stroke={C.textTertiary} tickLine={false} axisLine={false} tick={{ fontSize:10, fontFamily:'JetBrains Mono' }} />
          <YAxis stroke={C.textTertiary} tickLine={false} axisLine={false} tick={{ fontSize:10, fontFamily:'JetBrains Mono' }} />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
