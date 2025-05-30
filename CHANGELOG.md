# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial release of Content Harvester React component library
- Complete TypeScript support with strict mode
- Dark theme UI components matching original design
- Firebase integration with Firestore and Storage
- Comprehensive drag & drop file handling
- URL extraction and validation utilities
- React hooks for content management
- Jest + React Testing Library test suite
- Next.js example application
- Firebase emulator support for development
- ESLint, Prettier, and TypeScript tooling
- VS Code development environment configuration
- Comprehensive documentation and guides

### Components
- `ContentHarvester` - Main component with full functionality
- `ContentTable` - Feature-rich table with sorting and actions
- `DropZone` - Advanced drag & drop with validation
- `StatusBadge` - Status indicators with icons
- `TypeBadge` - Content type badges with file type icons
- `ToggleSwitch` - Accessible toggle for settings
- `EmptyState` - Contextual empty states
- `ToastProvider` - Toast notification system

### Hooks
- `useFirebase` - Firebase initialization and services
- `useFirebaseOperations` - CRUD operations for Firestore/Storage
- `useContentManager` - High-level content management
- `useDragDrop` - Reusable drag & drop functionality

### Utilities
- URL extraction and validation with domain filtering
- File type validation with comprehensive MIME type support
- Display formatters for dates, file sizes, and status
- File sanitization and unique name generation

### Configuration
- Tailwind CSS with dark theme design system
- Firebase emulator configuration and security rules
- Complete TypeScript type definitions
- ESLint and Prettier configuration
- Jest testing configuration with mocks
- VS Code workspace settings and extensions
- Git hooks for code quality enforcement

## [1.0.0] - 2023-12-XX

### Added
- Initial stable release
- Full feature parity with original Node.js application
- Production-ready component library
- Comprehensive test coverage (90%+)
- Complete documentation and examples