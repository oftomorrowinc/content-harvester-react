# Content Harvester React - Technical Specification

## Overview

Content Harvester React is a modern TypeScript component library that transforms content collection into a seamless React experience. Built as an NPM package, it provides a dark-themed, table-based interface for collecting URLs and files with Firebase backend integration.

## Core Requirements

### 1. **Component Library Architecture**
- NPM package for Next.js and React applications
- Tree-shakeable exports with TypeScript support
- Peer dependencies for React 18+ and Firebase v9+
- Dark theme only with Tailwind CSS integration

### 2. **Content Collection Interface**
- Table-based display with real-time updates
- URL input field with smart extraction from pasted text
- Drag-and-drop file zone with visual feedback
- Toast notifications for user feedback

### 3. **Firebase Integration**
- Firestore for content metadata storage
- Firebase Storage for file uploads
- Emulator support for local development
- Real-time status updates and synchronization

## UI Design & Components

### Component Hierarchy

```
ContentHarvesterProvider
└── ContentHarvester
    ├── Header (URL input + title)
    ├── ContentTable
    │   ├── StatusBadge
    │   ├── TypeBadge
    │   ├── ToggleSwitch (anonymize)
    │   └── Action buttons
    ├── DropZone (when empty)
    │   └── EmptyState
    └── Action buttons (when content exists)
```

### Dark Theme Design System

```css
:root {
  --bg-primary: #0d1117;      /* Main background */
  --bg-secondary: #161b22;     /* Card backgrounds */
  --bg-tertiary: #1c2129;      /* Input backgrounds */
  --border-primary: #30363d;   /* Borders */
  --text-primary: #c9d1d9;     /* Main text */
  --text-secondary: #8b949e;   /* Secondary text */
  --accent-primary: #7e43ff;   /* Primary actions */
  --status-pending: #f0883e;   /* Pending items */
  --status-processing: #58a6ff; /* Processing items */
  --status-completed: #3fb950; /* Completed items */
  --status-error: #f85149;     /* Error items */
}
```

### Responsive Layout

```
Desktop (1200px+)
┌─────────────────────────────────────────────────┐
│ Header: Title + URL Input                       │
├─────────────────────────────────────────────────┤
│ Content Table (scrollable)                      │
│ ┌─────┬─────────────┬──────┬────────┬─────────┐ │
│ │Type │ Name        │ Size │ Status │ Actions │ │
│ ├─────┼─────────────┼──────┼────────┼─────────┤ │
│ │ URL │ example.com │  -   │ Pending│   🗑️   │ │
│ │File │ doc.pdf     │ 2MB  │Complete│   🗑️   │ │
│ └─────┴─────────────┴──────┴────────┴─────────┘ │
├─────────────────────────────────────────────────┤
│ Actions: [Add Files] [Process All]              │
└─────────────────────────────────────────────────┘

Mobile (768px-)
┌─────────────────────┐
│ Header: Title       │
├─────────────────────┤
│ URL Input (full)    │
├─────────────────────┤
│ Simplified Table    │
│ ┌─────────────────┐ │
│ │ Name      Status│ │
│ ├─────────────────┤ │
│ │ example   Pend. │ │
│ │ doc.pdf   Done  │ │
│ └─────────────────┘ │
├─────────────────────┤
│ [Add] [Process All] │
└─────────────────────┘
```

## Technical Implementation

### TypeScript Architecture

```typescript
// Core interfaces
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

interface ContentHarvesterConfig {
  collection: string;
  storagePath?: string;
  fileConfig?: FileTypeConfig;
  urlConfig?: UrlConfig;
  realTimeUpdates?: boolean;
  maxDisplayItems?: number;
}

// Component props with full TypeScript support
interface ContentHarvesterProps {
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  showUrlInput?: boolean;
  showFileUpload?: boolean;
  showProcessAll?: boolean;
  maxHeight?: string;
  onContentAdded?: (count: number) => void;
  onContentDeleted?: (id: string) => void;
  onContentUpdated?: (id: string) => void;
}
```

### Hook-Based Architecture

```typescript
// Firebase integration
const firebase = useFirebase({ config, useEmulators });
const firebaseOps = useFirebaseOperations({ services, collection });

// Content management
const contentManager = useContentManager({ 
  firebaseOps, 
  fileConfig, 
  urlConfig 
});

// Drag & drop handling
const { isDragOver, dragHandlers } = useDragDrop({
  onFilesDropped: contentManager.addFiles,
  onUrlsPasted: contentManager.addUrls,
  fileConfig,
});
```

