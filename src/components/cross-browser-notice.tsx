import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const CrossBrowserNotice = () => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [hasSeenNotice, setHasSeenNotice] = React.useState(false);

  React.useEffect(() => {
    // Check if user has seen the notice before
    const seenNotice = localStorage.getItem("seenCrossBrowserNotice");
    if (!seenNotice) {
      // Show notice after a short delay
      const timer = setTimeout(() => {
        onOpen();
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setHasSeenNotice(true);
    }
  }, [onOpen]);

  const handleDismiss = () => {
    localStorage.setItem("seenCrossBrowserNotice", "true");
    setHasSeenNotice(true);
    onClose();
  };

  if (hasSeenNotice) return null;

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Icon icon="lucide:globe" className="text-primary" />
                Cross-Browser File Sharing
              </div>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-4">
                <p>
                  SecureShare now works across different browsers and devices! Share your files securely with anyone by simply sharing the access code.
                </p>
                
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: "Chrome", icon: "logos:chrome" },
                    { name: "Firefox", icon: "logos:firefox" },
                    { name: "Safari", icon: "logos:safari" },
                    { name: "Edge", icon: "logos:microsoft-edge" }
                  ].map((browser) => (
                    <motion.div
                      key={browser.name}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 p-2 bg-content2 rounded-md"
                    >
                      <Icon icon={browser.icon} className="text-2xl" />
                      <span>{browser.name}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="bg-primary-50/20 p-3 rounded-md border border-primary-100">
                  <p className="text-sm flex items-start gap-2">
                    <Icon icon="lucide:info" className="text-primary mt-0.5" />
                    <span>
                      Files are stored locally in your browser. For best results, use the same browser session when sharing files.
                    </span>
                  </p>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onPress={handleDismiss}>
                Got it!
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};