import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Card {
  id: string;
  name: string;
  boardName: string;
  listName: string;
  labels: { name: string; color: string }[];
  due: string | null;
  members: string[];
}

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBoard, setFilterBoard] = useState('All');
  const [filterLabel, setFilterLabel] = useState('All');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const mockCards: Card[] = [
        { id: '1', name: 'Design landing page', boardName: 'Marketing', listName: 'In Progress', labels: [{ name: 'Design', color: '#00c2e0' }], due: '2024-02-20', members: ['Alice'] },
        { id: '2', name: 'Fix API bug', boardName: 'Engineering', listName: 'To Do', labels: [{ name: 'Bug', color: '#eb5a46' }], due: '2024-02-15', members: ['Bob'] },
        { id: '3', name: 'Write blog post', boardName: 'Marketing', listName: 'Review', labels: [{ name: 'Content', color: '#f2d600' }], due: null, members: ['Carol'] },
        { id: '4', name: 'Update dependencies', boardName: 'Engineering', listName: 'Done', labels: [{ name: 'Maintenance', color: '#61bd4f' }], due: '2024-02-10', members: ['David'] },
        { id: '5', name: 'Q1 planning', boardName: 'Strategy', listName: 'To Do', labels: [{ name: 'Planning', color: '#c377e0' }], due: '2024-03-01', members: ['Alice', 'Bob'] },
        { id: '6', name: 'Customer feedback analysis', boardName: 'Product', listName: 'In Progress', labels: [{ name: 'Research', color: '#ff9f1a' }], due: null, members: ['Carol'] },
      ];
      setCards(mockCards);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load cards:', error);
      setLoading(false);
    }
  };

  const boards = ['All', ...Array.from(new Set(cards.map(c => c.boardName)))];
  const labels = ['All', ...Array.from(new Set(cards.flatMap(c => c.labels.map(l => l.name))))];

  const filteredCards = cards.filter(card => {
    const matchBoard = filterBoard === 'All' || card.boardName === filterBoard;
    const matchLabel = filterLabel === 'All' || card.labels.some(l => l.name === filterLabel);
    return matchBoard && matchLabel;
  });

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading cards...
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
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>All Cards</h1>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <select
          value={filterBoard}
          onChange={(e) => setFilterBoard(e.target.value)}
          style={{
            padding: '10px',
            background: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
          }}
        >
          {boards.map(board => (
            <option key={board} value={board}>{board}</option>
          ))}
        </select>
        <select
          value={filterLabel}
          onChange={(e) => setFilterLabel(e.target.value)}
          style={{
            padding: '10px',
            background: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
          }}
        >
          {labels.map(label => (
            <option key={label} value={label}>{label}</option>
          ))}
        </select>
        <div style={{ color: '#888', padding: '10px', fontSize: '14px' }}>
          {filteredCards.length} cards
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {filteredCards.map(card => (
          <div
            key={card.id}
            style={{
              background: '#2a2a2a',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #333',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <h3 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px' }}>
              {card.name}
            </h3>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>
              {card.boardName} / {card.listName}
            </div>
            {card.labels.length > 0 && (
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '12px' }}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#888', fontSize: '12px' }}>
                {card.members.join(', ')}
              </div>
              {card.due && (
                <div style={{ color: '#ccc', fontSize: '12px' }}>
                  {new Date(card.due).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
