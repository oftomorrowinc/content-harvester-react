# Contributing to Content Harvester React

Thank you for your interest in contributing to Content Harvester React! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Code Style Guidelines](#code-style-guidelines)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Release Process](#release-process)

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to the project maintainers.

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Git
- Firebase CLI (for emulator testing)

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/content-harvester-react.git
   cd content-harvester-react
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Install Example Dependencies**
   ```bash
   cd examples/nextjs-example
   npm install
   cd ../..
   ```

4. **Start Development Environment**
   ```bash
   # Terminal 1: Start Firebase emulators
   npm run emulators
   
   # Terminal 2: Start example app
   npm run example:dev
   ```

5. **Run Tests**
   ```bash
   npm test
   ```

## Project Structure

```
content-harvester-react/
├── src/                    # Source code
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   └── styles/            # Tailwind CSS styles
├── tests/                 # Test files
├── examples/              # Example applications
├── docs/                  # Documentation
└── .vscode/              # VS Code configuration
```

### Key Directories

- **`src/components/`**: Reusable React components
- **`src/hooks/`**: Custom hooks for business logic
- **`src/types/`**: TypeScript interfaces and types
- **`src/utils/`**: Pure utility functions
- **`tests/`**: Jest and React Testing Library tests
- **`examples/nextjs-example/`**: Complete Next.js example

## Development Workflow

### 1. Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Making Changes

- Write your code following the [Code Style Guidelines](#code-style-guidelines)
- Add tests for new functionality
- Update documentation as needed
- Run tests and linting

### 3. Testing Your Changes

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run linting
npm run lint

# Run type checking
npm run typecheck

# Test the example app
npm run example:dev
```

### 4. Committing Changes

We use conventional commits. Your commit messages should follow this format:

```
type(scope): description

[optional body]

[optional footer]
```

Examples:
```bash
git commit -m "feat(components): add drag and drop validation"
git commit -m "fix(hooks): resolve memory leak in useContentManager"
git commit -m "docs: update installation instructions"
```

## Testing Guidelines

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test component interactions
- **Hook Tests**: Test custom hooks with `renderHook`

### Writing Tests

1. **Component Tests**
   ```typescript
   import { render, screen, fireEvent } from '@testing-library/react';
   import { MyComponent } from './MyComponent';
   
   describe('MyComponent', () => {
     it('should render correctly', () => {
       render(<MyComponent />);
       expect(screen.getByText('Expected Text')).toBeInTheDocument();
     });
   });
   ```

2. **Hook Tests**
   ```typescript
   import { renderHook, act } from '@testing-library/react';
   import { useMyHook } from './useMyHook';
   
   describe('useMyHook', () => {
     it('should return correct initial state', () => {
       const { result } = renderHook(() => useMyHook());
       expect(result.current.value).toBe(expectedValue);
     });
   });
   ```

3. **Utility Tests**
   ```typescript
   import { myUtilFunction } from './myUtils';
   
   describe('myUtilFunction', () => {
     it('should handle valid input', () => {
       expect(myUtilFunction('input')).toBe('expected output');
     });
   });
   ```

### Test Requirements

- All new features must include tests
- Aim for 80%+ code coverage
- Test both happy path and error cases
- Mock external dependencies (Firebase, etc.)

## Code Style Guidelines

### TypeScript

- Use strict TypeScript configuration
- Define explicit types for all public APIs
- Use meaningful interface names
- Prefer `interface` over `type` for object shapes

### React Components

- Use functional components with hooks
- Define prop interfaces
- Use meaningful component and prop names
- Extract complex logic into custom hooks

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `use*.ts`
- Utilities: `camelCase.ts`
- Types: `camelCase.ts`
- Tests: `*.test.tsx` or `*.test.ts`

### Code Organization

- One component per file
- Export components and types from index files
- Group related utilities together
- Keep files focused and small

### Styling

- Use Tailwind CSS classes
- Follow the dark theme design system
- Use semantic class names in components
- Avoid inline styles

## Commit Message Guidelines

We follow the [Conventional Commits](https://conventionalcommits.org/) specification:

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or modifying tests
- **chore**: Maintenance tasks

### Scopes (optional)

- **components**: React components
- **hooks**: Custom hooks
- **utils**: Utility functions
- **types**: Type definitions
- **examples**: Example applications
- **docs**: Documentation

### Examples

```
feat(components): add ContentTable sorting functionality
fix(hooks): resolve useFirebase memory leak
docs(readme): update installation instructions
test(utils): add tests for file validation
chore(deps): update dependencies to latest versions
```

## Pull Request Process

### Before Submitting

1. **Ensure all tests pass**
   ```bash
   npm test
   npm run lint
   npm run typecheck
   ```

2. **Update documentation** if needed

3. **Add/update tests** for your changes

4. **Test the example app** to ensure everything works

### Submitting a Pull Request

1. **Create a descriptive title**
   ```
   feat(components): add drag and drop file validation
   ```

2. **Fill out the PR template** with:
   - Description of changes
   - Type of change (feature, bugfix, etc.)
   - Testing performed
   - Screenshots if applicable

3. **Link any related issues**

4. **Request review** from maintainers

### PR Requirements

- All status checks must pass
- At least one approval from a maintainer
- No merge conflicts
- Documentation updated if needed

## Release Process

Releases are automated using semantic-release:

1. **Version Bump**: Based on conventional commits
2. **Changelog**: Generated automatically
3. **NPM Publish**: Automated on merge to main
4. **GitHub Release**: Created with changelog

### Manual Release (Maintainers Only)

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Run release
npm run release
```

## Code Review Guidelines

### For Authors

- Keep PRs focused and small
- Write clear descriptions
- Respond to feedback promptly
- Update your PR based on feedback

### For Reviewers

- Be constructive and respectful
- Focus on code quality and maintainability
- Check for test coverage
- Verify documentation is updated

## Getting Help

- **Issues**: Report bugs or request features
- **Discussions**: Ask questions or discuss ideas
- **Documentation**: Check existing docs first
- **Examples**: Look at the Next.js example app

## Development Tips

### VS Code Setup

The project includes VS Code configuration for:
- Auto-formatting on save
- ESLint integration
- TypeScript IntelliSense
- Debugging configuration

### Firebase Emulators

- Always use emulators for development
- Export/import emulator data for consistent testing
- Check emulator UI at http://localhost:4000

### Hot Reloading

Both the library and example app support hot reloading:
- Library changes are reflected in the example app
- Component changes update immediately
- Type changes trigger rebuilds

### Debugging

- Use VS Code debugger for step-through debugging
- Console logs are automatically stripped in production
- React DevTools work with the example app

Thank you for contributing to Content Harvester React! 🚀