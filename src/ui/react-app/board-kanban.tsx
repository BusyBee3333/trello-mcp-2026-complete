import React, { useState, useEffect } from 'react';

export default function BoardKanban({ boardId }: { boardId: string }) {
  const [board, setBoard] = useState<any>(null);
  const [lists, setLists] = useState<any[]>([]);
  const [cards, setCards] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState<any>(null);

  useEffect(() => {
    loadBoard();
  }, [boardId]);

  async function loadBoard() {
    if (!window.mcp) return;
    setLoading(true);
    try {
      const boardData = await window.mcp.callTool('trello_get_board', { board_id: boardId });
      setBoard(boardData);
      
      const listsData = await window.mcp.callTool('trello_get_board_lists', { board_id: boardId, filter: 'open' });
      setLists(listsData.lists || []);
      
      const cardsData: Record<string, any[]> = {};
      for (const list of listsData.lists || []) {
        const listCards = await window.mcp.callTool('trello_list_cards', { list_id: list.id });
        cardsData[list.id] = listCards.cards || [];
      }
      setCards(cardsData);
    } catch (error) {
      console.error('Failed to load board:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCardDrop(listId: string) {
    if (!draggedCard || !window.mcp) return;
    
    try {
      await window.mcp.callTool('trello_move_card', {
        card_id: draggedCard.id,
        list_id: listId,
      });
      await loadBoard();
    } catch (error) {
      console.error('Failed to move card:', error);
    }
    setDraggedCard(null);
  }

  async function handleCreateCard(listId: string, name: string) {
    if (!name.trim() || !window.mcp) return;
    
    try {
      await window.mcp.callTool('trello_create_card', {
        name,
        list_id: listId,
      });
      await loadBoard();
    } catch (error) {
      console.error('Failed to create card:', error);
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading board...</div>;
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Header */}
      <header className="bg-black bg-opacity-20 backdrop-blur-sm p-4">
        <h1 className="text-2xl font-bold text-white">{board?.name}</h1>
        {board?.desc && <p className="text-white text-opacity-80 text-sm mt-1">{board.desc}</p>}
      </header>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-4">
        <div className="flex gap-4 h-full">
          {lists.map(list => (
            <div
              key={list.id}
              className="flex-shrink-0 w-80 bg-gray-100 rounded-lg p-3 flex flex-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleCardDrop(list.id)}
            >
              {/* List Header */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{list.name}</h3>
                <span className="text-sm text-gray-500">{(cards[list.id] || []).length}</span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto space-y-2 mb-2">
                {(cards[list.id] || []).map(card => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => setDraggedCard(card)}
                    className="bg-white rounded-lg p-3 shadow hover:shadow-md cursor-move transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900">{card.name}</h4>
                    {card.desc && <p className="text-sm text-gray-600 mt-1 line-clamp-2">{card.desc}</p>}
                    
                    {/* Card Meta */}
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                      {card.due && (
                        <span className={`px-2 py-1 rounded ${
                          new Date(card.due) < new Date() ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {new Date(card.due).toLocaleDateString()}
                        </span>
                      )}
                      {card.badges?.checkItems > 0 && (
                        <span className="flex items-center gap-1">
                          ☑️ {card.badges.checkItemsChecked}/{card.badges.checkItems}
                        </span>
                      )}
                      {card.badges?.attachments > 0 && (
                        <span>📎 {card.badges.attachments}</span>
                      )}
                      {card.badges?.comments > 0 && (
                        <span>💬 {card.badges.comments}</span>
                      )}
                    </div>

                    {/* Labels */}
                    {card.labels && card.labels.length > 0 && (
                      <div className="flex gap-1 mt-2 flex-wrap">
                        {card.labels.map((label: any) => (
                          <span
                            key={label.id}
                            className="h-2 w-12 rounded"
                            style={{ backgroundColor: label.color || '#gray' }}
                            title={label.name}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Card */}
              <AddCardForm onAdd={(name) => handleCreateCard(list.id, name)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddCardForm({ onAdd }: { onAdd: (name: string) => void }) {
  const [isAdding, setIsAdding] = useState(false);
  const [cardName, setCardName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(cardName);
    setCardName('');
    setIsAdding(false);
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-200 rounded transition"
      >
        + Add a card
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        autoFocus
        value={cardName}
        onChange={(e) => setCardName(e.target.value)}
        placeholder="Enter card title..."
        className="w-full px-3 py-2 border rounded resize-none"
        rows={2}
      />
      <div className="flex gap-2">
        <button type="submit" className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
          Add Card
        </button>
        <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
}
