import { useState, useEffect, useCallback } from 'react';
import { initializeApp, FirebaseApp, getApps } from 'firebase/app';
import {
  getFirestore,
  connectFirestoreEmulator,
  doc,
  collection,
  setDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  where,
  limit,
  DocumentSnapshot,
  QueryConstraint,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  getStorage,
  connectStorageEmulator,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  UploadResult,
} from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

import type {
  FirebaseConfig,
  FirebaseServices,
  ContentItem,
  CreateContentData,
  UpdateContentData,
  FileUploadResult,
  ContentQueryOptions,
  ContentQueryResult,
  FirebaseEmulatorConfig,
  StorageUploadOptions,
} from '../types';
import { DEFAULT_EMULATOR_CONFIG } from '../types';

export interface UseFirebaseOptions {
  /** Firebase configuration */
  config: FirebaseConfig;

  /** Whether to use emulators (for development) */
  useEmulators?: boolean;

  /** Emulator configuration */
  emulatorConfig?: FirebaseEmulatorConfig;

  /** App name for Firebase initialization */
  appName?: string;
}

export interface UseFirebaseReturn {
  /** Firebase services */
  services: FirebaseServices | null;

  /** Loading state */
  loading: boolean;

  /** Error state */
  error: string | null;

  /** Whether Firebase is ready */
  ready: boolean;
}

/**
 * Hook to initialize and manage Firebase services
 */
export const useFirebase = ({
  config,
  useEmulators = false,
  emulatorConfig = DEFAULT_EMULATOR_CONFIG,
  appName = '[DEFAULT]',
}: UseFirebaseOptions): UseFirebaseReturn => {
  const [services, setServices] = useState<FirebaseServices | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if app already exists
        let app: FirebaseApp;
        const existingApps = getApps();
        const existingApp = existingApps.find(a => a.name === appName);

        if (existingApp) {
          app = existingApp;
        } else {
          app = initializeApp(config, appName);
        }

        // Initialize Firestore
        const firestore = getFirestore(app);

        // Initialize Storage
        const storage = getStorage(app);

        // Connect to emulators if needed
        if (useEmulators && emulatorConfig.enabled) {
          // Connect Firestore emulator
          if (emulatorConfig.firestore) {
            try {
              connectFirestoreEmulator(
                firestore,
                emulatorConfig.firestore.host,
                emulatorConfig.firestore.port,
              );
            } catch (e) {
              // Emulator might already be connected
              console.warn('Firestore emulator connection warning:', e);
            }
          }

          // Connect Storage emulator
          if (emulatorConfig.storage) {
            try {
              connectStorageEmulator(
                storage,
                emulatorConfig.storage.host,
                emulatorConfig.storage.port,
              );
            } catch (e) {
              // Emulator might already be connected
              console.warn('Storage emulator connection warning:', e);
            }
          }
        }

        setServices({
          app,
          firestore,
          storage,
        });
      } catch (err) {
        console.error('Firebase initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize Firebase');
      } finally {
        setLoading(false);
      }
    };

    initializeFirebase();
  }, [config, useEmulators, emulatorConfig, appName]);

  return {
    services,
    loading,
    error,
    ready: services !== null && !loading && !error,
  };
};

export interface UseFirebaseOperationsOptions {
  /** Firebase services */
  services: FirebaseServices | null;

  /** Firestore collection name */
  collection: string;

  /** Storage path for file uploads */
  storagePath?: string;
}

export interface UseFirebaseOperationsReturn {
  /** Create a new content item */
  createContent: (data: CreateContentData) => Promise<ContentItem>;

  /** Update an existing content item */
  updateContent: (id: string, data: UpdateContentData) => Promise<ContentItem>;

  /** Delete a content item */
  deleteContent: (id: string) => Promise<void>;

  /** Get a content item by ID */
  getContent: (id: string) => Promise<ContentItem | null>;

  /** Query content items */
  queryContent: (options?: ContentQueryOptions) => Promise<ContentQueryResult>;

  /** Upload a file to Firebase Storage */
  uploadFile: (file: File, options?: StorageUploadOptions) => Promise<FileUploadResult>;

  /** Delete a file from Firebase Storage */
  deleteFile: (storageRef: string) => Promise<void>;

  /** Get download URL for a file */
  getFileUrl: (storageRef: string) => Promise<string>;
}

/**
 * Hook for Firebase CRUD operations
 */
