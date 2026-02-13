import React, { useState, useEffect } from 'react';

export default function BoardTable({ boardId }: { boardId: string }) {
  const [cards, setCards] = useState<any[]>([]);
  const [lists, setLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const [filterList, setFilterList] = useState('all');

  useEffect(() => {
    loadData();
  }, [boardId]);

  async function loadData() {
    if (!window.mcp) return;
    setLoading(true);
    try {
      const [cardsData, listsData] = await Promise.all([
        window.mcp.callTool('trello_get_board_cards', { board_id: boardId }),
        window.mcp.callTool('trello_get_board_lists', { board_id: boardId }),
      ]);
      setCards(cardsData.cards || []);
      setLists(listsData.lists || []);
    } finally {
      setLoading(false);
    }
  }

  const filteredCards = filterList === 'all' ? cards : cards.filter(c => c.idList === filterList);
  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'due') return (a.due || '').localeCompare(b.due || '');
    return 0;
  });

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-4 flex gap-4">
        <select value={filterList} onChange={(e) => setFilterList(e.target.value)} className="px-3 py-2 border rounded">
          <option value="all">All Lists</option>
          {lists.map(list => <option key={list.id} value={list.id}>{list.name}</option>)}
        </select>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border rounded">
          <option value="name">Sort by Name</option>
          <option value="due">Sort by Due Date</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Card</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">List</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Labels</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Members</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedCards.map(card => (
              <tr key={card.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{card.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{lists.find(l => l.id === card.idList)?.name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {card.labels?.map((l: any) => (
                      <span key={l.id} className="w-8 h-3 rounded" style={{ backgroundColor: l.color }} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm">{card.due ? new Date(card.due).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4 text-sm">{card.idMembers?.length || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
