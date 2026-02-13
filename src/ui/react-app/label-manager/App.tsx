import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Label {
  id: string;
  name: string;
  color: string;
  boardName: string;
  usageCount: number;
}

const App: React.FC = () => {
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterBoard, setFilterBoard] = useState('All');
  const [filterColor, setFilterColor] = useState('All');

  useEffect(() => {
    loadLabels();
  }, []);

  const loadLabels = async () => {
    try {
      const mockLabels: Label[] = [
        { id: '1', name: 'Bug', color: '#eb5a46', boardName: 'Engineering', usageCount: 12 },
        { id: '2', name: 'Feature', color: '#61bd4f', boardName: 'Engineering', usageCount: 18 },
        { id: '3', name: 'Urgent', color: '#f2d600', boardName: 'Engineering', usageCount: 5 },
        { id: '4', name: 'Documentation', color: '#00c2e0', boardName: 'Engineering', usageCount: 8 },
        { id: '5', name: 'Campaign', color: '#ff9f1a', boardName: 'Marketing', usageCount: 14 },
        { id: '6', name: 'Design', color: '#c377e0', boardName: 'Marketing', usageCount: 9 },
        { id: '7', name: 'Content', color: '#0079bf', boardName: 'Marketing', usageCount: 11 },
        { id: '8', name: 'High Priority', color: '#eb5a46', boardName: 'Product', usageCount: 6 },
        { id: '9', name: 'Research', color: '#00c2e0', boardName: 'Product', usageCount: 7 },
      ];
      setLabels(mockLabels);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load labels:', error);
      setLoading(false);
    }
  };

  const boards = ['All', ...Array.from(new Set(labels.map(l => l.boardName)))];
  const colors = ['All', ...Array.from(new Set(labels.map(l => l.color)))];

  const filteredLabels = labels.filter(label => {
    const matchBoard = filterBoard === 'All' || label.boardName === filterBoard;
    const matchColor = filterColor === 'All' || label.color === filterColor;
    return matchBoard && matchColor;
  });

  const totalUsage = filteredLabels.reduce((sum, label) => sum + label.usageCount, 0);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading labels...
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
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>Label Manager</h1>

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
          value={filterColor}
          onChange={(e) => setFilterColor(e.target.value)}
          style={{
            padding: '10px',
            background: '#2a2a2a',
            border: '1px solid #444',
            borderRadius: '6px',
            color: '#fff',
            fontSize: '14px',
          }}
        >
          <option value="All">All Colors</option>
          {colors.filter(c => c !== 'All').map(color => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>
        <div style={{ color: '#888', padding: '10px', fontSize: '14px' }}>
          {filteredLabels.length} labels · {totalUsage} total uses
        </div>
      </div>

      <div style={{ display: 'grid', gap: '12px' }}>
        {filteredLabels.map(label => {
          const percentage = totalUsage > 0 ? Math.round((label.usageCount / totalUsage) * 100) : 0;
          
          return (
            <div
              key={label.id}
              style={{
                background: '#2a2a2a',
                borderRadius: '8px',
                padding: '20px',
                border: '1px solid #333',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '6px',
                      background: label.color,
                    }}
                  />
                  <div>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: '600' }}>
                      {label.name || 'Unnamed'}
                    </div>
                    <div style={{ color: '#888', fontSize: '13px' }}>
                      {label.boardName}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#fff', fontSize: '24px', fontWeight: '600' }}>
                    {label.usageCount}
                  </div>
                  <div style={{ color: '#888', fontSize: '12px' }}>
                    uses
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#888', fontSize: '12px' }}>Usage</span>
                  <span style={{ color: '#888', fontSize: '12px' }}>{percentage}%</span>
                </div>
                <div style={{ background: '#1a1a1a', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    background: label.color,
                    height: '100%',
                    width: `${percentage}%`,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
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
