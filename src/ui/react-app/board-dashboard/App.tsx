import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface BoardStats {
  totalCards: number;
  cardsByList: { listName: string; count: number }[];
  labelUsage: { labelName: string; color: string; count: number }[];
  memberActivity: { memberName: string; assignedCards: number }[];
  overdueCards: number;
  completedThisWeek: number;
}

const App: React.FC = () => {
  const [stats, setStats] = useState<BoardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBoardStats();
  }, []);

  const loadBoardStats = async () => {
    try {
      const mockStats: BoardStats = {
        totalCards: 47,
        cardsByList: [
          { listName: 'To Do', count: 12 },
          { listName: 'In Progress', count: 8 },
          { listName: 'Review', count: 5 },
          { listName: 'Done', count: 22 },
        ],
        labelUsage: [
          { labelName: 'Bug', color: '#eb5a46', count: 8 },
          { labelName: 'Feature', color: '#61bd4f', count: 15 },
          { labelName: 'Urgent', color: '#f2d600', count: 4 },
          { labelName: 'Documentation', color: '#00c2e0', count: 6 },
        ],
        memberActivity: [
          { memberName: 'Alice Johnson', assignedCards: 12 },
          { memberName: 'Bob Smith', assignedCards: 9 },
          { memberName: 'Carol White', assignedCards: 7 },
          { memberName: 'David Brown', assignedCards: 5 },
        ],
        overdueCards: 3,
        completedThisWeek: 8,
      };
      setStats(mockStats);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load board stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading dashboard...
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

  return (
    <div style={{
      background: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <h1 style={{ color: '#fff', marginBottom: '24px' }}>Board Dashboard</h1>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Total Cards</div>
          <div style={{ color: '#fff', fontSize: '32px', fontWeight: '600' }}>{stats.totalCards}</div>
        </div>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Completed This Week</div>
          <div style={{ color: '#61bd4f', fontSize: '32px', fontWeight: '600' }}>{stats.completedThisWeek}</div>
        </div>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>Overdue</div>
          <div style={{ color: '#eb5a46', fontSize: '32px', fontWeight: '600' }}>{stats.overdueCards}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Cards by List */}
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px' }}>Cards by List</h2>
          {stats.cardsByList.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#ccc', fontSize: '14px' }}>{item.listName}</span>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{item.count}</span>
              </div>
              <div style={{ background: '#1a1a1a', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  background: '#4a9eff',
                  height: '100%',
                  width: `${(item.count / stats.totalCards) * 100}%`,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Label Usage */}
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px' }}>Label Usage</h2>
          {stats.labelUsage.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '12px',
                    height: '12px',
                    borderRadius: '2px',
                    background: item.color,
                  }} />
                  <span style={{ color: '#ccc', fontSize: '14px' }}>{item.labelName}</span>
                </div>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{item.count}</span>
              </div>
              <div style={{ background: '#1a1a1a', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{
                  background: item.color,
                  height: '100%',
                  width: `${(item.count / stats.totalCards) * 100}%`,
                  transition: 'width 0.3s ease',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Member Activity */}
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px' }}>Member Activity</h2>
          {stats.memberActivity.map((item, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '12px',
              background: '#333',
              borderRadius: '6px',
              marginBottom: '8px',
            }}>
              <span style={{ color: '#ccc', fontSize: '14px' }}>{item.memberName}</span>
              <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>
                {item.assignedCards} cards
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
