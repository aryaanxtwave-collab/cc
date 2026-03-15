import { useState } from 'react';

const freqColors = {
  Annual: '#3B82F6',
  Quarterly: '#F59E0B',
  Monthly: '#10B981',
};

export default function TrackerLinkCard({ tracker, link, teamColor }) {
  const [hovered, setHovered] = useState(false);
  const available = link !== null;

  const card = {
    background: '#111827',
    border: `1px solid ${hovered && available ? teamColor : '#1F2937'}`,
    borderRadius: 16,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    transition: 'all 200ms ease',
    transform: hovered && available ? 'translateY(-2px)' : 'none',
    boxShadow: hovered && available ? `0 4px 16px ${teamColor}22` : 'none',
    opacity: available ? 1 : 0.5,
    cursor: available ? 'pointer' : 'default',
    position: 'relative',
    textDecoration: 'none',
    color: 'inherit',
  };

  const Wrapper = available ? 'a' : 'div';
  const wrapperProps = available
    ? { href: link, target: '_blank', rel: 'noopener noreferrer' }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      style={card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ fontSize: 32 }}>{tracker.icon}</span>
      <h4 style={{ fontSize: 15, fontWeight: 600, color: '#F9FAFB', margin: 0 }}>
        {tracker.label}
      </h4>
      <span
        style={{
          display: 'inline-block',
          padding: '2px 10px',
          borderRadius: 999,
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          background: `${freqColors[tracker.frequency]}26`,
          color: freqColors[tracker.frequency],
          alignSelf: 'flex-start',
        }}
      >
        {tracker.frequency}
      </span>
      {!available && (
        <span
          style={{
            position: 'absolute',
            top: 12,
            right: 12,
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: '#6B7280',
            background: '#1F2937',
            padding: '2px 8px',
            borderRadius: 999,
          }}
        >
          Coming Soon
        </span>
      )}
    </Wrapper>
  );
}
