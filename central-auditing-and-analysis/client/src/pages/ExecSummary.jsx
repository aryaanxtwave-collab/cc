import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { teams, trackerMeta } from '../data/teamsConfig';
import KPIChart from '../components/charts/KPIChart';
import BudgetChart from '../components/charts/BudgetChart';
import ExpenseChart from '../components/charts/ExpenseChart';
import KRATable from '../components/charts/KRATable';

const MONTHS_2025 = [
  'January 2025', 'February 2025', 'March 2025', 'April 2025', 'May 2025', 'June 2025',
  'July 2025', 'August 2025', 'September 2025', 'October 2025', 'November 2025', 'December 2025',
];
const MONTHS_2026 = [
  'January 2026', 'February 2026', 'March 2026', 'April 2026', 'May 2026', 'June 2026',
  'July 2026', 'August 2026', 'September 2026', 'October 2026', 'November 2026', 'December 2026',
];
const ALL_MONTHS = [...MONTHS_2026, ...MONTHS_2025];

function SectionCard({ title, icon, children, loading, error, notConfigured }) {
  return (
    <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 16, padding: 24, marginBottom: 20 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <span>{icon}</span>} {title}
      </h3>
      {notConfigured ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#6B7280', fontSize: 14, background: '#1F2937', borderRadius: 8 }}>
          Data not available — sheet not configured
        </div>
      ) : loading ? (
        <div style={{ padding: 20, textAlign: 'center', color: '#9CA3AF', fontSize: 14 }}>
          <div style={{ display: 'inline-block', width: 20, height: 20, border: '2px solid #374151', borderTopColor: '#3B82F6', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: 8, verticalAlign: 'middle' }} />
          Fetching data from sheets...
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : error ? (
        <div style={{ padding: 16, background: '#EF44441A', borderRadius: 8, color: '#EF4444', fontSize: 13 }}>
          Failed to fetch data. Check server connection. <br />
          <span style={{ color: '#9CA3AF', fontSize: 12 }}>{error}</span>
        </div>
      ) : children}
    </div>
  );
}

