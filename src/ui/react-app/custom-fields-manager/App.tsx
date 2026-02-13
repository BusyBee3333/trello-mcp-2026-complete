import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'checkbox' | 'list';
  options?: string[];
}

interface Card {
  id: string;
  name: string;
  fieldValues: Record<string, any>;
}

const App: React.FC = () => {
  const [fields, setFields] = useState<CustomField[]>([]);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const mockFields: CustomField[] = [
        { id: 'f1', name: 'Priority', type: 'list', options: ['Low', 'Medium', 'High', 'Critical'] },
        { id: 'f2', name: 'Story Points', type: 'number' },
        { id: 'f3', name: 'Sprint', type: 'text' },
        { id: 'f4', name: 'QA Approved', type: 'checkbox' },
        { id: 'f5', name: 'Target Date', type: 'date' },
      ];

      const mockCards: Card[] = [
        {
          id: 'c1',
          name: 'Implement user authentication',
          fieldValues: { f1: 'High', f2: 8, f3: 'Sprint 12', f4: false, f5: '2024-02-28' },
        },
        {
          id: 'c2',
          name: 'Update API documentation',
          fieldValues: { f1: 'Medium', f2: 3, f3: 'Sprint 12', f4: true, f5: '2024-02-25' },
        },
        {
          id: 'c3',
          name: 'Fix login bug',
          fieldValues: { f1: 'Critical', f2: 5, f3: 'Sprint 11', f4: false, f5: '2024-02-20' },
        },
      ];

      setFields(mockFields);
      setCards(mockCards);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load data:', error);
      setLoading(false);
    }
  };

  const updateFieldValue = (cardId: string, fieldId: string, value: any) => {
    setCards(prev => prev.map(card =>
      card.id === cardId
        ? { ...card, fieldValues: { ...card.fieldValues, [fieldId]: value } }
        : card
    ));
  };

  const renderFieldInput = (card: Card, field: CustomField) => {
    const value = card.fieldValues[field.id];

    const commonStyle = {
      padding: '8px',
      background: '#333',
      border: '1px solid #444',
      borderRadius: '4px',
      color: '#fff',
      fontSize: '14px',
      width: '100%',
    };

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => updateFieldValue(card.id, field.id, e.target.value)}
            style={commonStyle}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => updateFieldValue(card.id, field.id, Number(e.target.value))}
            style={commonStyle}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => updateFieldValue(card.id, field.id, e.target.value)}
            style={commonStyle}
          />
        );
      case 'checkbox':
        return (
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => updateFieldValue(card.id, field.id, e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
        );
      case 'list':
        return (
          <select
            value={value || ''}
            onChange={(e) => updateFieldValue(card.id, field.id, e.target.value)}
            style={commonStyle}
          >
            <option value="">Select...</option>
            {field.options?.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading custom fields...
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
      <h1 style={{ color: '#fff', marginBottom: '20px' }}>Custom Fields Manager</h1>

      {/* Fields Legend */}
      <div style={{
        background: '#2a2a2a',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '24px',
        border: '1px solid #333',
      }}>
        <h2 style={{ color: '#fff', fontSize: '16px', marginBottom: '12px' }}>Board Custom Fields</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {fields.map(field => (
            <div key={field.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: '#4a9eff',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                textTransform: 'uppercase',
              }}>
                {field.type}
              </span>
              <span style={{ color: '#ccc', fontSize: '14px' }}>{field.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Cards Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          background: '#2a2a2a',
          borderRadius: '8px',
        }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #444' }}>
              <th style={{
                padding: '16px',
                textAlign: 'left',
                color: '#fff',
                fontSize: '14px',
                fontWeight: '600',
                minWidth: '200px',
              }}>
                Card
              </th>
              {fields.map(field => (
                <th
                  key={field.id}
                  style={{
                    padding: '16px',
                    textAlign: 'left',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    minWidth: '150px',
                  }}
                >
                  {field.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cards.map(card => (
              <tr key={card.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '16px', color: '#fff', fontSize: '14px' }}>
                  {card.name}
                </td>
                {fields.map(field => (
                  <td key={field.id} style={{ padding: '16px' }}>
                    {renderFieldInput(card, field)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
