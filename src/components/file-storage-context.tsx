import React from "react";

// Define the type for our stored file entries
export type StoredFile = {
  file: File;
  accessCode: string;
  name: string;
  size: number;
  type: string;
  uploadDate: Date;
};

// Create context for file storage
type FileStorageContextType = {
  storedFiles: Map<string, StoredFile>;
  storeFile: (file: File, accessCode: string) => void;
  getFile: (accessCode: string) => StoredFile | undefined;
  persistToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
};

const FileStorageContext = React.createContext<FileStorageContextType | undefined>(undefined);

export const FileStorageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  // Use a Map to store files with access codes as keys
  const [storedFiles, setStoredFiles] = React.useState<Map<string, StoredFile>>(new Map());

  // Load files from localStorage on initial mount
  React.useEffect(() => {
    loadFromLocalStorage();
    // Set up browser storage event listener for cross-tab synchronization
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === 'secureShareFiles') {
      loadFromLocalStorage();
    }
  };

  const storeFile = (file: File, accessCode: string) => {
    setStoredFiles(prev => {
      const newMap = new Map(prev);
      newMap.set(accessCode, {
        file,
        accessCode,
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date()
      });
      
      // Persist to localStorage after updating state
      setTimeout(() => persistToLocalStorage(newMap), 0);
      
      return newMap;
    });
  };

  const getFile = (accessCode: string) => {
    return storedFiles.get(accessCode);
  };

  // Save files to localStorage (metadata only, actual files can't be stored)
  const persistToLocalStorage = (filesMap = storedFiles) => {
    try {
      const fileMetadata = Array.from(filesMap.entries()).map(([code, fileData]) => {
        // Store only metadata, not the actual file (which can't be serialized)
        const { file, ...metadata } = fileData;
        return [code, {
          ...metadata,
          // Store file info that can be used for UI display
          fileInfo: {
            name: file.name,
            size: file.size,
            type: file.type
          }
        }];
      });
      
      localStorage.setItem('secureShareFiles', JSON.stringify(fileMetadata));
      // Dispatch storage event for cross-tab communication
      window.dispatchEvent(new Event('secureShareFilesUpdated'));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  // Load file metadata from localStorage
  const loadFromLocalStorage = () => {
    try {
      const storedData = localStorage.getItem('secureShareFiles');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        // We can't restore the actual File objects, so we'll mark them as needing upload
        setStoredFiles(new Map(parsedData));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  const value = {
    storedFiles,
    storeFile,
    getFile,
    persistToLocalStorage,
    loadFromLocalStorage
  };

  return (
    <FileStorageContext.Provider value={value}>
      {children}
    </FileStorageContext.Provider>
  );
};

export const useFileStorage = () => {
  const context = React.useContext(FileStorageContext);
  if (context === undefined) {
    throw new Error("useFileStorage must be used within a FileStorageProvider");
  }
  return context;
};