### File Validation System

```typescript
interface FileTypeConfig {
  allowedExtensions: string[];    // ['.pdf', '.jpg', '.png']
  blockedExtensions: string[];    // ['.exe', '.zip']
  maxFileSize: number;           // 10 * 1024 * 1024 (10MB)
  maxTotalSize?: number;         // Optional total limit
}

// Validation pipeline
File → getFileExtension() → validateFile() → processFile() → uploadFile()
```

### URL Processing Pipeline

```typescript
interface UrlConfig {
  allowedProtocols: string[];    // ['http:', 'https:']
  blockedDomains?: string[];     // Optional domain blocklist
  allowedDomains?: string[];     // Optional domain allowlist
  maxUrlLength?: number;         // Optional length limit
}

// Processing pipeline
Text → extractUrls() → validateUrl() → processUrl() → createContent()
```

## Firebase Integration

### Firestore Schema

```javascript
// Collection: configurable (default: 'contents')
{
  id: "uuid-v4",
  type: "url" | "file",
  name: "display-name",
  url: "https://example.com" | "download-url",
  size: 1024, // bytes, optional
  mimeType: "text/plain", // optional
  status: "pending" | "processing" | "completed" | "error",
  anonymize: true | false,
  storageRef: "uploads/uuid-filename", // for files only
  createdAt: Timestamp,
  updatedAt: Timestamp,
  error: "error message", // if status === 'error'
  metadata: {} // optional additional data
}
```

### Firebase Storage Structure

```
bucket/
├── uploads/                    # Default storage path
│   ├── uuid-file1.pdf
│   ├── uuid-file2.jpg
│   └── uuid-file3.txt
└── content-harvester-{userId}/ # User-specific path
    ├── uuid-file1.pdf
    └── uuid-file2.jpg
```

### Security Rules

```javascript
// Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contents/{contentId} {
      allow read, write: if true; // Open for demo
    }
    match /{collection}/{document} {
      allow read, write: if collection.matches('content-harvester-.*');
    }
  }
}

// Storage rules
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /uploads/{allPaths=**} {
      allow read, write: if true; // Open for demo
    }
    match /content-harvester-{userId}/{allPaths=**} {
      allow read, write: if true; // Open for demo
    }
  }
}
```

## Component Specifications

### 1. ContentHarvester (Main Component)

**Purpose**: Primary component that orchestrates the entire content collection experience.

**Features**:
- Automatic Firebase initialization
- Real-time content synchronization
- Responsive layout adaptation
- Error boundary handling

**Usage**:
```tsx
<ContentHarvesterProvider firebaseConfig={config}>
  <ContentHarvester 
    showUrlInput={true}
    showFileUpload={true}
    maxHeight="500px"
    onContentAdded={(count) => console.log(`Added ${count}`)}
  />
</ContentHarvesterProvider>
```

### 2. ContentTable

**Purpose**: Display content items in a sortable, filterable table format.

**Features**:
- Virtual scrolling for performance
- Column sorting and filtering
- Row selection and batch operations
- Responsive column hiding

**Columns**:
- **Name**: Clickable URLs, truncated filenames
- **Type**: Badge with file type icon
- **Size**: Formatted file size
- **Status**: Badge with progress indicator
- **Anonymous**: Toggle switch
- **Actions**: Delete button

### 3. DropZone

**Purpose**: Handle file uploads and URL pasting with visual feedback.

**Features**:
- Drag-and-drop file handling
- Paste event for URL extraction
- File type validation with user feedback
- Visual drag state indicators

**States**:
- **Default**: Empty state with instructions
- **Drag Over**: Highlighted drop zone
- **Processing**: Loading indicator
- **Error**: Toast notification

### 4. StatusBadge

**Purpose**: Visual status indicators with appropriate colors and icons.

**Status Types**:
- **Pending**: Orange with clock icon
- **Processing**: Blue with spinning icon
- **Completed**: Green with checkmark icon
- **Error**: Red with X icon

### 5. TypeBadge

**Purpose**: Display content type with appropriate file type icons.

**Type Detection**:
- **URL**: Link icon
- **Image Files**: Image icon (.jpg, .png, .gif)
- **Document Files**: Document icon (.pdf, .doc, .txt)
- **Video Files**: Video icon (.mp4, .mov)
- **Audio Files**: Audio icon (.mp3, .wav)
- **Archive Files**: Archive icon (.zip, .rar)

