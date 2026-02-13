import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface ChecklistItem {
  id: string;
  name: string;
  checked: boolean;
}

interface Checklist {
  id: string;
  name: string;
  cardName: string;
  boardName: string;
  items: ChecklistItem[];
}

const App: React.FC = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBoard, setFilterBoard] = useState('All');

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      const mockChecklists: Checklist[] = [
        {
          id: '1',
          name: 'Backend Implementation',
          cardName: 'User Authentication',
          boardName: 'Engineering',
          items: [
            { id: 'i1', name: 'Set up OAuth providers', checked: true },
            { id: 'i2', name: 'Create user model', checked: true },
            { id: 'i3', name: 'Implement token refresh', checked: false },
            { id: 'i4', name: 'Add rate limiting', checked: false },
          ],
        },
        {
          id: '2',
          name: 'Frontend Tasks',
          cardName: 'User Authentication',
          boardName: 'Engineering',
          items: [
            { id: 'i5', name: 'Design login page', checked: true },
            { id: 'i6', name: 'Add OAuth buttons', checked: false },
            { id: 'i7', name: 'Handle auth state', checked: false },
          ],
        },
        {
          id: '3',
          name: 'Campaign Launch',
          cardName: 'Q1 Marketing Campaign',
          boardName: 'Marketing',
          items: [
            { id: 'i8', name: 'Design creatives', checked: true },
            { id: 'i9', name: 'Write copy', checked: true },
            { id: 'i10', name: 'Set up email automation', checked: true },
            { id: 'i11', name: 'Launch ads', checked: false },
            { id: 'i12', name: 'Monitor metrics', checked: false },
          ],
        },
        {
          id: '4',
          name: 'Documentation',
          cardName: 'API v2 Release',
          boardName: 'Engineering',
          items: [
            { id: 'i13', name: 'Write API reference', checked: true },
            { id: 'i14', name: 'Create migration guide', checked: false },
            { id: 'i15', name: 'Add examples', checked: false },
          ],
        },
      ];
      setChecklists(mockChecklists);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load checklists:', error);
      setLoading(false);
    }
  };

  const boards = ['All', ...Array.from(new Set(checklists.map(c => c.boardName)))];
  const filteredChecklists = filterBoard === 'All' 
    ? checklists 
    : checklists.filter(c => c.boardName === filterBoard);

  const getCompletionPercentage = (items: ChecklistItem[]) => {
    if (items.length === 0) return 0;
    const completed = items.filter(i => i.checked).length;
    return Math.round((completed / items.length) * 100);
  };

  const toggleItem = (checklistId: string, itemId: string) => {
    setChecklists(prev => prev.map(checklist => {
      if (checklist.id === checklistId) {
        return {
          ...checklist,
          items: checklist.items.map(item =>
            item.id === itemId ? { ...item, checked: !item.checked } : item
          ),
        };
      }
      return checklist;
    }));
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading checklists...
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
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>Checklist Progress</h1>

      <select
        value={filterBoard}
        onChange={(e) => setFilterBoard(e.target.value)}
        style={{
          padding: '10px',
          marginBottom: '24px',
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

      <div style={{ display: 'grid', gap: '20px', maxWidth: '900px' }}>
        {filteredChecklists.map(checklist => {
          const percentage = getCompletionPercentage(checklist.items);
          const completed = checklist.items.filter(i => i.checked).length;
          const total = checklist.items.length;

          return (
            <div
              key={checklist.id}
              style={{
                background: '#2a2a2a',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #333',
              }}
            >
              <div style={{ marginBottom: '16px' }}>
                <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '4px' }}>
                  {checklist.name}
                </h2>
                <div style={{ color: '#888', fontSize: '13px' }}>
                  {checklist.cardName} · {checklist.boardName}
                </div>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ color: '#ccc', fontSize: '14px', fontWeight: '600' }}>
                    {completed} of {total} completed
                  </span>
                  <span style={{
                    color: percentage === 100 ? '#61bd4f' : '#ccc',
                    fontSize: '18px',
                    fontWeight: '600',
                  }}>
                    {percentage}%
                  </span>
                </div>
                <div style={{
                  background: '#1a1a1a',
                  height: '12px',
                  borderRadius: '6px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    background: percentage === 100 ? '#61bd4f' : '#4a9eff',
                    height: '100%',
                    width: `${percentage}%`,
                    transition: 'width 0.3s ease, background 0.3s ease',
                  }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {checklist.items.map(item => (
                  <div
                    key={item.id}
                    style={{
                      background: '#333',
                      padding: '12px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                    }}
                    onClick={() => toggleItem(checklist.id, item.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#3a3a3a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#333';
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => {}}
                      style={{
                        width: '18px',
                        height: '18px',
                        cursor: 'pointer',
                      }}
                    />
                    <span style={{
                      color: item.checked ? '#888' : '#ccc',
                      fontSize: '14px',
                      textDecoration: item.checked ? 'line-through' : 'none',
                      flex: 1,
                    }}>
                      {item.name}
                    </span>
                    {item.checked && (
                      <span style={{ color: '#61bd4f', fontSize: '16px' }}>✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
