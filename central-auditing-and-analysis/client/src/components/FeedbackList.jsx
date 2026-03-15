import { useState } from 'react';

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function FeedbackEntry({ entry, teamColor, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(entry.feedbackText);
  const [editGivenBy, setEditGivenBy] = useState(entry.givenBy);
  const [editDate, setEditDate] = useState(entry.feedbackDate);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    if (!editText.trim() || !editGivenBy.trim() || !editDate) return;
    onEdit({
      ...entry,
      feedbackText: editText.trim(),
      givenBy: editGivenBy.trim(),
      feedbackDate: editDate,
      updatedAt: new Date().toISOString(),
    });
    setEditing(false);
  };

  const inputBase = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: 8,
    border: '1px solid #374151',
    background: '#1F2937',
    color: '#F9FAFB',
    fontSize: 14,
    outline: 'none',
  };

  const iconBtn = {
    padding: '6px 10px',
    borderRadius: 6,
    border: '1px solid #374151',
    background: 'transparent',
    color: '#9CA3AF',
    fontSize: 13,
    cursor: 'pointer',
    transition: 'all 200ms',
  };

  if (editing) {
    return (
      <div style={{ background: '#111827', border: '1px solid #374151', borderRadius: 12, padding: 16 }}>
        <textarea
          style={{ ...inputBase, minHeight: 60, resize: 'vertical', marginBottom: 8 }}
          value={editText}
          maxLength={2000}
          onChange={(e) => setEditText(e.target.value)}
        />
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <input type="date" style={inputBase} value={editDate} onChange={(e) => setEditDate(e.target.value)} />
          <input type="text" style={inputBase} value={editGivenBy} onChange={(e) => setEditGivenBy(e.target.value)} placeholder="Given By" />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleSave}
            style={{ ...iconBtn, background: teamColor, color: '#fff', border: 'none' }}
          >
            Save
          </button>
          <button onClick={() => setEditing(false)} style={iconBtn}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 12, padding: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <span style={{ fontWeight: 600, color: '#F9FAFB', fontSize: 14 }}>{entry.givenBy}</span>
        <span style={{ fontSize: 12, color: '#6B7280' }}>{formatDate(entry.feedbackDate)}</span>
      </div>
      <p style={{ color: '#9CA3AF', fontSize: 14, lineHeight: 1.6, margin: 0, marginBottom: 12, whiteSpace: 'pre-wrap' }}>
        {entry.feedbackText}
      </p>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => setEditing(true)} style={iconBtn} title="Edit">
          &#9998; Edit
        </button>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            style={{ ...iconBtn, color: '#EF4444' }}
            title="Delete"
          >
            &#128465; Delete
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: '#EF4444' }}>Delete this entry?</span>
            <button
              onClick={() => { onDelete(entry.id); setConfirmDelete(false); }}
              style={{ ...iconBtn, color: '#EF4444', borderColor: '#EF4444' }}
            >
              Confirm
            </button>
            <button onClick={() => setConfirmDelete(false)} style={iconBtn}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function FeedbackList({ entries, teamColor, onEdit, onDelete }) {
  const [search, setSearch] = useState('');

  const filtered = entries
    .filter((e) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return e.feedbackText.toLowerCase().includes(q) || e.givenBy.toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB', margin: 0 }}>All Entries</h3>
          <span style={{
            padding: '2px 10px',
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 500,
            background: `${teamColor}26`,
            color: teamColor,
          }}>
            {entries.length}
          </span>
        </div>
        <input
          type="text"
          placeholder="Search entries..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: '8px 14px',
            borderRadius: 8,
            border: '1px solid #374151',
            background: '#1F2937',
            color: '#F9FAFB',
            fontSize: 13,
            outline: 'none',
            width: 240,
          }}
        />
      </div>

      {filtered.length === 0 ? (
        <div style={{
          background: '#111827',
          border: '1px solid #1F2937',
          borderRadius: 12,
          padding: 40,
          textAlign: 'center',
        }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>&#128221;</p>
          <p style={{ color: '#6B7280', fontSize: 14 }}>
            {entries.length === 0
              ? 'No feedback entries yet. Add the first one above.'
              : 'No entries match your search.'}
          </p>
        </div>
      ) : (
        filtered.map((entry) => (
          <FeedbackEntry
            key={entry.id}
            entry={entry}
            teamColor={teamColor}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))
      )}
    </div>
  );
}
