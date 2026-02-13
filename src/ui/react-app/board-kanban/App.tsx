import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Card {
  id: string;
  name: string;
  desc: string;
  idList: string;
  labels: Array<{ id: string; name: string; color: string }>;
  due: string | null;
  idMembers: string[];
}

interface List {
  id: string;
  name: string;
  cards: Card[];
}

interface Board {
  id: string;
  name: string;
  lists: List[];
}

const App: React.FC = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState<{ card: Card; fromListId: string } | null>(null);

  useEffect(() => {
    loadBoard();
  }, []);

  const loadBoard = async () => {
    try {
      // Mock data for demo - replace with actual MCP tool calls
      const mockBoard: Board = {
        id: '1',
        name: 'Sample Board',
        lists: [
          {
            id: 'list1',
            name: 'To Do',
            cards: [
              { id: 'card1', name: 'Task 1', desc: 'Description 1', idList: 'list1', labels: [{ id: 'l1', name: 'Bug', color: 'red' }], due: null, idMembers: [] },
              { id: 'card2', name: 'Task 2', desc: 'Description 2', idList: 'list1', labels: [], due: '2024-03-01', idMembers: [] },
            ],
          },
          {
            id: 'list2',
            name: 'In Progress',
            cards: [
              { id: 'card3', name: 'Task 3', desc: 'Description 3', idList: 'list2', labels: [{ id: 'l2', name: 'Feature', color: 'green' }], due: null, idMembers: [] },
            ],
          },
          {
            id: 'list3',
            name: 'Done',
            cards: [],
          },
        ],
      };
      setBoard(mockBoard);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load board:', error);
      setLoading(false);
    }
  };

  const handleDragStart = (card: Card, listId: string) => {
    setDraggedCard({ card, fromListId: listId });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetListId: string) => {
    if (!draggedCard || !board) return;

    const newBoard = { ...board };
    const fromList = newBoard.lists.find(l => l.id === draggedCard.fromListId);
    const toList = newBoard.lists.find(l => l.id === targetListId);

    if (fromList && toList) {
      const cardIndex = fromList.cards.findIndex(c => c.id === draggedCard.card.id);
      if (cardIndex > -1) {
        const [movedCard] = fromList.cards.splice(cardIndex, 1);
        movedCard.idList = targetListId;
        toList.cards.push(movedCard);
        setBoard(newBoard);
      }
    }

    setDraggedCard(null);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading board...
      </div>
    );
  }

  if (!board) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        No board found
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
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>{board.name}</h1>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
        {board.lists.map(list => (
          <div
            key={list.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(list.id)}
            style={{
              background: '#2a2a2a',
              borderRadius: '8px',
              padding: '12px',
              minWidth: '280px',
              maxWidth: '280px',
            }}
          >
            <h3 style={{ color: '#fff', marginBottom: '12px', fontSize: '14px', fontWeight: '600' }}>
              {list.name} ({list.cards.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {list.cards.map(card => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={() => handleDragStart(card, list.id)}
                  style={{
                    background: '#333',
                    borderRadius: '6px',
                    padding: '12px',
                    cursor: 'grab',
                    border: '1px solid #444',
                  }}
                >
                  <div style={{ color: '#fff', fontSize: '14px', marginBottom: '8px' }}>
                    {card.name}
                  </div>
                  {card.labels.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '8px' }}>
                      {card.labels.map(label => (
                        <span
                          key={label.id}
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
                  {card.due && (
                    <div style={{ color: '#888', fontSize: '12px' }}>
                      Due: {new Date(card.due).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
