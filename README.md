# Content Harvester React

A modern React TypeScript component library for collecting and managing content from URLs and files. Built as an npm package for seamless integration into Next.js and React applications with Firebase backend support.

## Project Overview

This is a complete rewrite of the original Node.js Content Harvester application, transformed into a reusable React TypeScript component library. The package provides a dark-themed, table-based interface where users can:

- **Paste URLs** - Extract and validate HTTP/HTTPS URLs from pasted text
- **Drag & Drop Files** - Upload files with type validation and visual feedback  
- **Manage Content** - Track processing status, toggle anonymization, delete items
- **Firebase Integration** - Store metadata in Firestore, files in Firebase Storage

## Key Features

### 🎨 **Modern UI/UX**
- Dark theme built with Tailwind CSS
- Responsive table-based interface
- Drag & drop with visual feedback
- Toast notifications for user feedback
- Optimized for both desktop and mobile

### 🔥 **Firebase Integration**
- Firestore for content metadata storage
- Firebase Storage for file uploads
- Emulator support for local development
- Real-time status updates

### 📦 **Developer Experience**
- TypeScript for full type safety
- Jest + React Testing Library for comprehensive testing
- ESLint + Prettier for code quality
- Example Next.js application included

### 🚀 **Production Ready**
- NPM package for easy installation
- Tree-shakeable exports
- Optimized bundle size
- Comprehensive documentation

## Technical Architecture

### Package Structure
```
content-harvester-react/
├── src/
│   ├── components/          # React components
│   │   ├── ContentTable/    # Main table component
│   │   ├── DropZone/        # File drop zone
│   │   ├── ToastProvider/   # Notification system
│   │   └── index.ts         # Component exports
│   ├── hooks/               # Custom React hooks
│   │   ├── useContentManager.ts  # Content CRUD operations
│   │   ├── useFirebase.ts        # Firebase operations
│   │   └── useDragDrop.ts        # Drag & drop logic
│   ├── types/               # TypeScript type definitions
│   │   ├── content.ts       # Content model types
│   │   └── firebase.ts      # Firebase configuration types
│   ├── utils/               # Utility functions
│   │   ├── urlExtractor.ts  # URL validation & extraction
│   │   ├── fileValidator.ts # File type validation
│   │   └── formatters.ts    # Display formatters
│   ├── styles/              # Tailwind CSS styles
│   └── index.ts             # Main package export
├── examples/
│   └── nextjs-example/      # Complete Next.js example app
├── tests/                   # Test files
│   ├── components/          # Component tests
│   ├── hooks/               # Hook tests
│   └── utils/               # Utility tests
└── docs/                    # Documentation
```

### Core Technologies

- **React 18+** - Modern React with hooks and concurrent features
- **TypeScript 5+** - Full type safety and developer experience
- **Tailwind CSS** - Utility-first dark theme styling
- **Firebase v9+** - Modular SDK for Firestore and Storage
- **Jest + React Testing Library** - Comprehensive testing framework

## Quick Start

### Installation

```bash
npm install @content-harvester/react firebase
```

### Basic Usage

```tsx
import { ContentHarvester, ContentHarvesterProvider } from '@content-harvester/react';
import '@content-harvester/react/styles';

const firebaseConfig = {
  // Your Firebase configuration
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

function App() {
  return (
    <ContentHarvesterProvider
      firebaseConfig={firebaseConfig}
      useEmulators={process.env.NODE_ENV === 'development'}
      config={{
        collection: 'my-content',
        fileConfig: {
          maxFileSize: 10 * 1024 * 1024, // 10MB
          allowedExtensions: ['.pdf', '.jpg', '.png', '.txt'],
        },
        urlConfig: {
          allowedProtocols: ['http:', 'https:'],
          maxUrlLength: 2048,
        },
      }}
    >
      <ContentHarvester 
        onContentAdded={(count) => console.log(`Added ${count} items`)}
        showUrlInput={true}
        showFileUpload={true}
        maxHeight="500px"
      />
    </ContentHarvesterProvider>
  );
}
```

### Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/content-harvester/react.git
   cd content-harvester-react
   npm install
   ```

2. **Start Firebase Emulators**
   ```bash
   npm run emulators
   ```

3. **Run Example App**
   ```bash
   npm run example:dev
   ```

4. **Run Tests**
   ```bash
   npm test
   ```

## Key Design Decisions

### 1. **Component Library Approach**
- Exports individual components for maximum flexibility
- Provides a pre-configured `ContentHarvester` component for quick setup
- Allows custom theming and styling overrides

### 2. **Firebase Client SDK**
- Uses Firebase v9 modular SDK for smaller bundle size
- Supports both production Firebase and local emulators
- Requires user to provide their own Firebase configuration

### 3. **State Management**
- Uses React Context for component-level state
- Custom hooks encapsulate complex logic
- No external state management library required

### 4. **TypeScript-First**
- Strict TypeScript configuration
- Comprehensive type definitions for all APIs
- Generated type declarations for npm package

### 5. **Testing Strategy**
- Unit tests for all utilities and hooks
- Integration tests for components
- Mock Firebase services for testing
- 90%+ code coverage target

## Usage Preview

```tsx
import { ContentHarvester, ContentProvider } from '@your-org/content-harvester-react';
import { firebaseConfig } from './firebase-config';

function App() {
  return (
    <ContentProvider firebaseConfig={firebaseConfig}>
      <ContentHarvester 
        collection="my-content"
        allowedFileTypes={['.pdf', '.docx', '.jpg', '.png']}
        maxFileSize={10 * 1024 * 1024} // 10MB
        onContentAdded={(content) => console.log('Added:', content)}
      />
    </ContentProvider>
  );
}
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development with Firebase emulators
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build the package
npm run build

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Run example Next.js app
npm run example:dev
```

## Firebase Setup

### Local Development
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Start emulators
npm run emulators:start

# Export emulator data
npm run emulators:export
```

### Production Configuration
```typescript
// firebase-config.ts
export const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## Content Model

```typescript
interface ContentItem {
  id: string;
  type: 'url' | 'file';
  name: string;
  url?: string;
  size?: number;
  mimeType?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  anonymize: boolean;
  storageRef?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Node.js**: 16+ (for SSR/SSG compatibility)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with tests
4. Run the test suite (`npm test`)
5. Commit your changes (`npm run commit`)
6. Push to your branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Roadmap

- **v1.0.0**: Core functionality with Firebase integration
- **v1.1.0**: Advanced file type detection and preview
- **v1.2.0**: Batch operations and selection
- **v1.3.0**: Content search and filtering
- **v2.0.0**: Supabase and other backend adapters