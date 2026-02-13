import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface AnalyticsData {
  boardName: string;
  totalCards: number;
  completionRate: number;
  avgTimeInProgress: number;
  cardFlow: {
    week: string;
    created: number;
    completed: number;
  }[];
  listDistribution: {
    listName: string;
    count: number;
  }[];
  memberProductivity: {
    memberName: string;
    cardsCompleted: number;
    avgCompletionTime: number;
  }[];
}

const App: React.FC = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const mockAnalytics: AnalyticsData = {
        boardName: 'Engineering Sprint',
        totalCards: 127,
        completionRate: 68,
        avgTimeInProgress: 3.5,
        cardFlow: [
          { week: 'Week 1', created: 12, completed: 8 },
          { week: 'Week 2', created: 15, completed: 11 },
          { week: 'Week 3', created: 18, completed: 14 },
          { week: 'Week 4', created: 14, completed: 16 },
        ],
        listDistribution: [
          { listName: 'Backlog', count: 24 },
          { listName: 'To Do', count: 12 },
          { listName: 'In Progress', count: 8 },
          { listName: 'Review', count: 5 },
          { listName: 'Done', count: 78 },
        ],
        memberProductivity: [
          { memberName: 'Alice Johnson', cardsCompleted: 28, avgCompletionTime: 2.8 },
          { memberName: 'Bob Smith', cardsCompleted: 22, avgCompletionTime: 3.2 },
          { memberName: 'Carol White', cardsCompleted: 18, avgCompletionTime: 4.1 },
          { memberName: 'David Brown', cardsCompleted: 10, avgCompletionTime: 3.9 },
        ],
      };
      setAnalytics(mockAnalytics);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading analytics...
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        No analytics data available
      </div>
    );
  }

  const maxFlow = Math.max(...analytics.cardFlow.flatMap(w => [w.created, w.completed]));

  return (
    <div style={{
      background: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <h1 style={{ color: '#fff', marginBottom: '8px' }}>Board Analytics</h1>
      <div style={{ color: '#888', fontSize: '16px', marginBottom: '24px' }}>{analytics.boardName}</div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>TOTAL CARDS</div>
          <div style={{ color: '#fff', fontSize: '32px', fontWeight: '600' }}>{analytics.totalCards}</div>
        </div>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>COMPLETION RATE</div>
          <div style={{ color: '#61bd4f', fontSize: '32px', fontWeight: '600' }}>{analytics.completionRate}%</div>
        </div>
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>AVG TIME IN PROGRESS</div>
          <div style={{ color: '#4a9eff', fontSize: '32px', fontWeight: '600' }}>
            {analytics.avgTimeInProgress}<span style={{ fontSize: '16px', color: '#888' }}>d</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Card Flow */}
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px' }}>Card Flow (Last 4 Weeks)</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {analytics.cardFlow.map((week, idx) => (
              <div key={idx}>
                <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px' }}>{week.week}</div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#888', fontSize: '11px', marginBottom: '4px' }}>Created: {week.created}</div>
                    <div style={{ background: '#1a1a1a', height: '20px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        background: '#4a9eff',
                        height: '100%',
                        width: `${(week.created / maxFlow) * 100}%`,
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: '#888', fontSize: '11px', marginBottom: '4px' }}>Completed: {week.completed}</div>
                    <div style={{ background: '#1a1a1a', height: '20px', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        background: '#61bd4f',
                        height: '100%',
                        width: `${(week.completed / maxFlow) * 100}%`,
                        transition: 'width 0.3s ease',
                      }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* List Distribution */}
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px' }}>List Distribution</h2>
          {analytics.listDistribution.map((list, idx) => {
            const percentage = Math.round((list.count / analytics.totalCards) * 100);
            return (
              <div key={idx} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#ccc', fontSize: '14px' }}>{list.listName}</span>
                  <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{list.count}</span>
                </div>
                <div style={{ background: '#1a1a1a', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    background: '#c377e0',
                    height: '100%',
                    width: `${percentage}%`,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Member Productivity */}
        <div style={{ background: '#2a2a2a', padding: '20px', borderRadius: '8px', border: '1px solid #333', gridColumn: 'span 1' }}>
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px' }}>Member Productivity</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analytics.memberProductivity.map((member, idx) => (
              <div
                key={idx}
                style={{
                  background: '#333',
                  padding: '16px',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600', marginBottom: '4px' }}>
                    {member.memberName}
                  </div>
                  <div style={{ color: '#888', fontSize: '12px' }}>
                    Avg completion: {member.avgCompletionTime} days
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#61bd4f', fontSize: '24px', fontWeight: '600' }}>
                    {member.cardsCompleted}
                  </div>
                  <div style={{ color: '#888', fontSize: '11px' }}>completed</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
