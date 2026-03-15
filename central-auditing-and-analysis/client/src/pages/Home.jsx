import { teams } from '../data/teamsConfig';
import TeamCard from '../components/TeamCard';

export default function Home() {
  return (
    <div style={{ padding: '32px 24px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, color: '#F9FAFB', marginBottom: 8 }}>
          Central Auditing and Analysis
        </h1>
        <p style={{ fontSize: 16, color: '#6B7280', marginBottom: 12 }}>
          Content Department Dashboard
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 13, color: '#9CA3AF' }}>
          <span>HOD: Pavan G</span>
          <span style={{ color: '#374151' }}>&middot;</span>
          <span>{teams.length} Teams</span>
          <span style={{ color: '#374151' }}>&middot;</span>
          <span>NxtWave Disruptive Technologies</span>
        </div>
      </div>

      {/* Team Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340, 1fr))',
        gap: 24,
      }}>
        <style>{`
          .team-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
          }
          @media (max-width: 1024px) {
            .team-grid { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 640px) {
            .team-grid { grid-template-columns: 1fr; }
          }
        `}</style>
        <div className="team-grid">
          {teams.map((team) => (
            <TeamCard key={team.teamId} team={team} />
          ))}
        </div>
      </div>
    </div>
  );
}
