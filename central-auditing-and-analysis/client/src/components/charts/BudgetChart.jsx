import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function parseNum(val) {
  if (!val) return 0;
  return parseFloat(String(val).replace(/[^0-9.-]/g, '')) || 0;
}

export default function BudgetChart({ data, teamColor }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#6B7280' }}>
        No budget data found for the selected month(s).
      </div>
    );
  }

  const chartData = data.map((row) => ({
    name: row['Category'] || 'Unknown',
    Allocated: parseNum(row['Allocated (INR)'] || row['Allocated']),
    Actual: parseNum(row['Actual Spend (INR)'] || row['Actual Spend'] || row['Actual']),
  }));

  const totalAllocated = chartData.reduce((s, d) => s + d.Allocated, 0);
  const totalSpent = chartData.reduce((s, d) => s + d.Actual, 0);
  const variance = totalAllocated - totalSpent;

  const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  const statTile = (label, value, color) => (
    <div style={{ background: '#1F2937', borderRadius: 12, padding: 16, flex: 1, minWidth: 140 }}>
      <p style={{ fontSize: 12, color: '#6B7280', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500 }}>{label}</p>
      <p style={{ fontSize: 20, fontWeight: 700, color, margin: 0 }}>{fmtINR(value)}</p>
    </div>
  );

  return (
    <div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
            <XAxis dataKey="name" stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 11 }} angle={-20} textAnchor="end" height={60} />
            <YAxis stroke="#6B7280" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB' }}
              formatter={(v) => fmtINR(v)}
            />
            <Legend wrapperStyle={{ color: '#9CA3AF', fontSize: 12 }} />
            <Bar dataKey="Allocated" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={24} />
            <Bar dataKey="Actual" fill={teamColor} radius={[4, 4, 0, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
        {statTile('Total Allocated', totalAllocated, '#3B82F6')}
        {statTile('Total Spent', totalSpent, teamColor)}
        {statTile('Variance', Math.abs(variance), variance >= 0 ? '#10B981' : '#EF4444')}
      </div>
    </div>
  );
}
