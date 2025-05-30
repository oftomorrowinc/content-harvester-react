'use client';

import React from 'react';

// Simple test component without Firebase imports
export default function FirestoreOnlyPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Firestore Only Test</h1>
      <p>Testing Next.js without Firebase Storage imports.</p>
      
      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h2 className="text-lg font-semibold mb-2">Status:</h2>
        <p>✅ Next.js loads successfully</p>
        <p>🔄 Testing without Firebase Storage...</p>
      </div>
    </div>
  );
}