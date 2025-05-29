'use client';

import React from 'react';
import { ContentHarvester, ContentHarvesterProvider } from '@content-harvester/react';
import { firebaseConfig, useEmulators } from '@/lib/firebase';

export default function HomePage() {
  const handleContentAdded = (count: number) => {
    console.log(`Added ${count} content items`);
  };

  const handleContentDeleted = (id: string) => {
    console.log(`Deleted content item: ${id}`);
  };

  const handleContentUpdated = (id: string) => {
    console.log(`Updated content item: ${id}`);
  };

  return (
    <div className="min-h-screen bg-dark-bg-primary">
      {/* Header */}
      <header className="border-b border-dark-border-primary bg-dark-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-dark-text-primary">
                Content Harvester Demo
              </h1>
              <p className="text-sm text-dark-text-secondary">
                Example Next.js app with Firebase emulators
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-dark-text-secondary">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {useEmulators ? 'Local Emulators' : 'Production Firebase'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Instructions */}
          <div className="bg-dark-bg-secondary border border-dark-border-primary rounded-lg p-6">
            <h2 className="text-lg font-medium text-dark-text-primary mb-3">
              Getting Started
            </h2>
            <div className="space-y-2 text-dark-text-secondary">
              <p>• <strong>Paste URLs:</strong> Use the input field above to add URLs (they must start with http:// or https://)</p>
              <p>• <strong>Upload Files:</strong> Drag and drop files onto the drop zone or use the file picker</p>
              <p>• <strong>Manage Content:</strong> Toggle anonymization, delete items, or process all pending content</p>
              <p>• <strong>Firebase Emulators:</strong> This demo uses local Firebase emulators - no real data is stored</p>
            </div>
          </div>

          {/* Content Harvester */}
          <ContentHarvesterProvider
            firebaseConfig={firebaseConfig}
            useEmulators={useEmulators}
            config={{
              collection: 'demo-content',
              storagePath: 'demo-uploads',
              fileConfig: {
                allowedExtensions: ['.pdf', '.jpg', '.jpeg', '.png', '.gif', '.txt', '.md'],
                blockedExtensions: ['.exe', '.zip'],
                maxFileSize: 10 * 1024 * 1024, // 10MB
              },
              urlConfig: {
                allowedProtocols: ['http:', 'https:'],
                maxUrlLength: 2048,
              },
            }}
          >
            <ContentHarvester
              onContentAdded={handleContentAdded}
              onContentDeleted={handleContentDeleted}
              onContentUpdated={handleContentUpdated}
              showUrlInput={true}
              showFileUpload={true}
              showProcessAll={true}
              maxHeight="500px"
              header={
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-dark-text-primary mb-2">
                    Content Collection
                  </h2>
                  <p className="text-dark-text-secondary">
                    Add URLs and files to see the Content Harvester in action
                  </p>
                </div>
              }
            />
          </ContentHarvesterProvider>

          {/* Technical Details */}
          <div className="bg-dark-bg-secondary border border-dark-border-primary rounded-lg p-6">
            <h2 className="text-lg font-medium text-dark-text-primary mb-3">
              Technical Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="font-medium text-dark-text-primary mb-2">Firebase Configuration</h3>
                <ul className="space-y-1 text-dark-text-secondary">
                  <li>• Firestore: localhost:8080</li>
                  <li>• Storage: localhost:9199</li>
                  <li>• Collection: demo-content</li>
                  <li>• Storage Path: demo-uploads</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-dark-text-primary mb-2">File Restrictions</h3>
                <ul className="space-y-1 text-dark-text-secondary">
                  <li>• Max Size: 10MB</li>
                  <li>• Allowed: PDF, Images, Text</li>
                  <li>• Blocked: Executables, Archives</li>
                  <li>• URL Length: Max 2048 chars</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-border-primary bg-dark-bg-secondary mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-dark-text-secondary">
            <p>
              Built with{' '}
              <a href="https://nextjs.org" className="text-dark-accent-primary hover:text-dark-accent-hover">
                Next.js
              </a>
              {' '}and{' '}
              <a href="https://firebase.google.com" className="text-dark-accent-primary hover:text-dark-accent-hover">
                Firebase
              </a>
            </p>
            <p className="mt-2 text-sm">
              Start the Firebase emulators with <code className="bg-dark-bg-tertiary px-2 py-1 rounded">npm run emulators</code>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}