export const useFirebaseOperations = ({
  services,
  collection: collectionName,
  storagePath = 'uploads',
}: UseFirebaseOperationsOptions): UseFirebaseOperationsReturn => {
  const createContent = useCallback(async (data: CreateContentData): Promise<ContentItem> => {
    if (!services) {
      throw new Error('Firebase services not initialized');
    }
    const { firestore } = services;
    const id = uuidv4();

    const contentData: Omit<ContentItem, 'id'> = {
      ...data,
      status: 'pending',
      anonymize: data.anonymize ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = doc(firestore, collectionName, id);
    await setDoc(docRef, {
      ...contentData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id, ...contentData };
  }, [services, collectionName]);

  const updateContent = useCallback(async (id: string, data: UpdateContentData): Promise<ContentItem> => {
    if (!services) {
      throw new Error('Firebase services not initialized');
    }
    const { firestore } = services;

    const docRef = doc(firestore, collectionName, id);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp(),
    };

    await updateDoc(docRef, updateData);

    // Get updated document
    const updatedDoc = await getDoc(docRef);
    if (!updatedDoc.exists()) {
      throw new Error(`Content item ${id} not found`);
    }

    return convertFirestoreDoc(updatedDoc);
  }, [services, collectionName]);

  const deleteContent = useCallback(async (id: string): Promise<void> => {
    if (!services) {
      throw new Error('Firebase services not initialized');
    }
    const { firestore } = services;

    // Get the document to check if it has a file to delete
    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const contentItem = convertFirestoreDoc(docSnap);

      // Delete associated file if it exists
      if (contentItem.storageRef) {
        try {
          await deleteFile(contentItem.storageRef);
        } catch (err) {
          console.warn('Failed to delete associated file:', err);
        }
      }
    }

    // Delete the document
    await deleteDoc(docRef);
  }, [services, collectionName]);

  const getContent = useCallback(async (id: string): Promise<ContentItem | null> => {
    if (!services) {
      throw new Error('Firebase services not initialized');
    }
    const { firestore } = services;

    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return convertFirestoreDoc(docSnap);
  }, [services, collectionName]);

  const queryContent = useCallback(async (options?: ContentQueryOptions): Promise<ContentQueryResult> => {
    if (!services) {
      throw new Error('Firebase services not initialized');
    }
    const { firestore } = services;

    const constraints: QueryConstraint[] = [];

    // Add filters
    if (options?.filter) {
      const { filter } = options;

      if (filter.type) {
        constraints.push(where('type', '==', filter.type));
      }

      if (filter.status) {
        constraints.push(where('status', '==', filter.status));
      }

      if (filter.dateRange) {
        constraints.push(where('createdAt', '>=', filter.dateRange.start));
        constraints.push(where('createdAt', '<=', filter.dateRange.end));
      }
    }

    // Add sorting
    const sortField = options?.sort?.field || 'createdAt';
    const sortDirection = options?.sort?.direction || 'desc';
    constraints.push(orderBy(sortField, sortDirection));

    // Add pagination
    if (options?.pagination?.limit) {
      constraints.push(limit(options.pagination.limit));
    }

    if (options?.pagination?.startAfter) {
      // This would require the last document from the previous query
      // For now, we'll implement basic pagination
    }

    const q = query(collection(firestore, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    const items = querySnapshot.docs.map(convertFirestoreDoc);

    return {
      items,
      hasMore: items.length === (options?.pagination?.limit || 0),
      lastDocId: items.length > 0 ? items[items.length - 1].id : undefined,
    };
  }, [services, collectionName]);

  const uploadFile = useCallback(async (file: File, options?: StorageUploadOptions): Promise<FileUploadResult> => {
    if (!services) {
      throw new Error('Firebase services not initialized');
    }
    const { storage } = services;

    const filename = `${uuidv4()}-${file.name}`;
    const filePath = `${storagePath}/${filename}`;
    const storageRef = ref(storage, filePath);

    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name,
        ...options?.customMetadata,
      },
      ...options,
    };

    const uploadResult: UploadResult = await uploadBytes(storageRef, file, metadata);
    const downloadURL = await getDownloadURL(uploadResult.ref);

    return {
      storageRef: filePath,
      url: downloadURL,
      name: file.name,
      size: file.size,
      mimeType: file.type,
    };
  }, [services, storagePath]);

  const deleteFile = useCallback(async (storageRef: string): Promise<void> => {
    if (!services) {
      throw new Error('Firebase services not initialized');
    }
    const { storage } = services;

    const fileRef = ref(storage, storageRef);
    await deleteObject(fileRef);
  }, [services]);

  const getFileUrl = useCallback(async (storageRef: string): Promise<string> => {
    if (!services) {
      throw new Error('Firebase services not initialized');
    }
    const { storage } = services;

    const fileRef = ref(storage, storageRef);
    return await getDownloadURL(fileRef);
  }, [services]);

  return {
    createContent,
    updateContent,
    deleteContent,
    getContent,
    queryContent,
    uploadFile,
    deleteFile,
    getFileUrl,
  };
};

/**
 * Convert Firestore document to ContentItem
 */
function convertFirestoreDoc(doc: DocumentSnapshot): ContentItem {
  const data = doc.data()!;

  return {
    id: doc.id,
    type: data.type,
    name: data.name,
    url: data.url,
    size: data.size,
    mimeType: data.mimeType,
    status: data.status,
    anonymize: data.anonymize || false,
    storageRef: data.storageRef,
    createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
    updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : new Date(data.updatedAt),
    error: data.error,
    metadata: data.metadata,
  };
}
