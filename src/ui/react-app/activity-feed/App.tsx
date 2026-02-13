import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Action {
  id: string;
  type: string;
  memberName: string;
  data: {
    card?: string;
    board?: string;
    list?: string;
    listBefore?: string;
    listAfter?: string;
    text?: string;
  };
  date: string;
}

const App: React.FC = () => {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    loadActions();
  }, []);

  const loadActions = async () => {
    try {
      const mockActions: Action[] = [
        {
          id: '1',
          type: 'createCard',
          memberName: 'Alice Johnson',
          data: { card: 'Fix login bug', board: 'Engineering', list: 'To Do' },
          date: '2024-02-12T10:30:00Z',
        },
        {
          id: '2',
          type: 'updateCard',
          memberName: 'Bob Smith',
          data: { card: 'Update documentation', listBefore: 'In Progress', listAfter: 'Done', board: 'Engineering' },
          date: '2024-02-12T10:15:00Z',
        },
        {
          id: '3',
          type: 'commentCard',
          memberName: 'Carol White',
          data: { card: 'Design landing page', board: 'Marketing', text: 'Looks great! Ready for review' },
          date: '2024-02-12T09:45:00Z',
        },
        {
          id: '4',
          type: 'addMemberToCard',
          memberName: 'David Brown',
          data: { card: 'Q1 Planning', board: 'Strategy' },
          date: '2024-02-12T09:30:00Z',
        },
        {
          id: '5',
          type: 'deleteCard',
          memberName: 'Alice Johnson',
          data: { card: 'Old task', board: 'Engineering', list: 'Done' },
          date: '2024-02-12T09:00:00Z',
        },
        {
          id: '6',
          type: 'createCard',
          memberName: 'Emma Davis',
          data: { card: 'Customer feedback analysis', board: 'Product', list: 'To Do' },
          date: '2024-02-12T08:45:00Z',
        },
        {
          id: '7',
          type: 'addAttachmentToCard',
          memberName: 'Bob Smith',
          data: { card: 'API Documentation', board: 'Engineering' },
          date: '2024-02-12T08:30:00Z',
        },
      ];
      setActions(mockActions);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load actions:', error);
      setLoading(false);
    }
  };

  const getActionIcon = (type: string) => {
    const icons: Record<string, string> = {
      createCard: '➕',
      updateCard: '🔄',
      commentCard: '💬',
      addMemberToCard: '👤',
      deleteCard: '🗑️',
      addAttachmentToCard: '📎',
    };
    return icons[type] || '📌';
  };

  const getActionText = (action: Action) => {
    const { type, memberName, data } = action;
    switch (type) {
      case 'createCard':
        return (
          <>
            <strong>{memberName}</strong> created card{' '}
            <span style={{ color: '#4a9eff' }}>{data.card}</span>{' '}
            in <span style={{ color: '#888' }}>{data.list}</span> on{' '}
            <span style={{ color: '#888' }}>{data.board}</span>
          </>
        );
      case 'updateCard':
        return (
          <>
            <strong>{memberName}</strong> moved{' '}
            <span style={{ color: '#4a9eff' }}>{data.card}</span>{' '}
            from <span style={{ color: '#888' }}>{data.listBefore}</span> to{' '}
            <span style={{ color: '#888' }}>{data.listAfter}</span>
          </>
        );
      case 'commentCard':
        return (
          <>
            <strong>{memberName}</strong> commented on{' '}
            <span style={{ color: '#4a9eff' }}>{data.card}</span>
            {data.text && (
              <div style={{ color: '#888', fontSize: '13px', marginTop: '4px', fontStyle: 'italic' }}>
                "{data.text}"
              </div>
            )}
          </>
        );
      case 'addMemberToCard':
        return (
          <>
            <strong>{memberName}</strong> joined card{' '}
            <span style={{ color: '#4a9eff' }}>{data.card}</span>
          </>
        );
      case 'deleteCard':
        return (
          <>
            <strong>{memberName}</strong> deleted card{' '}
            <span style={{ color: '#eb5a46' }}>{data.card}</span>
          </>
        );
      case 'addAttachmentToCard':
        return (
          <>
            <strong>{memberName}</strong> added an attachment to{' '}
            <span style={{ color: '#4a9eff' }}>{data.card}</span>
          </>
        );
      default:
        return <><strong>{memberName}</strong> performed an action</>;
    }
  };

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const actionTypes = ['All', 'createCard', 'updateCard', 'commentCard', 'addMemberToCard', 'deleteCard', 'addAttachmentToCard'];
  const filteredActions = filterType === 'All' ? actions : actions.filter(a => a.type === filterType);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading activity...
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
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>Activity Feed</h1>

      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
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
        {actionTypes.map(type => (
          <option key={type} value={type}>
            {type === 'All' ? 'All Actions' : type.replace(/([A-Z])/g, ' $1').trim()}
          </option>
        ))}
      </select>

      <div style={{ maxWidth: '800px' }}>
        {filteredActions.map(action => (
          <div
            key={action.id}
            style={{
              background: '#2a2a2a',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '12px',
              border: '1px solid #333',
              display: 'flex',
              gap: '16px',
            }}
          >
            <div style={{ fontSize: '24px', flexShrink: 0 }}>
              {getActionIcon(action.type)}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.6', marginBottom: '8px' }}>
                {getActionText(action)}
              </div>
              <div style={{ color: '#888', fontSize: '12px' }}>
                {getRelativeTime(action.date)}
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
