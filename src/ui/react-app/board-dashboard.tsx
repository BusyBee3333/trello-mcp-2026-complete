import React, { useState, useEffect } from 'react';

export default function BoardDashboard({ boardId }: { boardId: string }) {
  const [board, setBoard] = useState<any>(null);
  const [lists, setLists] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [labels, setLabels] = useState<any[]>([]);
  const [actions, setActions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [boardId]);

  async function loadDashboard() {
    if (!window.mcp) return;
    setLoading(true);
    try {
      const [boardData, listsData, cardsData, membersData, labelsData, actionsData] = await Promise.all([
        window.mcp.callTool('trello_get_board', { board_id: boardId }),
        window.mcp.callTool('trello_get_board_lists', { board_id: boardId, filter: 'open' }),
        window.mcp.callTool('trello_get_board_cards', { board_id: boardId }),
        window.mcp.callTool('trello_get_board_members', { board_id: boardId }),
        window.mcp.callTool('trello_get_board_labels', { board_id: boardId }),
        window.mcp.callTool('trello_list_actions', { board_id: boardId, limit: 20 }),
      ]);

      setBoard(boardData);
      setLists(listsData.lists || []);
      setCards(cardsData.cards || []);
      setMembers(membersData.members || []);
      setLabels(labelsData.labels || []);
      setActions(actionsData.actions || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  const cardsByList = lists.map(list => ({
    list,
    cards: cards.filter(c => c.idList === list.id),
  }));

  const cardsByMember = members.map(member => ({
    member,
    cards: cards.filter(c => c.idMembers.includes(member.id)),
  }));

  const cardsByLabel = labels.map(label => ({
    label,
    cards: cards.filter(c => c.idLabels.includes(label.id)),
  }));

  const dueSoon = cards.filter(c => c.due && new Date(c.due) > new Date() && new Date(c.due) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const overdue = cards.filter(c => c.due && new Date(c.due) < new Date() && !c.dueComplete);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{board?.name}</h1>
        {board?.desc && <p className="text-gray-600 mt-2">{board.desc}</p>}
      </header>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <MetricCard title="Total Cards" value={cards.length} icon="📝" />
        <MetricCard title="Lists" value={lists.length} icon="📋" />
        <MetricCard title="Members" value={members.length} icon="👥" />
        <MetricCard title="Overdue" value={overdue.length} icon="⚠️" color="red" />
      </div>

      {/* Cards by List */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Cards per List</h2>
        <div className="space-y-3">
          {cardsByList.map(({ list, cards }) => (
            <div key={list.id} className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{list.name}</span>
                  <span className="text-sm text-gray-500">{cards.length} cards</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(cards.length / Math.max(...cardsByList.map(c => c.cards.length))) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Member Activity */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Member Workload</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cardsByMember.map(({ member, cards }) => (
            <div key={member.id} className="border rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                {member.avatarUrl && <img src={member.avatarUrl} alt={member.fullName} className="w-10 h-10 rounded-full" />}
                <div>
                  <div className="font-medium">{member.fullName}</div>
                  <div className="text-sm text-gray-500">@{member.username}</div>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{cards.length}</div>
              <div className="text-sm text-gray-500">assigned cards</div>
            </div>
          ))}
        </div>
      </section>

      {/* Label Usage */}
      <section className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Label Usage</h2>
        <div className="flex flex-wrap gap-3">
          {cardsByLabel.map(({ label, cards }) => (
            <div
              key={label.id}
              className="px-4 py-2 rounded-lg text-white font-medium"
              style={{ backgroundColor: label.color || '#gray' }}
            >
              {label.name || 'Unlabeled'} ({cards.length})
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {actions.slice(0, 10).map(action => (
            <div key={action.id} className="flex items-start gap-3 border-b pb-3">
              <div className="text-2xl">{getActionIcon(action.type)}</div>
              <div className="flex-1">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">{action.memberCreator?.fullName}</span>{' '}
                  {getActionText(action)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {new Date(action.date).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({ title, value, icon, color = 'blue' }: any) {
  const colors = {
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    green: 'bg-green-500',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-3xl font-bold mt-1">{value}</div>
        </div>
        <div className={`text-4xl ${colors[color as keyof typeof colors] || colors.blue} bg-opacity-10 w-16 h-16 rounded-full flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function getActionIcon(type: string): string {
  const icons: Record<string, string> = {
    createCard: '➕',
    updateCard: '✏️',
    commentCard: '💬',
    addMemberToCard: '👤',
    addAttachmentToCard: '📎',
    deleteCard: '🗑️',
    moveCardToBoard: '↗️',
    moveCardFromBoard: '↙️',
  };
  return icons[type] || '📌';
}

function getActionText(action: any): string {
  const { type, data } = action;
  switch (type) {
    case 'createCard':
      return `created card "${data.card?.name}"`;
    case 'updateCard':
      return `updated card "${data.card?.name}"`;
    case 'commentCard':
      return `commented on "${data.card?.name}"`;
    case 'addMemberToCard':
      return `added a member to "${data.card?.name}"`;
    case 'addAttachmentToCard':
      return `added an attachment to "${data.card?.name}"`;
    default:
      return `performed ${type}`;
  }
}