export default function ExecSummary() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const team = teams.find((t) => t.teamId === teamId);
  const summaryRef = useRef(null);

  const [selectedMonths, setSelectedMonths] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [sheetData, setSheetData] = useState({});
  const [loadingStates, setLoadingStates] = useState({});
  const [errorStates, setErrorStates] = useState({});

  if (!team) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#F9FAFB', marginBottom: 12 }}>Team not found</h2>
        <button onClick={() => navigate('/')} style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #3B82F6', background: 'transparent', color: '#3B82F6', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  const toggleMonth = (m) => {
    setSelectedMonths((prev) => prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]);
  };

  const fetchSheet = async (key) => {
    const url = team.trackerLinks[key];
    if (!url) return;

    setLoadingStates((s) => ({ ...s, [key]: true }));
    setErrorStates((s) => ({ ...s, [key]: null }));

    try {
      const res = await fetch(`/api/sheets/data?url=${encodeURIComponent(url)}&months=${selectedMonths.join(',')}`);
      const json = await res.json();
      if (json.success) {
        setSheetData((s) => ({ ...s, [key]: json.data }));
      } else {
        setErrorStates((s) => ({ ...s, [key]: json.error }));
      }
    } catch (err) {
      setErrorStates((s) => ({ ...s, [key]: err.message }));
    } finally {
      setLoadingStates((s) => ({ ...s, [key]: false }));
    }
  };

  const handleGenerate = async () => {
    if (selectedMonths.length === 0) return;
    setGenerated(true);
    setSheetData({});

    const sheetsToFetch = ['kpiTracker', 'budgetTracker', 'expenseTracker', 'kraMonthly', 'plannedDeliverables'];
    await Promise.allSettled(sheetsToFetch.map((key) => fetchSheet(key)));
  };

  const handleExportPDF = async () => {
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      if (!summaryRef.current) return;
      const canvas = await html2canvas(summaryRef.current, { background: '#0A0F1E', scale: 1.5 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: [canvas.width, canvas.height] });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`${team.teamName}_Executive_Summary.pdf`);
    } catch (err) {
      console.error('PDF export failed:', err);
      window.print();
    }
  };

  const nonNullTrackers = Object.values(team.trackerLinks).filter(Boolean).length;

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, fontSize: 13, color: '#6B7280' }}>
        <Link to={`/team/${teamId}`} style={{ color: '#3B82F6', textDecoration: 'none' }}>&larr; Team Detail</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#F9FAFB' }}>Executive Summary</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ width: 6, height: 32, borderRadius: 4, background: team.color }} />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F9FAFB', margin: 0 }}>{team.teamName} — Executive Summary</h1>
      </div>

      {/* Month Selector */}
      <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 16, padding: 24, marginBottom: 24 }}>
        <label style={{ fontSize: 14, fontWeight: 600, color: '#F9FAFB', display: 'block', marginBottom: 12 }}>
          Select Month(s) to Generate Summary
        </label>
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: '1px solid #374151',
              background: '#1F2937',
              color: selectedMonths.length > 0 ? '#F9FAFB' : '#6B7280',
              fontSize: 14,
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {selectedMonths.length > 0 ? selectedMonths.join(', ') : 'Click to select months...'}
          </button>
          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              marginTop: 4,
              background: '#1F2937',
              border: '1px solid #374151',
              borderRadius: 8,
              maxHeight: 240,
              overflowY: 'auto',
              zIndex: 20,
            }}>
              {ALL_MONTHS.map((m) => (
                <label
                  key={m}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '8px 14px',
                    cursor: 'pointer',
                    fontSize: 13,
                    color: '#F9FAFB',
                    borderBottom: '1px solid #374151',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#111827')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <input
                    type="checkbox"
                    checked={selectedMonths.includes(m)}
                    onChange={() => toggleMonth(m)}
                    style={{ accentColor: team.color }}
                  />
                  {m}
                </label>
              ))}
            </div>
          )}
        </div>
        <button
          onClick={handleGenerate}
          disabled={selectedMonths.length === 0}
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: 'none',
            background: selectedMonths.length > 0 ? team.color : '#374151',
            color: selectedMonths.length > 0 ? '#fff' : '#6B7280',
            fontSize: 14,
            fontWeight: 600,
            cursor: selectedMonths.length > 0 ? 'pointer' : 'not-allowed',
            transition: 'all 200ms',
          }}
        >
          Generate Summary
        </button>
      </div>

      {/* Summary Output */}
      {generated && (
        <div ref={summaryRef}>
          {/* Export Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
            <button
              onClick={handleExportPDF}
              style={{
                padding: '8px 20px',
                borderRadius: 8,
                border: '1px solid #374151',
                background: '#1F2937',
                color: '#F9FAFB',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = team.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#374151')}
            >
              Export as PDF
            </button>
          </div>

          {/* Block 1 — Team Snapshot */}
          <SectionCard title="Team Snapshot" icon="&#128200;">
            <style>{`
              .snapshot-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 12px;
              }
              @media (max-width: 768px) {
                .snapshot-grid { grid-template-columns: repeat(2, 1fr); }
              }
            `}</style>
            <div className="snapshot-grid">
              {[
                { label: 'Total Members', value: team.members.length },
                { label: 'Trackers Available', value: nonNullTrackers },
                { label: 'Selected Month(s)', value: selectedMonths.join(', ') },
                { label: 'Department', value: team.department },
              ].map((s) => (
                <div key={s.label} style={{ background: '#1F2937', borderRadius: 12, padding: 16 }}>
                  <p style={{ fontSize: 11, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 500, marginBottom: 6 }}>{s.label}</p>
                  <p style={{ fontSize: typeof s.value === 'number' ? 24 : 14, fontWeight: 700, color: team.color, margin: 0, wordBreak: 'break-word' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Block 2 — KPI Performance */}
          <SectionCard
            title="KPI Performance"
            icon="&#128200;"
            loading={loadingStates.kpiTracker}
            error={errorStates.kpiTracker}
            notConfigured={!team.trackerLinks.kpiTracker}
          >
            <KPIChart data={sheetData.kpiTracker} teamColor={team.color} />
          </SectionCard>

          {/* Block 3 — Budget Overview */}
          <SectionCard
            title="Budget Overview"
            icon="&#128176;"
            loading={loadingStates.budgetTracker}
            error={errorStates.budgetTracker}
            notConfigured={!team.trackerLinks.budgetTracker}
          >
            <BudgetChart data={sheetData.budgetTracker} teamColor={team.color} />
          </SectionCard>

          {/* Block 4 — Expense Breakdown */}
          <SectionCard
            title="Expense Breakdown"
            icon="&#129534;"
            loading={loadingStates.expenseTracker}
            error={errorStates.expenseTracker}
            notConfigured={!team.trackerLinks.expenseTracker}
          >
            <ExpenseChart data={sheetData.expenseTracker} />
          </SectionCard>

          {/* Block 5 — KRA Status */}
          <SectionCard
            title="KRA Status"
            icon="&#127942;"
            loading={loadingStates.kraMonthly}
            error={errorStates.kraMonthly}
            notConfigured={!team.trackerLinks.kraMonthly}
          >
            <KRATable data={sheetData.kraMonthly} />
          </SectionCard>

          {/* Block 6 — Planned Deliverables */}
          <SectionCard
            title="Planned Deliverables"
            icon="&#128203;"
            loading={loadingStates.plannedDeliverables}
            error={errorStates.plannedDeliverables}
            notConfigured={!team.trackerLinks.plannedDeliverables}
          >
            <DeliverablesBlock data={sheetData.plannedDeliverables} teamColor={team.color} />
          </SectionCard>
        </div>
      )}
    </div>
  );
}

function DeliverablesBlock({ data, teamColor }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: '#6B7280' }}>
        No deliverables data found for the selected month(s).
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {data.map((row, i) => {
        const pct = parseFloat(row['% Complete'] || row['Completion'] || '0') || 0;
        const barColor = pct >= 80 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444';
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ flex: '0 0 200px', fontSize: 13, color: '#F9FAFB', fontWeight: 500 }}>
              {row['Deliverable'] || row['Name'] || `Deliverable ${i + 1}`}
            </div>
            <div style={{ flex: 1, height: 8, background: '#1F2937', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(pct, 100)}%`, height: '100%', background: barColor, borderRadius: 4, transition: 'width 400ms ease' }} />
            </div>
            <div style={{ flex: '0 0 48px', fontSize: 13, fontWeight: 600, color: barColor, textAlign: 'right' }}>
              {pct}%
            </div>
          </div>
        );
      })}
    </div>
  );
}
