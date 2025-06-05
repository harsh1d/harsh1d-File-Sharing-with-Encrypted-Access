import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useMobileDetection } from "./mobile-device-detection";

export const DeviceSyncNotice = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [hasSeenNotice, setHasSeenNotice] = React.useState(false);
  const { isMobile } = useMobileDetection();

  React.useEffect(() => {
    // Check if user has seen the notice before
    const seenNotice = localStorage.getItem("seenDeviceSyncNotice");
    if (!seenNotice) {
      // Show notice after a short delay
      const timer = setTimeout(() => {
        onOpen();
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setHasSeenNotice(true);
    }
  }, [onOpen]);

  const handleDismiss = () => {
    localStorage.setItem("seenDeviceSyncNotice", "true");
    setHasSeenNotice(true);
    onClose();
  };

  if (hasSeenNotice) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onOpenChange={onOpenChange} 
      placement="center"
      size={isMobile ? "full" : "md"}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:smartphone" className="text-primary" />
                Multi-Device Access
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <p>
                  SecureShare now works seamlessly across all your devices! Access your files from anywhere using the same access code.
                </p>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Desktop", icon: "lucide:monitor" },
                    { name: "Tablet", icon: "lucide:tablet" },
                    { name: "Mobile", icon: "lucide:smartphone" },
                  ].map((device) => (
                    <motion.div
                      key={device.name}
                      whileHover={{ scale: 1.05 }}
                      className="flex flex-col items-center gap-2 p-3 bg-content2 rounded-md"
                    >
                      <Icon icon={device.icon} className="text-2xl text-primary" />
                      <span className="text-sm">{device.name}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Easy ways to access files:</h3>
                  <ul className="space-y-2">
                    {[
                      { icon: "lucide:qr-code", text: "Scan QR code from another device" },
                      { icon: "lucide:link", text: "Use direct link with access code" },
                      { icon: "lucide:key", text: "Enter 6-digit access code manually" }
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary">
                          <Icon icon={item.icon} className="text-sm" />
                        </div>
                        <span>{item.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-primary-50/20 p-3 rounded-md border border-primary-100">
                  <p className="text-sm flex items-start gap-2">
                    <Icon icon="lucide:info" className="text-primary mt-0.5" />
                    <span>
                      Your files are securely encrypted and can be accessed from any device using the same access code.
                    </span>
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={handleDismiss} fullWidth={isMobile}>
                Got it!
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};