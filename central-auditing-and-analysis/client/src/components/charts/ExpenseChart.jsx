import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#F97316', '#06B6D4', '#EC4899'];

function parseNum(val) {
  if (!val) return 0;
  return parseFloat(String(val).replace(/[^0-9.-]/g, '')) || 0;
}

export default function ExpenseChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#6B7280' }}>
        No expense data found for the selected month(s).
      </div>
    );
  }

  const grouped = {};
  data.forEach((row) => {
    const cat = row['Category'] || 'Other';
    const amt = parseNum(row['Amount (INR)'] || row['Amount']);
    grouped[cat] = (grouped[cat] || 0) + amt;
  });

  const chartData = Object.entries(grouped).map(([name, value]) => ({ name, value }));

  const fmtINR = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
      <div style={{ width: 300, height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={110}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#1F2937', border: '1px solid #374151', borderRadius: 8, color: '#F9FAFB' }}
              formatter={(v) => fmtINR(v)}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1, minWidth: 200 }}>
        {chartData.map((item, i) => (
          <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 12, height: 12, borderRadius: 3, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: '#9CA3AF', flex: 1 }}>{item.name}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#F9FAFB' }}>{fmtINR(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
