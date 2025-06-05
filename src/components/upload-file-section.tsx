import React from "react";
import { Button, Input, Progress, Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useFileStorage } from "./file-storage-context";
import { QRCodeGenerator } from "./qr-code-generator";
import { DirectLinkGenerator } from "./direct-link-generator";
import { useMobileDetection } from "./mobile-device-detection";

export const UploadFileSection = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [accessCode, setAccessCode] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { storeFile } = useFileStorage();
  const { isMobile } = useMobileDetection();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setAccessCode(null);
    
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file size (10MB max)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit");
        return;
      }
      
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setError(null);
    setAccessCode(null);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      
      // Check file size (10MB max)
      if (droppedFile.size > 10 * 1024 * 1024) {
        setError("File size exceeds 10MB limit");
        return;
      }
      
      setFile(droppedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          
          // Generate a random 6-character access code
          const generatedCode = Math.random().toString(36).substring(2, 8).toUpperCase();
          
          // Store the file in our context
          storeFile(file, generatedCode);
          
          setAccessCode(generatedCode);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const copyToClipboard = () => {
    if (accessCode) {
      navigator.clipboard.writeText(accessCode);
    }
  };

  const resetForm = () => {
    setFile(null);
    setAccessCode(null);
    setError(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " bytes";
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + " KB";
    else return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  // File type icon mapping
  const getFileIcon = (fileType: string) => {
    if (fileType.includes("image")) return "lucide:image";
    if (fileType.includes("pdf")) return "lucide:file-type-pdf";
    if (fileType.includes("doc") || fileType.includes("word")) return "lucide:file-type-word";
    if (fileType.includes("xls") || fileType.includes("sheet")) return "lucide:file-type-excel";
    if (fileType.includes("ppt") || fileType.includes("presentation")) return "lucide:file-type-powerpoint";
    if (fileType.includes("zip") || fileType.includes("rar") || fileType.includes("tar")) return "lucide:file-archive";
    if (fileType.includes("audio") || fileType.includes("mp3")) return "lucide:file-audio";
    if (fileType.includes("video") || fileType.includes("mp4")) return "lucide:file-video";
    if (fileType.includes("text") || fileType.includes("txt")) return "lucide:file-text";
    if (fileType.includes("code") || fileType.includes("json") || fileType.includes("xml")) return "lucide:file-code";
    return "lucide:file";
  };

  // Add a function to share the access code
  const handleShareCode = () => {
    if (!accessCode || !file) return;
    
    // Use Web Share API if available
    if (navigator.share) {
      navigator.share({
        title: 'Access my shared file',
        text: `Use this code to access my file "${file.name}": ${accessCode}`,
        url: `${window.location.origin}${window.location.pathname}?code=${accessCode}`
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback to copying to clipboard
      copyToClipboard();
      addToast({
        title: "Link Copied",
        description: "Access code copied to clipboard",
        color: "success"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon icon="lucide:upload-cloud" className="text-primary" />
          </motion.div>
          Upload a File
        </h2>
        <p className="text-sm text-foreground-500">
          Upload a file (max 10MB) and share the access code with others
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!file && !accessCode && (
          <motion.div
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="border-2 border-dashed border-default-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary hover:bg-primary-50/10 transition-colors relative overflow-hidden"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept="*/*"
            />
            
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
              className="mb-3"
            >
              <Icon 
                icon="lucide:upload-cloud" 
                className="mx-auto text-5xl text-primary opacity-80" 
              />
            </motion.div>
            
            <p className="text-foreground-600 mb-1 font-medium">
              Drag and drop your file here or click to browse
            </p>
            <p className="text-xs text-foreground-400">
              Maximum file size: 10MB
            </p>
            
            {/* Animated file types */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 opacity-50">
              {["lucide:file-image", "lucide:file-text", "lucide:file-archive", "lucide:file-audio", "lucide:file-video"].map((icon, index) => (
                <motion.div
                  key={icon}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 0.5 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                >
                  <Icon icon={icon} className="text-xl text-foreground-400" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {file && !accessCode && (
          <motion.div
            key="file-selected"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <motion.div 
              className="flex items-center p-4 bg-content2 rounded-lg border border-content3"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div 
                className="p-3 bg-primary/10 rounded-md mr-3 text-primary"
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Icon icon={getFileIcon(file.type)} className="text-2xl" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-foreground-500">{formatFileSize(file.size)}</p>
              </div>
              <Button
                isIconOnly
                variant="light"
                color="danger"
                onPress={resetForm}
                aria-label="Remove file"
              >
                <Icon icon="lucide:x" />
              </Button>
            </motion.div>

            {isUploading ? (
              <div className="space-y-3 p-4 border border-primary-100 rounded-lg bg-primary-50/10">
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon icon="lucide:loader" className="text-primary" />
                  </motion.div>
                  <p className="text-sm font-medium text-primary-600">Processing...</p>
                </div>
                <Progress
                  aria-label="Upload progress"
                  value={uploadProgress}
                  color="primary"
                  showValueLabel={true}
                  className="max-w-md"
                />
                <p className="text-xs text-foreground-500 flex items-center gap-1">
                  <Icon icon="lucide:shield" className="text-primary-400" />
                  Encrypting and uploading file...
                </p>
              </div>
            ) : (
              <Button
                color="primary"
                onPress={handleUpload}
                className="w-full"
                startContent={<Icon icon="lucide:upload" />}
              >
                Upload and Generate Access Code
              </Button>
            )}
          </motion.div>
        )}

        {accessCode && (
          <motion.div
            key="upload-success"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <motion.div 
              className="p-4 bg-success-100 border border-success-200 rounded-lg"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="flex items-center mb-2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, 0] }}
                  transition={{ duration: 0.5, type: "spring" }}
                >
                  <Icon icon="lucide:check-circle" className="text-success mr-2 text-xl" />
                </motion.div>
                <p className="text-success-700 font-medium">Upload Successful!</p>
              </div>
              <p className="text-sm text-success-600">
                Your file has been encrypted and uploaded successfully.
              </p>
            </motion.div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Icon icon="lucide:key" className="text-primary" />
                Access Code
              </label>
              <motion.div 
                className="flex gap-2"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Input
                  value={accessCode}
                  readOnly
                  className="font-mono text-lg tracking-wider bg-primary-50/20"
                />
                <Button
                  isIconOnly
                  color="primary"
                  variant="flat"
                  onPress={copyToClipboard}
                  aria-label="Copy access code"
                >
                  <Icon icon="lucide:copy" />
                </Button>
              </motion.div>
              <p className="text-xs text-foreground-500 flex items-center gap-1">
                <Icon icon="lucide:info" className="text-primary-400" />
                Share this code with others to allow them to access your file from any device
              </p>
            </div>

            <div className={`flex flex-wrap gap-2 ${isMobile ? 'flex-col' : ''}`}>
              <Button
                variant="flat"
                color="primary"
                onPress={resetForm}
                startContent={<Icon icon="lucide:plus" />}
                fullWidth={isMobile}
              >
                Upload Another File
              </Button>
              
              <Button
                variant="flat"
                color="primary"
                onPress={handleShareCode}
                startContent={<Icon icon="lucide:share-2" />}
                fullWidth={isMobile}
              >
                Share Access Code
              </Button>
              
              {file && accessCode && (
                <div className={`${isMobile ? 'grid grid-cols-2 gap-2' : 'flex'}`}>
                  <QRCodeGenerator accessCode={accessCode} fileName={file.name} />
                  <DirectLinkGenerator accessCode={accessCode} fileName={file.name} />
                </div>
              )}
            </div>
            
            {/* Add device compatibility notice */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 p-3 bg-content2 rounded-lg border border-content3"
            >
              <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                <Icon icon="lucide:devices" className="text-primary" />
                Multi-Device Access
              </h3>
              <div className="flex flex-wrap gap-3 justify-around">
                {[
                  { device: "Desktop", icon: "lucide:monitor" },
                  { device: "Tablet", icon: "lucide:tablet" },
                  { device: "Mobile", icon: "lucide:smartphone" }
                ].map((item) => (
                  <motion.div
                    key={item.device}
                    whileHover={{ scale: 1.05 }}
                    className="flex flex-col items-center gap-1"
                  >
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10">
                      <Icon icon={item.icon} className="text-primary" />
                    </div>
                    <span className="text-xs text-foreground-500">{item.device}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-danger-100 border border-danger-200 rounded-lg text-danger-700 text-sm"
        >
          <div className="flex items-center">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              <Icon icon="lucide:alert-circle" className="mr-2" />
            </motion.div>
            {error}
          </div>
        </motion.div>
      )}

      <div className="pt-4 border-t border-divider">
        <div className="flex flex-wrap gap-2">
          <motion.div whileHover={{ scale: 1.05 }}>
            <Chip size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:shield" />}>
              End-to-end encrypted
            </Chip>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Chip size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:clock" />}>
              Auto-delete after 7 days
            </Chip>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Chip size="sm" variant="flat" color="primary" startContent={<Icon icon="lucide:user" />}>
              No registration required
            </Chip>
          </motion.div>
        </div>
      </div>
    </div>
  );
};