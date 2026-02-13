import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface SearchResult {
  id: string;
  type: 'card' | 'board' | 'member';
  name: string;
  description?: string;
  boardName?: string;
  listName?: string;
  labels?: { name: string; color: string }[];
}

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'card' | 'board' | 'member'>('all');

  const mockData: SearchResult[] = [
    {
      id: '1',
      type: 'card',
      name: 'Fix authentication bug',
      description: 'Users unable to login with OAuth',
      boardName: 'Engineering',
      listName: 'In Progress',
      labels: [{ name: 'Bug', color: '#eb5a46' }],
    },
    {
      id: '2',
      type: 'card',
      name: 'Update API documentation',
      description: 'Add examples for new endpoints',
      boardName: 'Engineering',
      listName: 'To Do',
      labels: [{ name: 'Documentation', color: '#00c2e0' }],
    },
    {
      id: '3',
      type: 'board',
      name: 'Engineering Sprint',
      description: 'Current sprint planning and execution',
    },
    {
      id: '4',
      type: 'member',
      name: 'Alice Johnson',
      description: 'alice@example.com',
    },
    {
      id: '5',
      type: 'card',
      name: 'Design landing page',
      description: 'New homepage design for Q1',
      boardName: 'Marketing',
      listName: 'In Progress',
      labels: [{ name: 'Design', color: '#c377e0' }],
    },
  ];

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim().length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const filtered = mockData.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 300);
  };

  const filteredResults = filterType === 'all' 
    ? results 
    : results.filter(r => r.type === filterType);

  const getTypeIcon = (type: string) => {
    const icons = { card: '📋', board: '📊', member: '👤' };
    return icons[type as keyof typeof icons] || '📌';
  };

  const getTypeBadgeColor = (type: string) => {
    const colors = { card: '#4a9eff', board: '#61bd4f', member: '#f2d600' };
    return colors[type as keyof typeof colors] || '#888';
  };

  return (
    <div style={{
      background: '#1a1a1a',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    }}>
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>Search</h1>

      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Search cards, boards, members..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          autoFocus
          style={{
            width: '100%',
            maxWidth: '600px',
            padding: '16px',
            background: '#2a2a2a',
            border: '2px solid #444',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '16px',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {(['all', 'card', 'board', 'member'] as const).map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            style={{
              padding: '8px 16px',
              background: filterType === type ? '#4a9eff' : '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
              textTransform: 'capitalize',
            }}
          >
            {type} {type !== 'all' && `(${results.filter(r => r.type === type).length})`}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ color: '#888', fontSize: '14px' }}>Searching...</div>
      )}

      {!loading && query.length > 0 && filteredResults.length === 0 && (
        <div style={{ color: '#888', fontSize: '14px' }}>No results found for "{query}"</div>
      )}

      {!loading && filteredResults.length > 0 && (
        <div>
          <div style={{ color: '#888', fontSize: '14px', marginBottom: '16px' }}>
            {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''}
          </div>
          <div style={{ display: 'grid', gap: '12px', maxWidth: '800px' }}>
            {filteredResults.map(result => (
              <div
                key={result.id}
                style={{
                  background: '#2a2a2a',
                  borderRadius: '8px',
                  padding: '16px',
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
                <div style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                  <div style={{ fontSize: '24px', flexShrink: 0 }}>
                    {getTypeIcon(result.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <h3 style={{ color: '#fff', fontSize: '16px' }}>{result.name}</h3>
                      <span
                        style={{
                          background: getTypeBadgeColor(result.type),
                          color: '#fff',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {result.type}
                      </span>
                    </div>
                    {result.description && (
                      <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px' }}>
                        {result.description}
                      </div>
                    )}
                    {result.type === 'card' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                        <span style={{ color: '#888' }}>
                          {result.boardName} / {result.listName}
                        </span>
                        {result.labels && result.labels.length > 0 && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {result.labels.map((label, idx) => (
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
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
