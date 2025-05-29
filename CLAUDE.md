# Claude Development Notes

This file contains development notes, commands, and decisions made during the development of the Content Harvester React package.

## Development Environment

**Key Commands:**
- `npm run lint` - Run ESLint checks
- `npm run typecheck` - Run TypeScript type checking  
- `npm test` - Run Jest test suite
- `npm run build` - Build the npm package
- `npm run dev` - Start development server with Firebase emulators

## Architecture Decisions

### Component Library Design
- **Decision**: Build as a component library rather than a complete application
- **Reasoning**: Maximum flexibility for different use cases and frameworks
- **Impact**: Users can customize styling, integrate with existing design systems

### Firebase Client SDK vs Admin SDK
- **Decision**: Use Firebase Client SDK (v9 modular)
- **Reasoning**: Smaller bundle size, better for client-side applications, works in browser
- **Impact**: Users provide their own Firebase config, supports emulators for development

### State Management
- **Decision**: React Context + Custom Hooks instead of Redux/Zustand
- **Reasoning**: Simpler setup, fewer dependencies, sufficient for this use case
- **Impact**: Easier to integrate, but users need to wrap components in providers

### Styling Approach  
- **Decision**: Tailwind CSS with dark theme only
- **Reasoning**: Matches original design, utility-first approach, smaller CSS bundle
- **Impact**: Users get consistent dark theme, can override with Tailwind classes

### Testing Strategy
- **Decision**: Jest + React Testing Library + Mock Firebase
- **Reasoning**: Industry standard, excellent React component testing support
- **Impact**: Comprehensive test coverage without real Firebase dependencies

## File Structure Rationale

```
src/
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks for logic
├── types/          # TypeScript type definitions
├── utils/          # Pure utility functions
├── styles/         # Tailwind CSS styling
└── index.ts        # Main package exports
```

This structure separates concerns clearly:
- **Components**: Focus on rendering and user interaction
- **Hooks**: Encapsulate complex state logic and side effects
- **Utils**: Pure functions for validation, formatting, etc.
- **Types**: Centralized type definitions for consistency

## Key Implementation Notes

### Content Model Evolution
The original Node.js app had these fields:
- `id`, `type`, `name`, `url`, `size`, `status`, `storageRef`, `createdAt`, `updatedAt`

React version additions:
- `mimeType` - Better file type handling
- `anonymize` - User preference for processing
- Enhanced status types with error handling

### Firebase Integration Pattern
```typescript
// Pattern: Hook-based Firebase operations
const { addContent, deleteContent, updateStatus } = useContentManager();
const { uploadFile } = useFirebase();

// Keeps components clean and testable
```

### Drag & Drop Implementation
Using modern HTML5 Drag & Drop API with:
- Visual feedback during drag operations
- File type validation on drop
- Toast notifications for errors
- Automatic content addition on success

## Development Workflow

1. **Setup Phase**
   - Configure TypeScript, ESLint, Prettier
   - Set up Tailwind with dark theme
   - Configure Jest with React Testing Library

2. **Core Development**
   - Build utils first (pure functions, easy to test)
   - Create TypeScript types
   - Implement hooks (business logic)
   - Build components (UI layer)

3. **Integration**
   - Create main package exports
   - Build example Next.js app
   - Write comprehensive tests

4. **Polish**
   - Documentation
   - Performance optimization
   - Package publishing setup

## Testing Approach

### Unit Tests
- All utility functions (URL extraction, file validation, formatters)
- Custom hooks with mocked Firebase
- Individual components in isolation

### Integration Tests
- Complete ContentHarvester component
- Firebase operations with emulator
- Drag & drop workflows

### Example App Testing
- E2E tests with Cypress (future consideration)
- Manual testing with real Firebase project

## Performance Considerations

### Bundle Size
- Tree-shakeable exports
- Dynamic imports for Firebase
- Minimal dependencies
- Tailwind CSS purging

### Runtime Performance
- Virtual scrolling for large content lists
- Debounced file validation
- Memoized components and callbacks
- Efficient re-renders with React.memo

## Firebase Emulator Setup

For local development:
```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Initialize Firebase project (once)
firebase init

# Start emulators
firebase emulators:start --only firestore,storage

# Export data for reuse
firebase emulators:export ./firebase-emulator-data
```

## Package Publishing Notes

### NPM Package Configuration
- Proper entry points for ESM and CommonJS
- Type definitions included
- Peer dependencies for React and Firebase
- Semantic versioning

### Release Process
1. Update version in package.json
2. Run full test suite
3. Build package and verify exports
4. Publish to NPM
5. Create GitHub release with changelog

## Future Enhancements

### v1.1 Features
- File preview thumbnails
- Batch file operations
- Content search and filtering
- Export functionality

### v2.0 Considerations
- Other backend adapters (Supabase, AWS S3)
- Custom styling themes beyond dark mode
- Advanced file processing options
- Real-time collaboration features

## Troubleshooting

### Common Issues
- **Firebase config errors**: Ensure FIREBASE_CONFIG environment variable is set
- **Type errors**: Run `npm run typecheck` to identify issues
- **Test failures**: Check Firebase emulator is running for integration tests
- **Build errors**: Verify all imports and exports are correct

### Debug Commands
```bash
# Verbose test output
npm test -- --verbose

# TypeScript compilation check
npx tsc --noEmit

# Bundle analysis
npm run build && npm run analyze

# Firebase emulator logs
firebase emulators:start --debug
```