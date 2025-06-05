import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Input } from "@heroui/react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";
import { useMobileDetection } from "./mobile-device-detection";

type DirectLinkGeneratorProps = {
  accessCode: string;
  fileName: string;
};

export const DirectLinkGenerator: React.FC<DirectLinkGeneratorProps> = ({ accessCode, fileName }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { isMobile } = useMobileDetection();
  const [directLink, setDirectLink] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (isOpen && accessCode) {
      // Generate a URL that would work for accessing the file
      const baseUrl = window.location.origin + window.location.pathname;
      const accessUrl = `${baseUrl}?code=${accessCode}`;
      setDirectLink(accessUrl);
    }
  }, [isOpen, accessCode]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(directLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button 
        variant="flat" 
        color="primary" 
        onPress={onOpen}
        startContent={<Icon icon="lucide:link" />}
        className="mt-2"
      >
        Generate Direct Link
      </Button>
      
      <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        size={isMobile ? "full" : "md"}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:link" className="text-primary" />
                  Direct Link for {fileName}
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-4">
                  <p className="text-sm">
                    Share this link with anyone to give them direct access to your file. 
                    They can open it on any device without manually entering the access code.
                  </p>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Direct Access Link</label>
                    <div className="flex gap-2">
                      <Input
                        value={directLink}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        isIconOnly
                        color={copied ? "success" : "primary"}
                        variant="flat"
                        onPress={copyToClipboard}
                        aria-label="Copy direct link"
                      >
                        <Icon icon={copied ? "lucide:check" : "lucide:copy"} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-content2 p-4 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">How to use:</h3>
                    <ol className="space-y-2 text-sm text-foreground-500">
                      <motion.li 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-start gap-2"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">1</span>
                        <span>Copy the link above</span>
                      </motion.li>
                      <motion.li 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-start gap-2"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">2</span>
                        <span>Share it via email, messaging apps, or social media</span>
                      </motion.li>
                      <motion.li 
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-start gap-2"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary shrink-0 mt-0.5">3</span>
                        <span>Recipients can click the link to access the file directly</span>
                      </motion.li>
                    </ol>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button 
                  color="primary" 
                  onPress={copyToClipboard}
                  startContent={<Icon icon={copied ? "lucide:check" : "lucide:copy"} />}
                >
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};