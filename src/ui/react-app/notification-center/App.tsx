import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Notification {
  id: string;
  type: 'mention' | 'assignment' | 'due' | 'comment' | 'moved';
  title: string;
  message: string;
  cardName?: string;
  boardName?: string;
  date: string;
  read: boolean;
}

const App: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'mention',
          title: 'Bob Smith mentioned you',
          message: 'Can you review this when you get a chance?',
          cardName: 'Fix authentication bug',
          boardName: 'Engineering',
          date: '2024-02-12T10:30:00Z',
          read: false,
        },
        {
          id: '2',
          type: 'assignment',
          title: 'You were assigned to a card',
          message: 'Alice Johnson assigned you to "Update API documentation"',
          cardName: 'Update API documentation',
          boardName: 'Engineering',
          date: '2024-02-12T09:15:00Z',
          read: false,
        },
        {
          id: '3',
          type: 'due',
          title: 'Card due soon',
          message: '"Design landing page" is due in 2 days',
          cardName: 'Design landing page',
          boardName: 'Marketing',
          date: '2024-02-12T08:00:00Z',
          read: true,
        },
        {
          id: '4',
          type: 'comment',
          title: 'New comment on your card',
          message: 'Carol White: "I\'ve completed the design mockups"',
          cardName: 'Design landing page',
          boardName: 'Marketing',
          date: '2024-02-11T16:45:00Z',
          read: true,
        },
        {
          id: '5',
          type: 'moved',
          title: 'Card moved to Done',
          message: 'Your card was moved to Done by David Brown',
          cardName: 'Write blog post',
          boardName: 'Marketing',
          date: '2024-02-11T14:20:00Z',
          read: true,
        },
      ];
      setNotifications(mockNotifications);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load notifications:', error);
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      mention: '💬',
      assignment: '📌',
      due: '⏰',
      comment: '💭',
      moved: '🔄',
    };
    return icons[type as keyof typeof icons] || '🔔';
  };

  const getTypeColor = (type: string) => {
    const colors = {
      mention: '#f2d600',
      assignment: '#4a9eff',
      due: '#eb5a46',
      comment: '#61bd4f',
      moved: '#c377e0',
    };
    return colors[type as keyof typeof colors] || '#888';
  };

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : notifications.filter(n => !n.read);

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading notifications...
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ color: '#fff' }}>
          Notifications {unreadCount > 0 && (
            <span style={{
              background: '#eb5a46',
              color: '#fff',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '14px',
              marginLeft: '8px',
            }}>
              {unreadCount}
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              padding: '8px 16px',
              background: '#4a9eff',
              border: 'none',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Mark all as read
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
        {(['all', 'unread'] as const).map(f => (
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
            {f} {f === 'unread' && `(${unreadCount})`}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: '800px' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{
            background: '#2a2a2a',
            padding: '40px',
            borderRadius: '8px',
            textAlign: 'center',
            color: '#888',
            border: '1px solid #333',
          }}>
            No {filter === 'unread' ? 'unread ' : ''}notifications
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              onClick={() => !notification.read && markAsRead(notification.id)}
              style={{
                background: notification.read ? '#2a2a2a' : '#2a3a4a',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                border: `1px solid ${notification.read ? '#333' : getTypeColor(notification.type)}`,
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ fontSize: '24px', flexShrink: 0 }}>
                  {getTypeIcon(notification.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ color: '#fff', fontSize: '15px', fontWeight: '600' }}>
                      {notification.title}
                    </div>
                    {!notification.read && (
                      <div
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#4a9eff',
                          flexShrink: 0,
                          marginTop: '4px',
                        }}
                      />
                    )}
                  </div>
                  <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px' }}>
                    {notification.message}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {notification.cardName && (
                      <div style={{ color: '#888', fontSize: '12px' }}>
                        {notification.cardName} · {notification.boardName}
                      </div>
                    )}
                    <div style={{ color: '#888', fontSize: '12px' }}>
                      {getRelativeTime(notification.date)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
