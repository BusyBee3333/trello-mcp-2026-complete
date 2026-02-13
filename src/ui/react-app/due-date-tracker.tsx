import React from 'react';

export default function DueDateTracker(props: any) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Due Date Tracker</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Upcoming and overdue cards sorted by urgency and priority</p>
        </div>
      </div>
    </div>
  );
}
