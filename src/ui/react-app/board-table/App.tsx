import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Card {
  id: string;
  name: string;
  listName: string;
  labels: string[];
  members: string[];
  due: string | null;
  priority: 'Low' | 'Medium' | 'High' | '';
}

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<keyof Card>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const mockCards: Card[] = [
        { id: '1', name: 'Fix login bug', listName: 'In Progress', labels: ['Bug', 'Urgent'], members: ['Alice'], due: '2024-02-20', priority: 'High' },
        { id: '2', name: 'Update documentation', listName: 'To Do', labels: ['Documentation'], members: ['Bob'], due: '2024-02-25', priority: 'Low' },
        { id: '3', name: 'Add new feature', listName: 'To Do', labels: ['Feature'], members: ['Alice', 'Carol'], due: '2024-03-01', priority: 'Medium' },
        { id: '4', name: 'Code review', listName: 'Review', labels: [], members: ['David'], due: null, priority: 'Medium' },
        { id: '5', name: 'Deploy to production', listName: 'Done', labels: ['Release'], members: ['Alice'], due: '2024-02-15', priority: 'High' },
      ];
      setCards(mockCards);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load cards:', error);
      setLoading(false);
    }
  };

  const handleSort = (field: keyof Card) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredAndSorted = cards
    .filter(card =>
      card.name.toLowerCase().includes(filterText.toLowerCase()) ||
      card.listName.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      const aVal = a[sortField] || '';
      const bVal = b[sortField] || '';
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aVal > bVal ? direction : aVal < bVal ? -direction : 0;
    });

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading table...
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
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>Board Table View</h1>
      
      <input
        type="text"
        placeholder="Filter cards..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        style={{
          width: '100%',
          maxWidth: '400px',
          padding: '12px',
          marginBottom: '20px',
          background: '#2a2a2a',
          border: '1px solid #444',
          borderRadius: '6px',
          color: '#fff',
          fontSize: '14px',
        }}
      />

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#2a2a2a', borderRadius: '8px' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444' }}>
              {['name', 'listName', 'priority', 'due', 'labels', 'members'].map((field) => (
                <th
                  key={field}
                  onClick={() => handleSort(field as keyof Card)}
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {sortField === field && (
                    <span style={{ marginLeft: '8px' }}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAndSorted.map((card) => (
              <tr key={card.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '16px', color: '#fff', fontSize: '14px' }}>{card.name}</td>
                <td style={{ padding: '16px', color: '#ccc', fontSize: '14px' }}>{card.listName}</td>
                <td style={{ padding: '16px', fontSize: '14px' }}>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    background: card.priority === 'High' ? '#eb5a46' : card.priority === 'Medium' ? '#f2d600' : '#61bd4f',
                    color: '#fff',
                  }}>
                    {card.priority || 'None'}
                  </span>
                </td>
                <td style={{ padding: '16px', color: '#ccc', fontSize: '14px' }}>
                  {card.due ? new Date(card.due).toLocaleDateString() : '-'}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {card.labels.map((label, idx) => (
                      <span
                        key={idx}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          background: '#555',
                          color: '#fff',
                        }}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '16px', color: '#ccc', fontSize: '14px' }}>
                  {card.members.join(', ')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
