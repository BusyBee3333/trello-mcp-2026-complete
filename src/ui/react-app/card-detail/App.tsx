import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Checklist {
  id: string;
  name: string;
  items: { id: string; name: string; checked: boolean }[];
}

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
}

interface CardDetail {
  id: string;
  name: string;
  desc: string;
  listName: string;
  labels: { name: string; color: string }[];
  members: string[];
  due: string | null;
  checklists: Checklist[];
  comments: Comment[];
  attachments: Attachment[];
}

const App: React.FC = () => {
  const [card, setCard] = useState<CardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    try {
      const mockCard: CardDetail = {
        id: '1',
        name: 'Implement user authentication',
        desc: 'Add OAuth2 authentication with Google and GitHub providers. Include session management and refresh token handling.',
        listName: 'In Progress',
        labels: [
          { name: 'Feature', color: '#61bd4f' },
          { name: 'High Priority', color: '#eb5a46' },
        ],
        members: ['Alice Johnson', 'Bob Smith'],
        due: '2024-02-28',
        checklists: [
          {
            id: 'cl1',
            name: 'Backend Tasks',
            items: [
              { id: 'i1', name: 'Set up OAuth providers', checked: true },
              { id: 'i2', name: 'Create user model', checked: true },
              { id: 'i3', name: 'Implement token refresh', checked: false },
            ],
          },
          {
            id: 'cl2',
            name: 'Frontend Tasks',
            items: [
              { id: 'i4', name: 'Design login page', checked: true },
              { id: 'i5', name: 'Add OAuth buttons', checked: false },
              { id: 'i6', name: 'Handle auth state', checked: false },
            ],
          },
        ],
        comments: [
          { id: 'c1', author: 'Alice Johnson', text: 'Started working on the OAuth setup', date: '2024-02-12T10:30:00Z' },
          { id: 'c2', author: 'Bob Smith', text: 'I can help with the frontend once backend is ready', date: '2024-02-12T14:15:00Z' },
        ],
        attachments: [
          { id: 'a1', name: 'oauth-flow-diagram.png', url: '#', type: 'image' },
          { id: 'a2', name: 'requirements.pdf', url: '#', type: 'document' },
        ],
      };
      setCard(mockCard);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load card:', error);
      setLoading(false);
    }
  };

  const toggleChecklistItem = (checklistId: string, itemId: string) => {
    if (!card) return;
    const newCard = { ...card };
    const checklist = newCard.checklists.find(cl => cl.id === checklistId);
    if (checklist) {
      const item = checklist.items.find(i => i.id === itemId);
      if (item) {
        item.checked = !item.checked;
        setCard(newCard);
      }
    }
  };

  const addComment = () => {
    if (!card || !newComment.trim()) return;
    const comment: Comment = {
      id: `c${Date.now()}`,
      author: 'Current User',
      text: newComment,
      date: new Date().toISOString(),
    };
    setCard({ ...card, comments: [...card.comments, comment] });
    setNewComment('');
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading card...
      </div>
    );
  }

  if (!card) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Card not found
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
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ color: '#fff', marginBottom: '16px', fontSize: '24px' }}>{card.name}</h1>
        
        <div style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
          in list <span style={{ color: '#ccc' }}>{card.listName}</span>
        </div>

        {/* Labels and Members */}
        <div style={{ display: 'flex', gap: '24px', marginBottom: '24px', flexWrap: 'wrap' }}>
          <div>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>LABELS</div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {card.labels.map((label, idx) => (
                <span
                  key={idx}
                  style={{
                    background: label.color,
                    color: '#fff',
                    padding: '6px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>MEMBERS</div>
            <div style={{ color: '#ccc', fontSize: '14px' }}>{card.members.join(', ')}</div>
          </div>
          {card.due && (
            <div>
              <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>DUE DATE</div>
              <div style={{ color: '#ccc', fontSize: '14px' }}>
                {new Date(card.due).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px' }}>Description</h2>
          <div style={{
            background: '#2a2a2a',
            padding: '16px',
            borderRadius: '8px',
            color: '#ccc',
            fontSize: '14px',
            lineHeight: '1.6',
            border: '1px solid #333',
          }}>
            {card.desc}
          </div>
        </div>

        {/* Checklists */}
        {card.checklists.map((checklist) => {
          const completed = checklist.items.filter(i => i.checked).length;
          const total = checklist.items.length;
          const percentage = Math.round((completed / total) * 100);

          return (
            <div key={checklist.id} style={{ marginBottom: '24px' }}>
              <h2 style={{ color: '#fff', fontSize: '16px', marginBottom: '8px' }}>{checklist.name}</h2>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#888', fontSize: '12px' }}>{percentage}%</span>
                  <span style={{ color: '#888', fontSize: '12px' }}>{completed}/{total}</span>
                </div>
                <div style={{ background: '#2a2a2a', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    background: '#61bd4f',
                    height: '100%',
                    width: `${percentage}%`,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
              </div>
              {checklist.items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: '#2a2a2a',
                    padding: '12px',
                    borderRadius: '6px',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    border: '1px solid #333',
                  }}
                  onClick={() => toggleChecklistItem(checklist.id, item.id)}
                >
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={() => {}}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{
                    color: item.checked ? '#888' : '#ccc',
                    fontSize: '14px',
                    textDecoration: item.checked ? 'line-through' : 'none',
                  }}>
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          );
        })}

        {/* Attachments */}
        {card.attachments.length > 0 && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px' }}>Attachments</h2>
            {card.attachments.map((attachment) => (
              <div
                key={attachment.id}
                style={{
                  background: '#2a2a2a',
                  padding: '12px',
                  borderRadius: '6px',
                  marginBottom: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid #333',
                }}
              >
                <span style={{ fontSize: '20px' }}>📎</span>
                <span style={{ color: '#ccc', fontSize: '14px' }}>{attachment.name}</span>
              </div>
            ))}
          </div>
        )}

        {/* Comments */}
        <div>
          <h2 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px' }}>Comments</h2>
          {card.comments.map((comment) => (
            <div
              key={comment.id}
              style={{
                background: '#2a2a2a',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '12px',
                border: '1px solid #333',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#fff', fontSize: '14px', fontWeight: '600' }}>{comment.author}</span>
                <span style={{ color: '#888', fontSize: '12px' }}>
                  {new Date(comment.date).toLocaleString()}
                </span>
              </div>
              <div style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.5' }}>{comment.text}</div>
            </div>
          ))}
          <div style={{ marginTop: '16px' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={{
                width: '100%',
                minHeight: '80px',
                padding: '12px',
                background: '#2a2a2a',
                border: '1px solid #444',
                borderRadius: '6px',
                color: '#fff',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
            <button
              onClick={addComment}
              style={{
                marginTop: '8px',
                padding: '10px 20px',
                background: '#4a9eff',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              Add Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
