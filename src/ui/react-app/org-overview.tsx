import React from 'react';

export default function OrgOverview(props: any) {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Organization Overview</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">Organization with boards, members, and settings management</p>
        </div>
      </div>
    </div>
  );
}
