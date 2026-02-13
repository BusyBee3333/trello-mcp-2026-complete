import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Card {
  id: string;
  name: string;
  boardName: string;
  listName: string;
  due: string | null;
  isOverdue: boolean;
}

interface MemberStats {
  name: string;
  assignedCards: Card[];
  totalCards: number;
  overdueCards: number;
  completedThisWeek: number;
}

const App: React.FC = () => {
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemberStats();
  }, []);

  const loadMemberStats = async () => {
    try {
      const mockStats: MemberStats = {
        name: 'Alice Johnson',
        assignedCards: [
          { id: '1', name: 'Fix authentication bug', boardName: 'Engineering', listName: 'In Progress', due: '2024-02-18', isOverdue: false },
          { id: '2', name: 'Update API docs', boardName: 'Engineering', listName: 'To Do', due: '2024-02-12', isOverdue: true },
          { id: '3', name: 'Design new landing page', boardName: 'Marketing', listName: 'In Progress', due: '2024-02-25', isOverdue: false },
          { id: '4', name: 'Code review for PR #123', boardName: 'Engineering', listName: 'Review', due: null, isOverdue: false },
          { id: '5', name: 'Client presentation', boardName: 'Sales', listName: 'To Do', due: '2024-02-10', isOverdue: true },
        ],
        totalCards: 12,
        overdueCards: 2,
        completedThisWeek: 5,
      };
      setStats(mockStats);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load member stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading member dashboard...
      </div>
    );
  }

  if (!stats) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        No data available
      </div>
    );
  }

  const inProgressCards = stats.assignedCards.filter(c => c.listName === 'In Progress');
  const todoCards = stats.assignedCards.filter(c => c.listName === 'To Do');
  const reviewCards = stats.assignedCards.filter(c => c.listName === 'Review');
  const overdueCards = stats.assignedCards.filter(c => c.isOverdue);

  return (
    <div style={{
      background: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <h1 style={{ color: '#fff', marginBottom: '24px' }}>Member Dashboard - {stats.name}</h1>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Total Assigned</div>
          <div style={{ color: '#fff', fontSize: '32px', fontWeight: '600' }}>{stats.totalCards}</div>
        </div>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>In Progress</div>
          <div style={{ color: '#4a9eff', fontSize: '32px', fontWeight: '600' }}>{inProgressCards.length}</div>
        </div>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Overdue</div>
          <div style={{ color: '#eb5a46', fontSize: '32px', fontWeight: '600' }}>{stats.overdueCards}</div>
        </div>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Completed This Week</div>
          <div style={{ color: '#61bd4f', fontSize: '32px', fontWeight: '600' }}>{stats.completedThisWeek}</div>
        </div>
      </div>

      {/* Overdue Cards Alert */}
      {overdueCards.length > 0 && (
        <div style={{
          background: '#eb5a46',
          color: '#fff',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '14px',
        }}>
          ⚠️ You have {overdueCards.length} overdue card{overdueCards.length > 1 ? 's' : ''}
        </div>
      )}

      {/* Card Sections */}
      <div style={{ display: 'grid', gap: '24px' }}>
        {overdueCards.length > 0 && (
          <div>
            <h2 style={{ color: '#eb5a46', fontSize: '18px', marginBottom: '12px' }}>Overdue ({overdueCards.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {overdueCards.map(card => (
                <div
                  key={card.id}
                  style={{
                    background: '#2a2a2a',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '2px solid #eb5a46',
                  }}
                >
                  <div style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>{card.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#888' }}>{card.boardName} / {card.listName}</span>
                    <span style={{ color: '#eb5a46' }}>
                      Due: {card.due ? new Date(card.due).toLocaleDateString() : 'No due date'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '12px' }}>In Progress ({inProgressCards.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {inProgressCards.map(card => (
              <div
                key={card.id}
                style={{
                  background: '#2a2a2a',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #333',
                }}
              >
                <div style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>{card.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#888' }}>{card.boardName} / {card.listName}</span>
                  {card.due && (
                    <span style={{ color: '#ccc' }}>
                      Due: {new Date(card.due).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '12px' }}>To Do ({todoCards.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {todoCards.map(card => (
              <div
                key={card.id}
                style={{
                  background: '#2a2a2a',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #333',
                }}
              >
                <div style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>{card.name}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                  <span style={{ color: '#888' }}>{card.boardName} / {card.listName}</span>
                  {card.due && (
                    <span style={{ color: '#ccc' }}>
                      Due: {new Date(card.due).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {reviewCards.length > 0 && (
          <div>
            <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '12px' }}>In Review ({reviewCards.length})</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {reviewCards.map(card => (
                <div
                  key={card.id}
                  style={{
                    background: '#2a2a2a',
                    padding: '16px',
                    borderRadius: '8px',
                    border: '1px solid #333',
                  }}
                >
                  <div style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>{card.name}</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#888' }}>{card.boardName} / {card.listName}</span>
                    {card.due && (
                      <span style={{ color: '#ccc' }}>
                        Due: {new Date(card.due).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
