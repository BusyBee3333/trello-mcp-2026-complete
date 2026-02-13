import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video' | 'other';
  size: number;
  cardName: string;
  boardName: string;
  uploadedBy: string;
  uploadedAt: string;
}

const App: React.FC = () => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'all' | 'image' | 'document' | 'video' | 'other'>('all');
  const [filterBoard, setFilterBoard] = useState('All');

  useEffect(() => {
    loadAttachments();
  }, []);

  const loadAttachments = async () => {
    try {
      const mockAttachments: Attachment[] = [
        {
          id: '1',
          name: 'design-mockup.png',
          url: '#',
          type: 'image',
          size: 2456789,
          cardName: 'Design landing page',
          boardName: 'Marketing',
          uploadedBy: 'Carol White',
          uploadedAt: '2024-02-12T10:30:00Z',
        },
        {
          id: '2',
          name: 'requirements-doc.pdf',
          url: '#',
          type: 'document',
          size: 1234567,
          cardName: 'User Authentication',
          boardName: 'Engineering',
          uploadedBy: 'Alice Johnson',
          uploadedAt: '2024-02-11T14:20:00Z',
        },
        {
          id: '3',
          name: 'product-demo.mp4',
          url: '#',
          type: 'video',
          size: 15678901,
          cardName: 'Q1 Planning',
          boardName: 'Strategy',
          uploadedBy: 'Bob Smith',
          uploadedAt: '2024-02-10T09:15:00Z',
        },
        {
          id: '4',
          name: 'wireframes.sketch',
          url: '#',
          type: 'other',
          size: 4567890,
          cardName: 'Design landing page',
          boardName: 'Marketing',
          uploadedBy: 'Carol White',
          uploadedAt: '2024-02-09T16:45:00Z',
        },
        {
          id: '5',
          name: 'architecture-diagram.png',
          url: '#',
          type: 'image',
          size: 987654,
          cardName: 'API Documentation',
          boardName: 'Engineering',
          uploadedBy: 'David Brown',
          uploadedAt: '2024-02-08T11:30:00Z',
        },
        {
          id: '6',
          name: 'campaign-brief.docx',
          url: '#',
          type: 'document',
          size: 234567,
          cardName: 'Q1 Marketing Campaign',
          boardName: 'Marketing',
          uploadedBy: 'Emma Davis',
          uploadedAt: '2024-02-07T13:00:00Z',
        },
      ];
      setAttachments(mockAttachments);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load attachments:', error);
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    const icons = {
      image: '🖼️',
      document: '📄',
      video: '🎥',
      other: '📎',
    };
    return icons[type as keyof typeof icons] || '📎';
  };

  const getRelativeTime = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays < 1) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const boards = ['All', ...Array.from(new Set(attachments.map(a => a.boardName)))];

  const filteredAttachments = attachments.filter(attachment => {
    const matchType = filterType === 'all' || attachment.type === filterType;
    const matchBoard = filterBoard === 'All' || attachment.boardName === filterBoard;
    return matchType && matchBoard;
  });

  const totalSize = filteredAttachments.reduce((sum, a) => sum + a.size, 0);

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading attachments...
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
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>Attachment Gallery</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'image', 'document', 'video', 'other'] as const).map(type => (
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
              {type}
            </button>
          ))}
        </div>
        <select
          value={filterBoard}
          onChange={(e) => setFilterBoard(e.target.value)}
          style={{
            padding: '8px 12px',
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
      </div>

      {/* Stats */}
      <div style={{
        background: '#2a2a2a',
        padding: '16px',
        borderRadius: '8px',
        marginBottom: '24px',
        border: '1px solid #333',
        display: 'flex',
        gap: '24px',
      }}>
        <div>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>TOTAL ATTACHMENTS</div>
          <div style={{ color: '#fff', fontSize: '20px', fontWeight: '600' }}>{filteredAttachments.length}</div>
        </div>
        <div>
          <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>TOTAL SIZE</div>
          <div style={{ color: '#fff', fontSize: '20px', fontWeight: '600' }}>{formatFileSize(totalSize)}</div>
        </div>
      </div>

      {/* Attachments Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {filteredAttachments.map(attachment => (
          <div
            key={attachment.id}
            style={{
              background: '#2a2a2a',
              borderRadius: '8px',
              padding: '16px',
              border: '1px solid #333',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              background: '#333',
              borderRadius: '6px',
              height: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              fontSize: '48px',
            }}>
              {getFileIcon(attachment.type)}
            </div>
            <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginBottom: '8px', wordBreak: 'break-word' }}>
              {attachment.name}
            </div>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '4px' }}>
              {attachment.cardName}
            </div>
            <div style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>
              {attachment.boardName}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#888', fontSize: '11px' }}>
                {formatFileSize(attachment.size)}
              </div>
              <div style={{ color: '#888', fontSize: '11px' }}>
                {getRelativeTime(attachment.uploadedAt)}
              </div>
            </div>
            <div style={{ color: '#888', fontSize: '11px', marginTop: '4px' }}>
              by {attachment.uploadedBy}
            </div>
          </div>
        ))}
      </div>

      {filteredAttachments.length === 0 && (
        <div style={{
          background: '#2a2a2a',
          padding: '40px',
          borderRadius: '8px',
          textAlign: 'center',
          color: '#888',
          border: '1px solid #333',
        }}>
          No attachments found
        </div>
      )}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
