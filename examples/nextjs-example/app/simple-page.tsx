'use client';

import React from 'react';

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Content Harvester - Simple Test</h1>
      <p>This is a test page to verify Next.js is working.</p>
      
      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h2 className="text-lg font-semibold mb-2">Next Steps:</h2>
        <ul className="space-y-1">
          <li>✅ Next.js app loads</li>
          <li>🔄 Test basic ContentHarvester import</li>
          <li>🔄 Test Firebase integration</li>
        </ul>
      </div>
    </div>
  );
}