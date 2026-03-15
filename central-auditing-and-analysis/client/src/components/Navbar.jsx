import { Link } from 'react-router-dom';

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    height: 64,
    background: '#0A0F1E',
    borderBottom: '1px solid #1F2937',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  },
  title: {
    fontSize: 16,
    fontWeight: 700,
    color: '#F9FAFB',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#3B82F6',
    display: 'inline-block',
  },
  hodTag: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#1E3A5F',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 600,
    color: '#3B82F6',
  },
  hodText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontWeight: 500,
  },
};

export default function Navbar() {
  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>
        <span style={styles.dot} />
        <span style={styles.title}>Central Auditing and Analysis</span>
      </Link>
      <div style={styles.hodTag}>
        <span style={styles.hodText}>HOD: Pavan G</span>
        <div style={styles.avatar}>PG</div>
      </div>
    </nav>
  );
}
