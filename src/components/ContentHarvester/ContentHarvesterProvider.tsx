import React, { createContext, useContext, useMemo } from 'react';
import type { 
  FirebaseConfig, 
  ContentHarvesterConfig, 
  FileTypeConfig, 
  UrlConfig,
  FirebaseEmulatorConfig,
} from '../../types';
import { 
  DEFAULT_FILE_CONFIG, 
  DEFAULT_URL_CONFIG, 
  DEFAULT_EMULATOR_CONFIG 
} from '../../types';
import { useFirebase, useFirebaseOperations } from '../../hooks';
import { ToastProvider } from '../ToastProvider';

export interface ContentHarvesterContextValue {
  /** Firebase configuration */
  firebaseConfig: FirebaseConfig;
  
  /** Content harvester configuration */
  config: Required<ContentHarvesterConfig>;
  
  /** Firebase operations */
  firebaseOps: ReturnType<typeof useFirebaseOperations> | null;
  
  /** Firebase ready state */
  firebaseReady: boolean;
  
  /** Firebase loading state */
  firebaseLoading: boolean;
  
  /** Firebase error */
  firebaseError: string | null;
}

const ContentHarvesterContext = createContext<ContentHarvesterContextValue | null>(null);

export interface ContentHarvesterProviderProps {
  children: React.ReactNode;
  
  /** Firebase configuration */
  firebaseConfig: FirebaseConfig;
  
  /** Content harvester configuration */
  config?: Partial<ContentHarvesterConfig>;
  
  /** Whether to use Firebase emulators */
  useEmulators?: boolean;
  
  /** Emulator configuration */
  emulatorConfig?: FirebaseEmulatorConfig;
  
  /** Toast notification position */
  toastPosition?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
}

/**
 * Content Harvester provider component
 */
export const ContentHarvesterProvider: React.FC<ContentHarvesterProviderProps> = ({
  children,
  firebaseConfig,
  config = {},
  useEmulators = false,
  emulatorConfig = DEFAULT_EMULATOR_CONFIG,
  toastPosition = 'top-right',
}) => {
  // Initialize Firebase
  const firebase = useFirebase({
    config: firebaseConfig,
    useEmulators,
    emulatorConfig,
  });

  // Create complete configuration with defaults
  const completeConfig: Required<ContentHarvesterConfig> = useMemo(() => ({
    collection: config.collection || 'contents',
    storagePath: config.storagePath || 'uploads',
    fileConfig: {
      ...DEFAULT_FILE_CONFIG,
      ...config.fileConfig,
    } as FileTypeConfig,
    urlConfig: {
      ...DEFAULT_URL_CONFIG,
      ...config.urlConfig,
    } as UrlConfig,
    realTimeUpdates: config.realTimeUpdates ?? true,
    maxDisplayItems: config.maxDisplayItems || 1000,
  }), [config]);

  // Initialize Firebase operations
  const firebaseOps = useMemo(() => {
    if (!firebase.services) return null;
    
    return useFirebaseOperations({
      services: firebase.services,
      collection: completeConfig.collection,
      storagePath: completeConfig.storagePath,
    });
  }, [firebase.services, completeConfig.collection, completeConfig.storagePath]);

  const contextValue: ContentHarvesterContextValue = {
    firebaseConfig,
    config: completeConfig,
    firebaseOps,
    firebaseReady: firebase.ready,
    firebaseLoading: firebase.loading,
    firebaseError: firebase.error,
  };

  return (
    <ToastProvider position={toastPosition}>
      <ContentHarvesterContext.Provider value={contextValue}>
        {children}
      </ContentHarvesterContext.Provider>
    </ToastProvider>
  );
};

/**
 * Hook to use Content Harvester context
 */
export const useContentHarvester = (): ContentHarvesterContextValue => {
  const context = useContext(ContentHarvesterContext);
  
  if (!context) {
    throw new Error('useContentHarvester must be used within a ContentHarvesterProvider');
  }
  
  return context;
};