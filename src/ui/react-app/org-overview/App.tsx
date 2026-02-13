import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Board {
  id: string;
  name: string;
  cardCount: number;
  memberCount: number;
  lastActivity: string;
}

interface Organization {
  id: string;
  name: string;
  displayName: string;
  desc: string;
  boards: Board[];
  totalMembers: number;
  totalCards: number;
}

const App: React.FC = () => {
  const [org, setOrg] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrganization();
  }, []);

  const loadOrganization = async () => {
    try {
      const mockOrg: Organization = {
        id: '1',
        name: 'acmecorp',
        displayName: 'ACME Corporation',
        desc: 'Our main workspace for all projects and teams',
        boards: [
          { id: 'b1', name: 'Engineering Sprint', cardCount: 45, memberCount: 8, lastActivity: '2024-02-12T10:30:00Z' },
          { id: 'b2', name: 'Marketing Campaigns', cardCount: 23, memberCount: 5, lastActivity: '2024-02-12T09:15:00Z' },
          { id: 'b3', name: 'Product Roadmap', cardCount: 18, memberCount: 6, lastActivity: '2024-02-11T16:20:00Z' },
          { id: 'b4', name: 'Sales Pipeline', cardCount: 31, memberCount: 4, lastActivity: '2024-02-12T11:00:00Z' },
          { id: 'b5', name: 'HR & Operations', cardCount: 12, memberCount: 3, lastActivity: '2024-02-10T14:45:00Z' },
        ],
        totalMembers: 15,
        totalCards: 129,
      };
      setOrg(mockOrg);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load organization:', error);
      setLoading(false);
    }
  };

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading organization...
      </div>
    );
  }

  if (!org) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Organization not found
      </div>
    );
  }

  return (
    <div style={{
      background: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ color: '#fff', fontSize: '32px', marginBottom: '8px' }}>{org.displayName}</h1>
        <div style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>@{org.name}</div>
        <div style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6', maxWidth: '800px' }}>
          {org.desc}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>TOTAL BOARDS</div>
          <div style={{ color: '#fff', fontSize: '32px', fontWeight: '600' }}>{org.boards.length}</div>
        </div>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>TOTAL CARDS</div>
          <div style={{ color: '#fff', fontSize: '32px', fontWeight: '600' }}>{org.totalCards}</div>
        </div>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>TOTAL MEMBERS</div>
          <div style={{ color: '#fff', fontSize: '32px', fontWeight: '600' }}>{org.totalMembers}</div>
        </div>
      </div>

      {/* Boards List */}
      <div>
        <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '16px' }}>Boards</h2>
        <div style={{ display: 'grid', gap: '12px' }}>
          {org.boards.map(board => (
            <div
              key={board.id}
              style={{
                background: '#2a2a2a',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #333',
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <h3 style={{ color: '#fff', fontSize: '18px' }}>{board.name}</h3>
                <div style={{ color: '#888', fontSize: '13px' }}>
                  {getRelativeTime(board.lastActivity)}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                <div>
                  <div style={{ color: '#888', fontSize: '11px', marginBottom: '4px' }}>CARDS</div>
                  <div style={{ color: '#ccc', fontSize: '16px', fontWeight: '600' }}>{board.cardCount}</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '11px', marginBottom: '4px' }}>MEMBERS</div>
                  <div style={{ color: '#ccc', fontSize: '16px', fontWeight: '600' }}>{board.memberCount}</div>
                </div>
                <div>
                  <div style={{ color: '#888', fontSize: '11px', marginBottom: '4px' }}>ACTIVITY</div>
                  <div style={{ color: '#61bd4f', fontSize: '13px' }}>●</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
