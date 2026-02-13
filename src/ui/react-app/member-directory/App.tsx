import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Member {
  id: string;
  fullName: string;
  username: string;
  email: string;
  avatarUrl: string;
  assignedCards: number;
  boards: string[];
  lastActive: string;
}

const App: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const mockMembers: Member[] = [
        {
          id: '1',
          fullName: 'Alice Johnson',
          username: '@alice',
          email: 'alice@example.com',
          avatarUrl: '',
          assignedCards: 12,
          boards: ['Engineering', 'Marketing', 'Sales'],
          lastActive: '2024-02-12T10:30:00Z',
        },
        {
          id: '2',
          fullName: 'Bob Smith',
          username: '@bob',
          email: 'bob@example.com',
          avatarUrl: '',
          assignedCards: 9,
          boards: ['Engineering', 'Product'],
          lastActive: '2024-02-12T09:15:00Z',
        },
        {
          id: '3',
          fullName: 'Carol White',
          username: '@carol',
          email: 'carol@example.com',
          avatarUrl: '',
          assignedCards: 7,
          boards: ['Marketing', 'Product'],
          lastActive: '2024-02-11T16:45:00Z',
        },
        {
          id: '4',
          fullName: 'David Brown',
          username: '@david',
          email: 'david@example.com',
          avatarUrl: '',
          assignedCards: 5,
          boards: ['Engineering'],
          lastActive: '2024-02-10T14:20:00Z',
        },
        {
          id: '5',
          fullName: 'Emma Davis',
          username: '@emma',
          email: 'emma@example.com',
          avatarUrl: '',
          assignedCards: 8,
          boards: ['Sales', 'Marketing'],
          lastActive: '2024-02-12T11:00:00Z',
        },
      ];
      setMembers(mockMembers);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load members:', error);
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(member =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        Loading members...
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
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>Member Directory</h1>

      <input
        type="text"
        placeholder="Search members..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '500px',
          padding: '12px',
          marginBottom: '24px',
          background: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '14px',
        }}
      />

      <div style={{ color: '#888', marginBottom: '16px', fontSize: '14px' }}>
        {filteredMembers.length} member{filteredMembers.length !== 1 ? 's' : ''}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '16px',
      }}>
        {filteredMembers.map(member => (
          <div
            key={member.id}
            style={{
              background: '#2a2a2a',
              borderRadius: '8px',
              padding: '20px',
              border: '1px solid #333',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: '#4a9eff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '20px',
                  fontWeight: '600',
                }}
              >
                {member.fullName.charAt(0)}
              </div>
              <div>
                <div style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>
                  {member.fullName}
                </div>
                <div style={{ color: '#888', fontSize: '13px' }}>
                  {member.username}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>EMAIL</div>
              <div style={{ color: '#ccc', fontSize: '14px' }}>{member.email}</div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>BOARDS</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {member.boards.map((board, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#333',
                      color: '#ccc',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {board}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#888', fontSize: '12px' }}>ASSIGNED CARDS</div>
                <div style={{ color: '#fff', fontSize: '18px', fontWeight: '600' }}>
                  {member.assignedCards}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#888', fontSize: '12px' }}>LAST ACTIVE</div>
                <div style={{ color: '#ccc', fontSize: '13px' }}>
                  {getRelativeTime(member.lastActive)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
