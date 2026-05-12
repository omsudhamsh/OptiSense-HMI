import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function TrendChart({ data, dataKey = 'value', color = '#00D4AA' }) {
  return (
    <div className="h-40">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <XAxis dataKey="label" stroke="#6B7280" tickLine={false} axisLine={false} />
          <YAxis stroke="#6B7280" tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{
              background: '#111827',
              border: '1px solid #1F2937',
              borderRadius: 8,
              color: '#F9FAFB'
            }}
          />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke={color}
            strokeWidth={2}
            dot={false}
            animationDuration={800}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
