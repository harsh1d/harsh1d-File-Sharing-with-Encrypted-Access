import React from "react";
import { Button, Input, Spinner } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion, AnimatePresence } from "framer-motion";
import { useFileStorage, StoredFile } from "./file-storage-context";
import { addToast } from "@heroui/react";
import { useMobileDetection } from "./mobile-device-detection";

type AccessFileSectionProps = {
  initialAccessCode?: string | null;
};

export const AccessFileSection = ({ initialAccessCode = null }: AccessFileSectionProps) => {
  const [accessCode, setAccessCode] = React.useState(initialAccessCode || "");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [fileDetails, setFileDetails] = React.useState<StoredFile | null>(null);
  
  const { getFile } = useFileStorage();
  const { isMobile } = useMobileDetection();

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

  const handleAccessCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccessCode(e.target.value.toUpperCase());
    setError(null);
  };

  const handleAccessFile = () => {
    if (!accessCode || accessCode.length !== 6) {
      setError("Please enter a valid 6-character access code");
      return;
    }

    setIsLoading(true);
    setError(null);

    // Small delay to simulate network request
    setTimeout(() => {
      const storedFile = getFile(accessCode);
      
      if (storedFile) {
        setFileDetails(storedFile);
      } else {
        setError("Invalid access code or file has expired");
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handleDeviceSpecificDownload = () => {
    if (!fileDetails) return;
    
    setIsLoading(true);
    
    // Create a download link for the file with device-specific handling
    setTimeout(() => {
      const url = URL.createObjectURL(fileDetails.file);
      
      // Different handling based on device type
      if (isMobile) {
        // For mobile, we might want to open in a new tab instead of direct download
        window.open(url, '_blank');
      } else {
        // For desktop, use the standard download approach
        const a = document.createElement("a");
        a.href = url;
        a.download = fileDetails.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      
      URL.revokeObjectURL(url);
      
      setIsLoading(false);
      addToast({
        title: "Download Started",
        description: `${fileDetails.name} is being ${isMobile ? "opened" : "downloaded"} on your ${isMobile ? "mobile device" : "computer"}.`,
        color: "success"
      });
    }, 800);
  };

  const handleDownload = () => {
    if (!fileDetails) return;
    
    setIsLoading(true);
    
    // Create a download link for the file
    setTimeout(() => {
      const url = URL.createObjectURL(fileDetails.file);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileDetails.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsLoading(false);
      addToast({
        title: "Download Started",
        description: `${fileDetails.name} is being downloaded to your device.`,
        color: "success"
      });
    }, 800);
  };

  const resetForm = () => {
    setAccessCode("");
    setFileDetails(null);
    setError(null);
  };

  React.useEffect(() => {
    if (initialAccessCode && initialAccessCode.length === 6) {
      handleAccessFile();
    }
  }, [initialAccessCode]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-medium flex items-center gap-2">
          <motion.div
            animate={{ rotate: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon icon="lucide:download-cloud" className="text-primary" />
          </motion.div>
          Access a Shared File
        </h2>
        <p className="text-sm text-foreground-500">
          Enter the 6-character access code to download a shared file
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!fileDetails && (
          <motion.div
            key="access-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <motion.div 
              className="p-4 border border-primary-100 rounded-lg bg-primary-50/10"
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 3 }}
                  >
                    <Icon icon="lucide:key" className="text-primary" />
                  </motion.div>
                  <label htmlFor="accessCode" className="text-sm font-medium">
                    Access Code
                  </label>
                </div>
                <Input
                  id="accessCode"
                  value={accessCode}
                  onChange={handleAccessCodeChange}
                  placeholder="Enter 6-character code"
                  maxLength={6}
                  className="font-mono text-lg tracking-wider"
                  autoComplete="off"
                  startContent={<Icon icon="lucide:key" className="text-default-400" />}
                  size="lg"
                />
              </div>
            </motion.div>

            <Button
              color="primary"
              onPress={handleAccessFile}
              isLoading={isLoading}
              className="w-full"
              startContent={!isLoading && <Icon icon="lucide:unlock" />}
              size="lg"
            >
              Access File
            </Button>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-3 bg-content2 rounded-lg border border-content3"
            >
              <p className="text-xs text-foreground-500 flex items-center gap-2">
                <Icon icon="lucide:smartphone" className="text-primary" />
                <span>
                  {isMobile 
                    ? "We've detected you're on a mobile device. Files will open in your browser for easy viewing."
                    : "We've detected you're on a desktop. Files will download directly to your computer."}
                </span>
              </p>
            </motion.div>

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
          </motion.div>
        )}

        {fileDetails && (
          <motion.div
            key="file-details"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <motion.div 
              className="p-4 bg-primary-100 border border-primary-200 rounded-lg"
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
                  <Icon icon="lucide:file-check" className="text-primary mr-2 text-xl" />
                </motion.div>
                <p className="text-primary-700 font-medium">File Found!</p>
              </div>
              <p className="text-sm text-primary-600">
                The file has been located and is ready for download.
              </p>
            </motion.div>

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
                <Icon icon={getFileIcon(fileDetails.type)} className="text-2xl" />
              </motion.div>
              <div className="flex-1">
                <p className="text-sm font-medium">{fileDetails.name}</p>
                <p className="text-xs text-foreground-500">
                  {(fileDetails.size / (1024 * 1024)).toFixed(2)} MB • Uploaded {new Date(fileDetails.uploadDate).toLocaleDateString()}
                </p>
              </div>
            </motion.div>

            <div className="flex gap-2">
              <Button
                color="primary"
                className="flex-1"
                onPress={handleDeviceSpecificDownload}
                isLoading={isLoading}
                startContent={!isLoading && (
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
                  >
                    <Icon icon={isMobile ? "lucide:external-link" : "lucide:download"} />
                  </motion.div>
                )}
                size="lg"
              >
                {isMobile ? "Open File" : "Download File"}
              </Button>
              <Button
                variant="flat"
                onPress={resetForm}
                isIconOnly
                aria-label="Reset form"
              >
                <Icon icon="lucide:refresh-cw" />
              </Button>
            </div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="p-3 bg-primary-50/10 rounded-lg border border-primary-100"
            >
              <p className="text-xs text-foreground-600 flex items-start gap-2">
                <Icon icon="lucide:info" className="text-primary mt-1" />
                <span>
                  This file can be accessed from any device using the same access code. 
                  {isMobile 
                    ? " On mobile devices, some file types will open in your browser instead of downloading."
                    : " On desktop computers, files will download directly to your downloads folder."}
                </span>
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pt-4 border-t border-divider">
        <div className="space-y-3">
          <p className="text-sm font-medium flex items-center gap-2">
            <Icon icon="lucide:info" className="text-primary" />
            How it works:
          </p>
          <ol className="text-xs text-foreground-500 space-y-2">
            {[
              { icon: "lucide:key", text: "Enter the 6-character access code provided by the file owner" },
              { icon: "lucide:shield", text: "The system will locate and decrypt the file" },
              { icon: "lucide:download", text: "Download the file to your device" },
              { icon: "lucide:trash", text: "Files are automatically deleted after 7 days for security" }
            ].map((item, index) => (
              <motion.li 
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary">
                  <Icon icon={item.icon} className="text-xs" />
                </div>
                <span>{item.text}</span>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};