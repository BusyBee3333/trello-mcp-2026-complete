import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

interface Card {
  id: string;
  name: string;
  boardName: string;
  due: string;
  labels: { name: string; color: string }[];
}

const App: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      const mockCards: Card[] = [
        { id: '1', name: 'Review PR', boardName: 'Engineering', due: '2024-02-15', labels: [{ name: 'Code', color: '#61bd4f' }] },
        { id: '2', name: 'Client meeting', boardName: 'Sales', due: '2024-02-20', labels: [{ name: 'Meeting', color: '#f2d600' }] },
        { id: '3', name: 'Launch campaign', boardName: 'Marketing', due: '2024-02-25', labels: [{ name: 'Campaign', color: '#eb5a46' }] },
        { id: '4', name: 'Write documentation', boardName: 'Engineering', due: '2024-02-28', labels: [{ name: 'Docs', color: '#00c2e0' }] },
        { id: '5', name: 'Team retrospective', boardName: 'Management', due: '2024-02-29', labels: [{ name: 'Meeting', color: '#f2d600' }] },
      ];
      setCards(mockCards);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load cards:', error);
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    return { daysInMonth, startDayOfWeek, year, month };
  };

  const getCardsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return cards.filter(card => card.due.startsWith(dateStr));
  };

  const { daysInMonth, startDayOfWeek, year, month } = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#fff', background: '#1a1a1a', minHeight: '100vh' }}>
        Loading calendar...
      </div>
    );
  }

  const days = [];
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} style={{ minHeight: '100px' }} />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dayCards = getCardsForDate(date);
    days.push(
      <div
        key={day}
        style={{
          background: '#2a2a2a',
          border: '1px solid #333',
          padding: '8px',
          minHeight: '100px',
        }}
      >
        <div style={{ color: '#ccc', fontSize: '14px', marginBottom: '8px' }}>{day}</div>
        {dayCards.map(card => (
          <div
            key={card.id}
            style={{
              background: '#333',
              padding: '6px',
              borderRadius: '4px',
              marginBottom: '4px',
              fontSize: '11px',
            }}
          >
            <div style={{ color: '#fff', marginBottom: '2px' }}>{card.name}</div>
            {card.labels.length > 0 && (
              <div style={{ display: 'flex', gap: '2px' }}>
                {card.labels.map((label, idx) => (
                  <div
                    key={idx}
                    style={{
                      width: '12px',
                      height: '4px',
                      background: label.color,
                      borderRadius: '2px',
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
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
        <h1 style={{ color: '#fff' }}>Calendar View</h1>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={prevMonth}
            style={{
              padding: '8px 16px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            ← Prev
          </button>
          <span style={{ color: '#fff', fontSize: '18px', minWidth: '180px', textAlign: 'center' }}>
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            style={{
              padding: '8px 16px',
              background: '#2a2a2a',
              border: '1px solid #444',
              borderRadius: '6px',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Next →
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', background: '#333' }}>
        {dayNames.map(day => (
          <div
            key={day}
            style={{
              background: '#2a2a2a',
              padding: '12px',
              textAlign: 'center',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
            }}
          >
            {day}
          </div>
        ))}
        {days}
      </div>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
