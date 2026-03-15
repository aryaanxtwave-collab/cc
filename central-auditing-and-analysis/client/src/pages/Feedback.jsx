import { useParams, Link, useNavigate } from 'react-router-dom';
import { teams } from '../data/teamsConfig';
import { useLocalStorage } from '../hooks/useLocalStorage';
import FeedbackForm from '../components/FeedbackForm';
import FeedbackList from '../components/FeedbackList';

export default function Feedback() {
  const { teamId } = useParams();
  const navigate = useNavigate();
  const team = teams.find((t) => t.teamId === teamId);
  const [entries, setEntries] = useLocalStorage(`feedback_${teamId}`, []);

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

  const handleAdd = (entry) => {
    setEntries((prev) => [...prev, entry]);
  };

  const handleEdit = (updated) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div style={{ padding: '24px', maxWidth: 900, margin: '0 auto' }}>
      {/* Breadcrumb */}
      <div style={{ marginBottom: 24, fontSize: 13, color: '#6B7280' }}>
        <Link to={`/team/${teamId}`} style={{ color: '#3B82F6', textDecoration: 'none' }}>&larr; Team Detail</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#F9FAFB' }}>Feedback & Action Items</span>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{ width: 6, height: 32, borderRadius: 4, background: team.color }} />
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#F9FAFB', margin: 0 }}>{team.teamName} — Feedback & Action Items</h1>
      </div>

      {/* Form */}
      <div style={{ marginBottom: 32 }}>
        <FeedbackForm teamColor={team.color} onSubmit={handleAdd} />
      </div>

      {/* List */}
      <FeedbackList
        entries={entries}
        teamColor={team.color}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
