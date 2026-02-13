import React, { useState, useEffect } from 'react';

export default function CardDetail({ cardId }: { cardId: string }) {
  const [card, setCard] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [checklists, setChecklists] = useState<any[]>([]);
  const [attachments, setAttachments] = useState<any[]>([]);
  const [customFields, setCustomFields] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadCard();
  }, [cardId]);

  async function loadCard() {
    if (!window.mcp) return;
    setLoading(true);
    try {
      const [cardData, commentsData, checklistsData, attachmentsData, customFieldsData] = await Promise.all([
        window.mcp.callTool('trello_get_card', { card_id: cardId }),
        window.mcp.callTool('trello_get_card_comments', { card_id: cardId }),
        window.mcp.callTool('trello_get_card_checklists', { card_id: cardId }),
        window.mcp.callTool('trello_get_card_attachments', { card_id: cardId }),
        window.mcp.callTool('trello_get_custom_field_values', { card_id: cardId }),
      ]);

      setCard(cardData);
      setComments(commentsData.comments || []);
      setChecklists(checklistsData.checklists || []);
      setAttachments(attachmentsData.attachments || []);
      setCustomFields(customFieldsData.customFieldItems || []);
    } catch (error) {
      console.error('Failed to load card:', error);
    } finally {
      setLoading(false);
    }
  }

  async function addComment() {
    if (!newComment.trim() || !window.mcp) return;
    
    try {
      await window.mcp.callTool('trello_add_card_comment', {
        card_id: cardId,
        text: newComment,
      });
      setNewComment('');
      await loadCard();
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  }

  async function toggleCheckItem(checklistId: string, itemId: string, currentState: string) {
    if (!window.mcp) return;
    try {
      await window.mcp.callTool('trello_update_check_item', {
        card_id: cardId,
        check_item_id: itemId,
        state: currentState === 'complete' ? 'incomplete' : 'complete',
      });
      await loadCard();
    } catch (error) {
      console.error('Failed to update check item:', error);
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Loading card...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="text-3xl">📝</div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{card.name}</h1>
              <div className="flex gap-2 text-sm text-gray-500">
                <span>in list</span>
                <span className="font-medium">{card.list?.name || 'Unknown'}</span>
              </div>
            </div>
          </div>

          {/* Labels */}
          {card.labels && card.labels.length > 0 && (
            <div className="flex gap-2 mb-4">
              {card.labels.map((label: any) => (
                <span
                  key={label.id}
                  className="px-3 py-1 rounded-full text-white text-sm font-medium"
                  style={{ backgroundColor: label.color || '#gray' }}
                >
                  {label.name || 'Label'}
                </span>
              ))}
            </div>
          )}

          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {card.due && (
              <div>
                <div className="text-gray-500">Due Date</div>
                <div className={`font-medium ${
                  new Date(card.due) < new Date() && !card.dueComplete ? 'text-red-600' : 'text-gray-900'
                }`}>
                  {new Date(card.due).toLocaleDateString()}
                  {card.dueComplete && <span className="ml-2 text-green-600">✓</span>}
                </div>
              </div>
            )}
            {card.idMembers && card.idMembers.length > 0 && (
              <div>
                <div className="text-gray-500">Members</div>
                <div className="font-medium">{card.idMembers.length} assigned</div>
              </div>
            )}
            <div>
              <div className="text-gray-500">Created</div>
              <div className="font-medium">{new Date(parseInt(card.id.substring(0, 8), 16) * 1000).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-gray-500">Last Activity</div>
              <div className="font-medium">{new Date(card.dateLastActivity).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>📄</span> Description
              </h2>
              {card.desc ? (
                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap">{card.desc}</div>
              ) : (
                <div className="text-gray-400 italic">No description</div>
              )}
            </section>

            {/* Checklists */}
            {checklists.length > 0 && (
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <span>☑️</span> Checklists
                </h2>
                <div className="space-y-4">
                  {checklists.map(checklist => {
                    const completed = checklist.checkItems.filter((i: any) => i.state === 'complete').length;
                    const total = checklist.checkItems.length;
                    const progress = total > 0 ? (completed / total) * 100 : 0;

                    return (
                      <div key={checklist.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium">{checklist.name}</h3>
                          <span className="text-sm text-gray-500">{completed}/{total}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
                        </div>
                        <div className="space-y-2">
                          {checklist.checkItems.map((item: any) => (
                            <label key={item.id} className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                              <input
                                type="checkbox"
                                checked={item.state === 'complete'}
                                onChange={() => toggleCheckItem(checklist.id, item.id, item.state)}
                                className="w-5 h-5 rounded"
                              />
                              <span className={item.state === 'complete' ? 'line-through text-gray-500' : ''}>
                                {item.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Comments */}
            <section className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <span>💬</span> Comments
              </h2>
              
              {/* Add Comment */}
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Write a comment..."
                  className="w-full px-3 py-2 border rounded-lg resize-none"
                  rows={3}
                />
                <button
                  onClick={addComment}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Add Comment
                </button>
              </div>

              {/* Comment List */}
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-medium">{comment.memberCreator?.fullName}</span>
                        <span className="text-xs text-gray-500">{new Date(comment.date).toLocaleString()}</span>
                      </div>
                      <div className="text-gray-700">{comment.data?.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Attachments */}
            {attachments.length > 0 && (
              <section className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span>📎</span> Attachments
                </h3>
                <div className="space-y-2">
                  {attachments.map(att => (
                    <a
                      key={att.id}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 border rounded hover:bg-gray-50"
                    >
                      <div className="font-medium text-sm text-blue-600 truncate">{att.name}</div>
                      <div className="text-xs text-gray-500">{new Date(att.date).toLocaleDateString()}</div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Custom Fields */}
            {customFields.length > 0 && (
              <section className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-3">Custom Fields</h3>
                <div className="space-y-2 text-sm">
                  {customFields.map(field => (
                    <div key={field.id}>
                      <div className="text-gray-500">{field.name}</div>
                      <div className="font-medium">{JSON.stringify(field.value)}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
