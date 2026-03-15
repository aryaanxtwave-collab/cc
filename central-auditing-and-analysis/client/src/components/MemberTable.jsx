export default function MemberTable({ members, teamColor }) {
  const parseContribution = (text) => {
    if (!text || text === '100% Others') return [{ label: text, color: '#6B7280' }];
    return text.split(',').map((s) => s.trim()).filter(Boolean).map((s) => ({
      label: s,
      color: teamColor,
    }));
  };

  return (
    <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #1F2937' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: '#1E3A5F', position: 'sticky', top: 0, zIndex: 1 }}>
            {['S.No', 'EMP ID', 'Name', 'Designation', 'Product Contribution'].map((h) => (
              <th
                key={h}
                style={{
                  padding: '10px 14px',
                  textAlign: 'left',
                  color: '#F9FAFB',
                  fontWeight: 600,
                  fontSize: 13,
                  whiteSpace: 'nowrap',
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr
              key={m.empId}
              style={{
                background: i % 2 === 0 ? '#111827' : '#1F2937',
                transition: 'background 200ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1E3A5F44')}
              onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? '#111827' : '#1F2937')}
            >
              <td style={{ padding: '10px 14px', color: '#9CA3AF' }}>{m.sNo}</td>
              <td style={{ padding: '10px 14px', color: '#9CA3AF', fontFamily: 'monospace', fontSize: 12 }}>{m.empId}</td>
              <td style={{ padding: '10px 14px', color: '#F9FAFB', fontWeight: 500 }}>{m.name}</td>
              <td style={{ padding: '10px 14px', color: '#9CA3AF' }}>{m.designation}</td>
              <td style={{ padding: '10px 14px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {parseContribution(m.contribution).map((tag, idx) => (
                    <span
                      key={idx}
                      style={{
                        display: 'inline-block',
                        padding: '2px 8px',
                        borderRadius: 999,
                        fontSize: 11,
                        fontWeight: 500,
                        background: `${tag.color}1A`,
                        color: tag.color,
                      }}
                    >
                      {tag.label}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
