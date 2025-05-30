module.exports = {
  // Printable width
  printWidth: 100,
  
  // Tab width
  tabWidth: 2,
  
  // Use spaces instead of tabs
  useTabs: false,
  
  // Semicolons
  semi: true,
  
  // Use single quotes
  singleQuote: true,
  
  // Quote properties
  quoteProps: 'as-needed',
  
  // JSX quotes
  jsxSingleQuote: false,
  
  // Trailing commas
  trailingComma: 'es5',
  
  // Bracket spacing
  bracketSpacing: true,
  
  // JSX bracket same line
  bracketSameLine: false,
  
  // Arrow function parentheses
  arrowParens: 'avoid',
  
  // Prose wrap
  proseWrap: 'preserve',
  
  // HTML whitespace sensitivity
  htmlWhitespaceSensitivity: 'css',
  
  // End of line
  endOfLine: 'lf',
  
  // Embedded language formatting
  embeddedLanguageFormatting: 'auto',
  
  // Single attribute per line in JSX
  singleAttributePerLine: false,
  
  // Override for specific file types
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 80,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 80,
        proseWrap: 'always',
      },
    },
    {
      files: '*.{css,scss,less}',
      options: {
        singleQuote: false,
      },
    },
    {
      files: '*.{yaml,yml}',
      options: {
        tabWidth: 2,
        singleQuote: false,
      },
    },
  ],
};