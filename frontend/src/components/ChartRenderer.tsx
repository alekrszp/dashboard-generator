import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'
import { Widget, DatasetRow } from '@/types'
import DataTable from './DataTable'

interface ChartRendererProps {
  widget: Widget
  data: DatasetRow[]
  columns: string[]
}

const COLORS = ['#4d9de0', '#1976d2', '#64b5f6', '#1565c0', '#90caf9', '#0d47a1']
const tooltipStyle = { background: '#0d1929', border: '1px solid rgba(100,160,255,0.2)', borderRadius: 6, color: '#e8eaf0' }
const tickStyle = { fill: '#7a8fa6', fontSize: 12 }
const gridStyle = { strokeDasharray: '3 3', stroke: 'rgba(100,160,255,0.1)' }

export default function ChartRenderer({ widget: w, data, columns }: ChartRendererProps) {
  if (w.type === 'bar') return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey={w.xKey} tick={tickStyle} />
        <YAxis tick={tickStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey={w.yKey} fill={w.color ?? '#4d9de0'} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )

  if (w.type === 'line') return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey={w.xKey} tick={tickStyle} />
        <YAxis tick={tickStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line type="monotone" dataKey={w.yKey} stroke={w.color ?? '#4d9de0'} strokeWidth={2} dot={{ fill: w.color }} />
      </LineChart>
    </ResponsiveContainer>
  )

  if (w.type === 'area') return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey={w.xKey} tick={tickStyle} />
        <YAxis tick={tickStyle} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey={w.yKey} stroke={w.color ?? '#4d9de0'} fill={`${w.color ?? '#4d9de0'}33`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )

  if (w.type === 'radar') return (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(100,160,255,0.15)" />
        <PolarAngleAxis dataKey={w.xKey} tick={tickStyle} />
        <Radar dataKey={w.yKey} stroke={w.color ?? '#4d9de0'} fill={`${w.color ?? '#4d9de0'}33`} strokeWidth={2} />
        <Tooltip contentStyle={tooltipStyle} />
      </RadarChart>
    </ResponsiveContainer>
  )

  if (w.type === 'pie') return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey={w.yKey} nameKey={w.xKey} cx="50%" cy="50%" outerRadius={80} label>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ color: '#7a8fa6', fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  )

  if (w.type === 'table') return (
    <DataTable columns={columns} rows={data} />
  )

  return null
}