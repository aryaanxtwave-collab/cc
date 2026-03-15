import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, LabelList } from 'recharts';

export default function KPIChart({ data, teamColor }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#6B7280' }}>
        No KPI data found for the selected month(s).
      </div>
    );
  }

  const chartData = data.map((row) => {
    const target = parseFloat(row['Target']) || 0;
    const actual = parseFloat(row['Actual']) || 0;
    const achievement = target > 0 ? Math.round((actual / target) * 100) : 0;
    return {
      name: row['KPI Name'] || row['KPI'] || 'Unknown',
      Target: target,
      Actual: actual,
      achievement,
      month: row['Month'] || '',
    };
  });

  return (
    <div style={{ width: '100%', height: Math.max(300, chartData.length * 50) }}>
      <ResponsiveContainer>
        <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 40, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
          <XAxis type="number" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB' }}
            formatter={(value, name, props) => {
              if (name === 'Actual') return [`${value} (${props.payload.achievement}%)`, name];
              return [value, name];
            }}
          />
          <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
          <Bar dataKey="Target" fill="#4B5563" radius={[0, 4, 4, 0]} barSize={16} />
          <Bar dataKey="Actual" fill={teamColor} radius={[0, 4, 4, 0]} barSize={16}>
            <LabelList
              dataKey="achievement"
              position="right"
              formatter={(v) => `${v}%`}
              style={{ fill: '#9CA3AF', fontSize: 11 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
