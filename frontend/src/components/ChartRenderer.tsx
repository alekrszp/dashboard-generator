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
const tickStyle = { fill: '#7a8fa6', fontSize: 12 }
const gridStyle = { strokeDasharray: '3 3', stroke: 'rgba(100,160,255,0.1)' }

const tooltipProps = {
  contentStyle: {
    background: '#0d1929',
    border: '1px solid rgba(100,160,255,0.2)',
    borderRadius: 6,
  },
  labelStyle: { color: '#e8eaf0', fontWeight: 500 },
  itemStyle: { color: '#4d9de0' },
}

type ChartFactory = (w: Widget, data: DatasetRow[], columns: string[]) => JSX.Element

const chartRegistry: Record<string, ChartFactory> = {
  bar: (w, data) => (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey={w.xKey} tick={tickStyle} />
        <YAxis tick={tickStyle} />
        <Tooltip {...tooltipProps} />
        <Bar dataKey={w.yKey} fill={w.color ?? '#4d9de0'} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  ),
  line: (w, data) => (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey={w.xKey} tick={tickStyle} />
        <YAxis tick={tickStyle} />
        <Tooltip {...tooltipProps} />
        <Line type="monotone" dataKey={w.yKey} stroke={w.color ?? '#4d9de0'} strokeWidth={2} dot={{ fill: w.color }} />
      </LineChart>
    </ResponsiveContainer>
  ),
  area: (w, data) => (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <CartesianGrid {...gridStyle} />
        <XAxis dataKey={w.xKey} tick={tickStyle} />
        <YAxis tick={tickStyle} />
        <Tooltip {...tooltipProps} />
        <Area type="monotone" dataKey={w.yKey} stroke={w.color ?? '#4d9de0'} fill={`${w.color ?? '#4d9de0'}33`} strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  ),
  radar: (w, data) => (
    <ResponsiveContainer width="100%" height={220}>
      <RadarChart data={data}>
        <PolarGrid stroke="rgba(100,160,255,0.15)" />
        <PolarAngleAxis dataKey={w.xKey} tick={tickStyle} />
        <Radar dataKey={w.yKey} stroke={w.color ?? '#4d9de0'} fill={`${w.color ?? '#4d9de0'}33`} strokeWidth={2} />
        <Tooltip {...tooltipProps} />
      </RadarChart>
    </ResponsiveContainer>
  ),
  pie: (w, data) => (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey={w.yKey} nameKey={w.xKey} cx="50%" cy="50%" outerRadius={80} label>
          {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
        </Pie>
        <Tooltip {...tooltipProps} />
        <Legend wrapperStyle={{ color: '#7a8fa6', fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  ),
  table: (_w, data, columns) => (
    <DataTable columns={columns} rows={data} />
  ),
}

export default function ChartRenderer({ widget, data, columns }: ChartRendererProps) {
  const factory = chartRegistry[widget.type]
  if (!factory) return <p style={{ color: '#f87171', fontSize: '13px' }}>Tipo de gráfico desconhecido.</p>
  return factory(widget, data, columns)
}