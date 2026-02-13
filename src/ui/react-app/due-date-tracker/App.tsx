import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Card {
  id: string;
  name: string;
  boardName: string;
  listName: string;
  due: string;
  dueComplete: boolean;
  labels: { name: string; color: string }[];
  members: string[];
}

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'overdue' | 'upcoming' | 'today'>('all');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const now = new Date();
      const mockCards: Card[] = [
        {
          id: '1',
          name: 'Fix critical login bug',
          boardName: 'Engineering',
          listName: 'In Progress',
          due: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
          dueComplete: false,
          labels: [{ name: 'Bug', color: '#eb5a46' }],
          members: ['Alice'],
        },
        {
          id: '2',
          name: 'Update API documentation',
          boardName: 'Engineering',
          listName: 'To Do',
          due: new Date().toISOString().split('T')[0] + 'T12:00:00Z', // Today
          dueComplete: false,
          labels: [{ name: 'Documentation', color: '#00c2e0' }],
          members: ['Bob'],
        },
        {
          id: '3',
          name: 'Design landing page',
          boardName: 'Marketing',
          listName: 'In Progress',
          due: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
          dueComplete: false,
          labels: [{ name: 'Design', color: '#c377e0' }],
          members: ['Carol'],
        },
        {
          id: '4',
          name: 'Q1 Planning',
          boardName: 'Strategy',
          listName: 'To Do',
          due: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
          dueComplete: false,
          labels: [{ name: 'Planning', color: '#f2d600' }],
          members: ['Alice', 'Bob'],
        },
        {
          id: '5',
          name: 'Write blog post',
          boardName: 'Marketing',
          listName: 'Done',
          due: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
          dueComplete: true,
          labels: [{ name: 'Content', color: '#61bd4f' }],
          members: ['Carol'],
        },
      ];
      setCards(mockCards);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load cards:', error);
      setLoading(false);
    }
  };

  const isOverdue = (card: Card) => {
    if (card.dueComplete) return false;
    return new Date(card.due) < new Date();
  };

  const isToday = (date: string) => {
    const today = new Date().toISOString().split('T')[0];
    return date.split('T')[0] === today;
  };

  const getDaysUntilDue = (due: string) => {
    const now = new Date();
    const dueDate = new Date(due);
    const diffMs = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getDueDateColor = (card: Card) => {
    if (card.dueComplete) return '#61bd4f';
    if (isOverdue(card)) return '#eb5a46';
    if (isToday(card.due)) return '#f2d600';
    if (getDaysUntilDue(card.due) <= 3) return '#ff9f1a';
    return '#888';
  };

  const getDueDateText = (card: Card) => {
    if (isOverdue(card)) {
      const days = Math.abs(getDaysUntilDue(card.due));
      return `${days} day${days !== 1 ? 's' : ''} overdue`;
    }
    if (isToday(card.due)) return 'Due today';
    const days = getDaysUntilDue(card.due);
    return `Due in ${days} day${days !== 1 ? 's' : ''}`;
  };

  const filteredCards = cards.filter(card => {
    switch (filter) {
      case 'overdue':
        return isOverdue(card);
      case 'today':
        return !card.dueComplete && isToday(card.due);
      case 'upcoming':
        return !card.dueComplete && !isOverdue(card) && !isToday(card.due);
      default:
        return true;
    }
  });

  const sortedCards = [...filteredCards].sort((a, b) => {
    return new Date(a.due).getTime() - new Date(b.due).getTime();
  });

  const overdueCount = cards.filter(isOverdue).length;
  const todayCount = cards.filter(c => !c.dueComplete && isToday(c.due)).length;

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading due dates...
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
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>Due Date Tracker</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '24px', maxWidth: '600px' }}>
        <div style={{ background: '#2a2a2a', padding: '16px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>OVERDUE</div>
          <div style={{ color: '#eb5a46', fontSize: '28px', fontWeight: '600' }}>{overdueCount}</div>
        </div>
        <div style={{ background: '#2a2a2a', padding: '16px', borderRadius: '8px', border: '1px solid #333' }}>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>DUE TODAY</div>
          <div style={{ color: '#f2d600', fontSize: '28px', fontWeight: '600' }}>{todayCount}</div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {(['all', 'overdue', 'today', 'upcoming'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px',
              background: filter === f ? '#4a9eff' : '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              textTransform: 'capitalize',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Cards List */}
      <div style={{ maxWidth: '900px' }}>
        {sortedCards.length === 0 ? (
          <div style={{
            background: '#2a2a2a',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#888',
            border: '1px solid #333',
          }}>
            No cards match this filter
          </div>
        ) : (
          sortedCards.map(card => (
            <div
              key={card.id}
              style={{
                background: '#2a2a2a',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                border: `2px solid ${getDueDateColor(card)}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>
                    {card.name}
                  </h3>
                  <div style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>
                    {card.boardName} / {card.listName}
                  </div>
                  {card.labels.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {card.labels.map((label, idx) => (
                        <span
                          key={idx}
                          style={{
                            background: label.color,
                            color: '#fff',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                          }}
                        >
                          {label.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right', minWidth: '120px' }}>
                  <div style={{
                    color: getDueDateColor(card),
                    fontSize: '14px',
                    fontWeight: '600',
                    marginBottom: '4px',
                  }}>
                    {card.dueComplete ? '✓ Complete' : getDueDateText(card)}
                  </div>
                  <div style={{ color: '#888', fontSize: '12px' }}>
                    {new Date(card.due).toLocaleDateString()}
                  </div>
                </div>
              </div>
              {card.members.length > 0 && (
                <div style={{ color: '#888', fontSize: '12px' }}>
                  👤 {card.members.join(', ')}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