## Development Workflow

### Local Development Setup

```bash
# 1. Start Firebase emulators
npm run emulators

# 2. Start example app (in new terminal)
npm run example:dev

# 3. Run tests (in new terminal)
npm run test:watch

# 4. Open development URLs
# - Example app: http://localhost:3000
# - Firebase UI: http://localhost:4000
# - Storybook: http://localhost:6006 (future)
```

### Package Build Process

```bash
# TypeScript compilation
tsc → dist/types/

# Rollup bundling
rollup → dist/index.js (CommonJS)
        → dist/index.esm.js (ES Modules)

# CSS processing
postcss → dist/styles.css (Tailwind compiled)

# Package structure
dist/
├── index.js          # CommonJS entry
├── index.esm.js      # ES Module entry
├── index.d.ts        # TypeScript definitions
├── styles.css        # Compiled Tailwind CSS
└── types/            # Generated type files
```

### Testing Strategy

```typescript
// Unit tests
- utils/ → Pure function testing
- components/ → React Testing Library
- hooks/ → renderHook testing

// Integration tests
- Firebase operations with emulator
- Component interactions
- End-to-end workflows

// Coverage targets
- Statements: 90%+
- Branches: 85%+
- Functions: 90%+
- Lines: 90%+
```

## Performance Considerations

### Bundle Size Optimization
- Tree-shakeable exports
- Peer dependencies for React/Firebase
- Dynamic imports for large dependencies
- Tailwind CSS purging

### Runtime Performance
- Virtual scrolling for large content lists
- Debounced file validation
- Memoized components and callbacks
- Efficient re-renders with React.memo

### Network Optimization
- Firebase offline persistence
- Optimistic updates for user actions
- Batch operations for multiple items
- Smart caching for file metadata

## Browser Support

**Minimum Requirements**:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Mobile Support**:
- iOS Safari 14+
- Chrome Mobile 90+
- Samsung Internet 13+

**Node.js Compatibility**:
- Node.js 16+ for SSR/SSG support
- ES2020 target for broad compatibility

## Security Considerations

### Input Validation
- File type validation by extension and MIME type
- File size limits to prevent abuse
- URL validation with domain filtering
- XSS prevention through proper escaping

### Firebase Security
- Firestore security rules for production
- Storage security rules for file access
- Environment variable protection
- Emulator-only configurations for development

### Privacy
- Optional anonymization setting
- Local processing when possible
- Minimal data collection
- User control over data retention

## Future Enhancements

### v1.1 Features
- File preview thumbnails
- Batch file operations
- Content search and filtering
- Export functionality (CSV, JSON)

### v1.2 Features
- Real-time collaboration
- Advanced file processing options
- Content analytics and insights
- Custom styling themes

### v2.0 Considerations
- Other backend adapters (Supabase, AWS)
- Advanced workflow automation
- API integrations (Zapier, webhooks)
- Enterprise features (teams, permissions)

## Migration from Node.js Version

### Compatibility Matrix

| Feature | Node.js Version | React Version | Notes |
|---------|----------------|---------------|-------|
| URL Collection | ✅ | ✅ | Enhanced with better validation |
| File Upload | ✅ | ✅ | Improved drag & drop experience |
| Firebase Integration | ✅ | ✅ | Upgraded to v9 modular SDK |
| Dark Theme | ✅ | ✅ | Consistent design system |
| Real-time Updates | ✅ | ✅ | React hooks for subscriptions |
| Content Processing | ✅ | ✅ | Client-side with Firebase triggers |

### Breaking Changes
- **Architecture**: Server-side to client-side component library
- **Dependencies**: Express/Pug to React/TypeScript
- **Configuration**: Environment variables to props/context
- **Styling**: Custom CSS to Tailwind CSS
- **State Management**: Server-side to React Context

### Migration Benefits
- **Developer Experience**: Modern React tooling and hot reloading
- **Type Safety**: Complete TypeScript coverage
- **Testing**: Comprehensive test suite with mocks
- **Documentation**: Enhanced guides and examples
- **Performance**: Client-side optimizations and caching
- **Flexibility**: Component library for multiple applications

This specification serves as the definitive guide for understanding, implementing, and extending the Content Harvester React component library.