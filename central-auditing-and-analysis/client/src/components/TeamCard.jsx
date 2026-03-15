import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { trackerMeta } from '../data/teamsConfig';

export default function TeamCard({ team }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const cardStyle = {
    background: '#111827',
    border: '1px solid #1F2937',
    borderRadius: 16,
    borderLeft: `4px solid ${team.color}`,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    transition: 'all 200ms ease',
    transform: hovered ? 'translateY(-2px)' : 'none',
    boxShadow: hovered ? `0 8px 24px ${team.color}22` : '0 1px 3px rgba(0,0,0,0.3)',
    cursor: 'default',
  };

  const memberBadge = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    padding: '3px 10px',
    borderRadius: 999,
    background: `${team.color}26`,
    color: team.color,
    fontSize: 12,
    fontWeight: 500,
  };

  const trackerRow = {
    display: 'flex',
    gap: 4,
    flexWrap: 'wrap',
  };

  const btnRow = {
    display: 'flex',
    gap: 8,
    marginTop: 'auto',
  };

  const viewBtn = {
    flex: 1,
    padding: '8px 16px',
    borderRadius: 8,
    border: `1px solid ${team.color}`,
    background: 'transparent',
    color: team.color,
    fontSize: 13,
    fontWeight: 600,
    transition: 'all 200ms ease',
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#F9FAFB', margin: 0 }}>
          {team.teamName}
        </h3>
        <p style={{ fontSize: 13, color: '#9CA3AF', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14 }}>&#128100;</span> {team.manager}
        </p>
        <p style={{ fontSize: 12, color: '#6B7280', marginTop: 2 }}>{team.department}</p>
      </div>

      <div>
        <span style={memberBadge}>
          {team.members.length} Members
        </span>
      </div>

      <div style={trackerRow}>
        {trackerMeta.map((t) => {
          const link = team.trackerLinks[t.key];
          const base = {
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            transition: 'all 200ms ease',
            padding: 0,
          };
          if (link) {
            return (
              <a
                key={t.key}
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={t.label}
                style={{
                  ...base,
                  background: '#1F2937',
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = `${team.color}33`)}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#1F2937')}
              >
                {t.icon}
              </a>
            );
          }
          return (
            <span
              key={t.key}
              title="Coming Soon"
              style={{
                ...base,
                background: '#1F2937',
                opacity: 0.4,
                cursor: 'not-allowed',
              }}
            >
              {t.icon}
            </span>
          );
        })}
      </div>

      <div style={btnRow}>
        <button
          style={viewBtn}
          onClick={() => navigate(`/team/${team.teamId}`)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = team.color;
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = team.color;
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
