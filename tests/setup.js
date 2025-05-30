require('@testing-library/jest-dom');

// Mock Firebase modules
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(() => ({
    name: '[DEFAULT]',
    options: {},
  })),
  getApps: jest.fn(() => []),
}));

jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(() => ({
    _delegate: { _terminated: false },
  })),
  connectFirestoreEmulator: jest.fn(),
  doc: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  orderBy: jest.fn(),
  where: jest.fn(),
  limit: jest.fn(),
  startAfter: jest.fn(),
  serverTimestamp: jest.fn(() => ({ seconds: Date.now() / 1000, nanoseconds: 0 })),
  Timestamp: {
    fromDate: jest.fn((date) => ({
      seconds: Math.floor(date.getTime() / 1000),
      nanoseconds: 0,
      toDate: () => date,
    })),
  },
}));

jest.mock('firebase/storage', () => ({
  getStorage: jest.fn(() => ({})),
  connectStorageEmulator: jest.fn(),
  ref: jest.fn(),
  uploadBytes: jest.fn(),
  getDownloadURL: jest.fn(),
  deleteObject: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
    dismiss: jest.fn(),
  },
  toast: jest.fn(),
  Toaster: ({ children }) => children,
}));

// Mock UUID
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234'),
}));

// Setup window.URL for file validation tests
if (!global.URL) {
  global.URL = class URL {
    constructor(url) {
      this.href = url;
      this.protocol = url.split(':')[0] + ':';
      this.hostname = url.split('://')[1]?.split('/')[0] || '';
      this.pathname = '/' + (url.split('://')[1]?.split('/').slice(1).join('/') || '');
      this.search = '';
    }
    
    toString() {
      return this.href;
    }
  };
}

// Setup window.File for file upload tests
if (!global.File) {
  global.File = class File {
    constructor(bits, name, options = {}) {
      this.bits = bits;
      this.name = name;
      this.size = options.size || 0;
      this.type = options.type || '';
      this.lastModified = options.lastModified || Date.now();
    }
  };
}

// Setup FileList for file upload tests
if (!global.FileList) {
  global.FileList = class FileList extends Array {
    item(index) {
      return this[index];
    }
  };
}

// Setup DataTransfer for drag and drop tests
if (!global.DataTransfer) {
  global.DataTransfer = class DataTransfer {
    constructor() {
      this.files = new FileList();
      this.items = [];
      this.types = [];
      this.dropEffect = 'none';
      this.effectAllowed = 'uninitialized';
    }
    
    getData() {
      return '';
    }
    
    setData() {}
  };
}

// Suppress console warnings in tests
const originalWarn = console.warn;
const originalError = console.error;

beforeAll(() => {
  console.warn = jest.fn();
  console.error = jest.fn();
});

afterAll(() => {
  console.warn = originalWarn;
  console.error = originalError;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});