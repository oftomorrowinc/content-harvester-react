import { FirebaseApp } from 'firebase/app';
import { Firestore } from 'firebase/firestore';
import { FirebaseStorage } from 'firebase/storage';

/**
 * Firebase configuration object
 */
export interface FirebaseConfig {
  /** Firebase API key */
  apiKey: string;
  
  /** Firebase Auth domain */
  authDomain: string;
  
  /** Firebase project ID */
  projectId: string;
  
  /** Firebase Storage bucket */
  storageBucket: string;
  
  /** Firebase messaging sender ID */
  messagingSenderId: string;
  
  /** Firebase app ID */
  appId: string;
  
  /** Firebase measurement ID (optional, for Analytics) */
  measurementId?: string;
}

/**
 * Firebase emulator configuration
 */
export interface FirebaseEmulatorConfig {
  /** Whether emulators are enabled */
  enabled: boolean;
  
  /** Firestore emulator host and port */
  firestore?: {
    host: string;
    port: number;
  };
  
  /** Storage emulator host and port */
  storage?: {
    host: string;
    port: number;
  };
  
  /** Auth emulator host and port (if using auth) */
  auth?: {
    host: string;
    port: number;
  };
}

/**
 * Complete Firebase configuration with emulator support
 */
export interface CompleteFirebaseConfig {
  /** Firebase project configuration */
  config: FirebaseConfig;
  
  /** Emulator configuration (for development) */
  emulators?: FirebaseEmulatorConfig;
}

/**
 * Firebase services interface
 */
export interface FirebaseServices {
  /** Firebase app instance */
  app: FirebaseApp;
  
  /** Firestore database instance */
  firestore: Firestore;
  
  /** Firebase Storage instance */
  storage: FirebaseStorage;
}

/**
 * Firebase initialization options
 */
export interface FirebaseInitOptions {
  /** Firebase configuration */
  config: FirebaseConfig;
  
  /** App name (optional, defaults to default) */
  appName?: string;
  
  /** Whether to use emulators (development mode) */
  useEmulators?: boolean;
  
  /** Emulator configuration */
  emulatorConfig?: FirebaseEmulatorConfig;
}

/**
 * Firebase error types
 */
export type FirebaseErrorCode = 
  | 'permission-denied'
  | 'not-found'
  | 'already-exists'
  | 'resource-exhausted'
  | 'failed-precondition'
  | 'aborted'
  | 'out-of-range'
  | 'unimplemented'
  | 'internal'
  | 'unavailable'
  | 'data-loss'
  | 'unauthenticated'
  | 'cancelled'
  | 'invalid-argument'
  | 'deadline-exceeded'
  | 'storage/unknown'
  | 'storage/object-not-found'
  | 'storage/bucket-not-found'
  | 'storage/project-not-found'
  | 'storage/quota-exceeded'
  | 'storage/unauthenticated'
  | 'storage/unauthorized'
  | 'storage/retry-limit-exceeded'
  | 'storage/invalid-checksum'
  | 'storage/canceled'
  | 'storage/invalid-event-name'
  | 'storage/invalid-url'
  | 'storage/invalid-argument'
  | 'storage/no-default-bucket'
  | 'storage/cannot-slice-blob'
  | 'storage/server-file-wrong-size';

/**
 * Firebase error interface
 */
export interface FirebaseError {
  /** Error code */
  code: FirebaseErrorCode;
  
  /** Error message */
  message: string;
  
  /** Original error (if available) */
  originalError?: Error;
}

/**
 * Firestore document reference path
 */
export type DocumentPath = string;

/**
 * Firestore collection reference path
 */
export type CollectionPath = string;

/**
 * Firebase Storage reference path
 */
export type StoragePath = string;

/**
 * Firebase timestamp type (for Firestore)
 */
export interface FirebaseTimestamp {
  seconds: number;
  nanoseconds: number;
}

/**
 * Firestore query constraint type
 */
export type QueryConstraintType = 
  | 'where'
  | 'orderBy'
  | 'limit'
  | 'limitToLast'
  | 'startAt'
  | 'startAfter'
  | 'endAt'
  | 'endBefore';

/**
 * Firestore where operator
 */
export type WhereFilterOp =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'array-contains-any'
  | 'not-in';

/**
 * Firestore order by direction
 */
export type OrderByDirection = 'asc' | 'desc';

/**
 * Upload progress callback
 */
export interface UploadProgress {
  /** Bytes transferred */
  bytesTransferred: number;
  
  /** Total bytes */
  totalBytes: number;
  
  /** Upload state */
  state: 'running' | 'paused' | 'success' | 'canceled' | 'error';
  
  /** Progress percentage (0-100) */
  progress: number;
}

/**
 * Upload task interface
 */
export interface UploadTask {
  /** Upload progress */
  progress: UploadProgress;
  
  /** Cancel upload */
  cancel: () => boolean;
  
  /** Pause upload */
  pause: () => boolean;
  
  /** Resume upload */
  resume: () => boolean;
}

/**
 * Storage upload options
 */
export interface StorageUploadOptions {
  /** Content type */
  contentType?: string;
  
  /** Custom metadata */
  customMetadata?: Record<string, string>;
  
  /** Cache control */
  cacheControl?: string;
  
  /** Content disposition */
  contentDisposition?: string;
  
  /** Content encoding */
  contentEncoding?: string;
  
  /** Content language */
  contentLanguage?: string;
}

/**
 * Default Firebase configuration for development
 */
export const DEFAULT_EMULATOR_CONFIG: FirebaseEmulatorConfig = {
  enabled: true,
  firestore: {
    host: 'localhost',
    port: 8080,
  },
  storage: {
    host: 'localhost',
    port: 9199,
  },
};

/**
 * Default file type configuration
 */
export const DEFAULT_FILE_CONFIG = {
  allowedExtensions: [
    '.pdf', '.doc', '.docx', '.txt', '.md', '.rtf',
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg',
    '.mp4', '.mov', '.avi', '.mkv', '.webm',
    '.mp3', '.wav', '.m4a', '.aac', '.ogg',
    '.zip', '.rar', '.7z', '.tar', '.gz',
    '.csv', '.xlsx', '.xls', '.ppt', '.pptx',
  ],
  blockedExtensions: [
    '.exe', '.dll', '.bat', '.cmd', '.scr', '.pif',
    '.vbs', '.js', '.jar', '.app', '.deb', '.rpm',
  ],
  maxFileSize: 50 * 1024 * 1024, // 50MB
  maxTotalSize: 500 * 1024 * 1024, // 500MB
};

/**
 * Default URL configuration
 */
export const DEFAULT_URL_CONFIG = {
  allowedProtocols: ['http:', 'https:'],
  maxUrlLength: 2048,
};