import { useParams, Link, useNavigate } from 'react-router-dom';
import { teams, trackerMeta } from '../data/teamsConfig';
import MemberTable from '../components/MemberTable';
import TrackerLinkCard from '../components/TrackerLinkCard';

export default function TeamDetail() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const team = teams.find((t) => t.teamId === teamId);

  if (!team) {
    return (
      <div style={{ padding: 48, textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: '#F9FAFB', marginBottom: 12 }}>Team not found</h2>
        <p style={{ color: '#6B7280', marginBottom: 24 }}>The team "{teamId}" does not exist.</p>
        <button
          onClick={() => navigate('/')}
          style={{ padding: '10px 24px', borderRadius: 8, border: '1px solid #3B82F6', background: 'transparent', color: '#3B82F6', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const pillBtn = (label, icon, filled, onClick) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '10px 20px',
    borderRadius: 999,
    border: filled ? 'none' : `1px solid ${team.color}`,
    background: filled ? team.color : 'transparent',
    color: filled ? '#fff' : team.color,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 200ms',
  });

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, fontSize: 13, color: '#6B7280' }}>
        <Link to="/" style={{ color: '#3B82F6', textDecoration: 'none' }}>&larr; Dashboard</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#F9FAFB' }}>{team.teamName}</span>
      </div>

      {/* Team Hero */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: 20,
        marginBottom: 36,
      }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ width: 6, borderRadius: 4, background: team.color, flexShrink: 0 }} />
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F9FAFB', margin: 0 }}>{team.teamName}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8, fontSize: 13, color: '#9CA3AF', flexWrap: 'wrap' }}>
              <span>&#128100; {team.manager}</span>
              <span style={{ color: '#374151' }}>&middot;</span>
              <span>{team.department}</span>
              <span style={{ color: '#374151' }}>&middot;</span>
              <span style={{
                padding: '2px 10px',
                borderRadius: 999,
                background: `${team.color}26`,
                color: team.color,
                fontSize: 12,
                fontWeight: 500,
              }}>
                {team.members.length} Members
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            style={pillBtn('Executive Summary', null, true)}
            onClick={() => navigate(`/team/${teamId}/exec-summary`)}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            &#128202; Executive Summary
          </button>
          <button
            style={pillBtn('Feedback', null, false)}
            onClick={() => navigate(`/team/${teamId}/feedback`)}
            onMouseEnter={(e) => { e.currentTarget.style.background = team.color; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = team.color; }}
          >
            &#128172; Feedback & Action Items
          </button>
        </div>
      </div>

      {/* Team Members */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: '#F9FAFB', margin: 0 }}>Team Members</h2>
          <span style={{
            padding: '2px 10px',
            borderRadius: 999,
            background: `${team.color}26`,
            color: team.color,
            fontSize: 12,
            fontWeight: 500,
          }}>
            {team.members.length}
          </span>
        </div>
        <MemberTable members={team.members} teamColor={team.color} />
      </div>

      {/* Tracker Links */}
      <div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: '#F9FAFB', marginBottom: 16 }}>
          Quick Access — Trackers & Reports
        </h2>
        <style>{`
          .tracker-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 16px;
          }
          @media (max-width: 1024px) {
            .tracker-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 640px) {
            .tracker-grid { grid-template-columns: 1fr; }
          }
        `}</style>
        <div className="tracker-grid">
          {trackerMeta.map((t) => (
            <TrackerLinkCard
              key={t.key}
              tracker={t}
              link={team.trackerLinks[t.key]}
              teamColor={team.color}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
