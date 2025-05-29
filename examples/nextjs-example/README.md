# Content Harvester Next.js Example

This is an example Next.js application demonstrating how to use the Content Harvester React component library with Firebase.

## Features

- 🔥 Firebase integration with local emulators
- 🌙 Dark theme UI matching the original design
- 📁 File upload with drag & drop
- 🔗 URL collection and validation
- 📊 Real-time content management
- 🎨 Tailwind CSS styling
- 📱 Responsive design

## Prerequisites

Before running this example, make sure you have:

1. **Node.js** (v16 or higher)
2. **Firebase CLI** installed globally:
   ```bash
   npm install -g firebase-tools
   ```

## Getting Started

### 1. Start Firebase Emulators

From the project root directory:

```bash
# Start the Firebase emulators (Firestore + Storage)
npm run emulators
```

This will start:
- Firestore emulator on `localhost:8080`
- Storage emulator on `localhost:9199`
- Firebase UI on `localhost:4000` (optional)

### 2. Install Dependencies

In a new terminal, navigate to the example directory:

```bash
cd examples/nextjs-example
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Adding URLs

1. Use the URL input field at the top right
2. Paste URLs (must start with `http://` or `https://`)
3. Click "Add URLs" or press Enter

### Uploading Files

1. Drag and drop files onto the drop zone
2. Or click "Choose Files" to select files
3. Supported formats: PDF, images (JPG, PNG, GIF), text files
4. Maximum file size: 10MB

### Managing Content

- **Toggle Anonymization**: Use the switch in the "Anonymous" column
- **Delete Items**: Click the trash icon in the "Actions" column
- **Process All**: Click "Process All Items" to simulate processing
- **Refresh**: Click "Refresh" to reload content from Firebase

## Configuration

The example uses the following configuration:

```typescript
{
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
}
```

## Firebase Setup

### For Development (Emulators)

The example is pre-configured to work with Firebase emulators. No additional setup is required.

### For Production

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)

2. Enable Firestore and Storage in your Firebase project

3. Copy `.env.local.example` to `.env.local` and update with your Firebase configuration:

```bash
cp .env.local.example .env.local
```

4. Update the values in `.env.local` with your Firebase project settings

5. Update the `useEmulators` setting in `lib/firebase.ts`:

```typescript
export const useEmulators = false; // Set to false for production
```

## Project Structure

```
examples/nextjs-example/
├── app/
│   ├── globals.css          # Global styles including Content Harvester CSS
│   ├── layout.tsx          # Root layout with dark theme
│   └── page.tsx            # Main page with Content Harvester
├── lib/
│   └── firebase.ts         # Firebase configuration
├── package.json
├── tailwind.config.js      # Tailwind configuration with dark theme
└── tsconfig.json          # TypeScript configuration
```

## Key Integration Points

### 1. Provider Setup

```tsx
import { ContentHarvesterProvider } from '@content-harvester/react';

<ContentHarvesterProvider
  firebaseConfig={firebaseConfig}
  useEmulators={true}
  config={{
    collection: 'demo-content',
    // ... other config
  }}
>
  {/* Your app content */}
</ContentHarvesterProvider>
```

### 2. Component Usage

```tsx
import { ContentHarvester } from '@content-harvester/react';

<ContentHarvester
  onContentAdded={(count) => console.log(`Added ${count} items`)}
  onContentDeleted={(id) => console.log(`Deleted ${id}`)}
  showUrlInput={true}
  showFileUpload={true}
  maxHeight="500px"
/>
```

### 3. Styling Integration

```css
/* Import Content Harvester styles */
@import '@content-harvester/react/styles';
```

## Troubleshooting

### Firebase Emulator Issues

1. **Port conflicts**: Check if ports 8080 or 9199 are already in use
2. **Firebase CLI not installed**: Run `npm install -g firebase-tools`
3. **Emulators not starting**: Try `firebase emulators:kill` then restart

### Build Issues

1. **Module not found**: Ensure you've run `npm install` in the example directory
2. **TypeScript errors**: Check that paths in `tsconfig.json` are correct
3. **Tailwind styles not loading**: Verify `tailwind.config.js` includes the correct content paths

### Runtime Issues

1. **Firebase connection errors**: Ensure emulators are running
2. **File upload failures**: Check file size and type restrictions
3. **URL validation errors**: Ensure URLs start with `http://` or `https://`

## Learning Resources

- [Content Harvester Documentation](../../README.md)
- [Firebase Web Documentation](https://firebase.google.com/docs/web/setup)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Support

If you encounter issues:

1. Check the [main project README](../../README.md)
2. Review the Firebase emulator logs
3. Open an issue in the main repository