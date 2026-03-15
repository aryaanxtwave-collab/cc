const statusColors = {
  'on track': { bg: '#10B98126', color: '#10B981' },
  'at risk': { bg: '#F59E0B26', color: '#F59E0B' },
  'missed': { bg: '#EF444426', color: '#EF4444' },
};

function getStatusStyle(status) {
  const key = (status || '').toLowerCase().trim();
  return statusColors[key] || { bg: '#6B728026', color: '#6B7280' };
}

export default function KRATable({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#6B7280' }}>
        No KRA data found for the selected month(s).
      </div>
    );
  }

  const headers = ['Month', 'KRA Name', 'Owner', 'Target', 'Actual', 'Status'];

  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #1F2937' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#1E3A5F' }}>
            {headers.map((h) => (
              <th key={h} style={{ padding: '10px 14px', textAlign: 'left', color: '#F9FAFB', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const statusStyle = getStatusStyle(row['Status']);
            return (
              <tr key={i} style={{ background: i % 2 === 0 ? '#111827' : '#1F2937' }}>
                <td style={{ padding: '10px 14px', color: '#9CA3AF' }}>{row['Month'] || ''}</td>
                <td style={{ padding: '10px 14px', color: '#F9FAFB', fontWeight: 500 }}>{row['KRA Name'] || row['KRA'] || ''}</td>
                <td style={{ padding: '10px 14px', color: '#9CA3AF' }}>{row['Owner'] || ''}</td>
                <td style={{ padding: '10px 14px', color: '#9CA3AF' }}>{row['Target'] || ''}</td>
                <td style={{ padding: '10px 14px', color: '#9CA3AF' }}>{row['Actual'] || ''}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    background: statusStyle.bg,
                    color: statusStyle.color,
                    textTransform: 'capitalize',
                  }}>
                    {row['Status'] || 'N/A'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
