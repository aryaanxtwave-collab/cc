import { useState } from 'react';

export default function FeedbackForm({ teamColor, onSubmit }) {
  const today = new Date().toISOString().split('T')[0];
  const [text, setText] = useState('');
  const [date, setDate] = useState(today);
  const [givenBy, setGivenBy] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!text.trim()) e.text = 'Feedback text is required';
    if (!date) e.date = 'Date is required';
    if (!givenBy.trim()) e.givenBy = 'Given By is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      id: crypto.randomUUID(),
      feedbackText: text.trim(),
      feedbackDate: date,
      givenBy: givenBy.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setText('');
    setDate(today);
    setGivenBy('');
    setErrors({});
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const inputBase = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 8,
    border: '1px solid #374151',
    background: '#1F2937',
    color: '#F9FAFB',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 200ms',
  };

  const labelStyle = {
    fontSize: 13,
    fontWeight: 500,
    color: '#9CA3AF',
    marginBottom: 6,
    display: 'block',
  };

  const errorStyle = {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
  };

  return (
    <div style={{ background: '#111827', border: '1px solid #1F2937', borderRadius: 16, padding: 24 }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: '#F9FAFB', marginBottom: 20 }}>
        Add Feedback / Action Item
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <label style={labelStyle}>Feedback or Action Item</label>
          <textarea
            style={{ ...inputBase, minHeight: 80, resize: 'vertical', borderColor: errors.text ? '#EF4444' : '#374151' }}
            maxLength={2000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter feedback or action item..."
            onFocus={(e) => (e.target.style.borderColor = teamColor)}
            onBlur={(e) => (e.target.style.borderColor = errors.text ? '#EF4444' : '#374151')}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            {errors.text && <span style={errorStyle}>{errors.text}</span>}
            <span style={{ fontSize: 11, color: '#6B7280', marginLeft: 'auto' }}>{text.length}/2000</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Feedback Date</label>
            <input
              type="date"
              style={{ ...inputBase, borderColor: errors.date ? '#EF4444' : '#374151' }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              onFocus={(e) => (e.target.style.borderColor = teamColor)}
              onBlur={(e) => (e.target.style.borderColor = errors.date ? '#EF4444' : '#374151')}
            />
            {errors.date && <span style={errorStyle}>{errors.date}</span>}
          </div>
          <div>
            <label style={labelStyle}>Given By</label>
            <input
              type="text"
              style={{ ...inputBase, borderColor: errors.givenBy ? '#EF4444' : '#374151' }}
              value={givenBy}
              onChange={(e) => setGivenBy(e.target.value)}
              placeholder="Person's name"
              onFocus={(e) => (e.target.style.borderColor = teamColor)}
              onBlur={(e) => (e.target.style.borderColor = errors.givenBy ? '#EF4444' : '#374151')}
            />
            {errors.givenBy && <span style={errorStyle}>{errors.givenBy}</span>}
          </div>
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 24px',
            borderRadius: 8,
            border: 'none',
            background: teamColor,
            color: '#fff',
            fontSize: 14,
            fontWeight: 600,
            alignSelf: 'flex-start',
            transition: 'all 200ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Add Entry
        </button>
      </form>

      {success && (
        <div style={{
          marginTop: 12,
          padding: '8px 16px',
          borderRadius: 8,
          background: '#10B98126',
          color: '#10B981',
          fontSize: 13,
          fontWeight: 500,
        }}>
          Feedback added successfully!
        </div>
      )}
    </div>
  );
}
