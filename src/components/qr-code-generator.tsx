import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react";

type QRCodeGeneratorProps = {
  accessCode: string;
  fileName: string;
};

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ accessCode, fileName }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [qrUrl, setQrUrl] = React.useState("");

  React.useEffect(() => {
    if (isOpen && accessCode) {
      // Generate a URL that would work for accessing the file
      const baseUrl = window.location.origin + window.location.pathname;
      const accessUrl = `${baseUrl}?code=${accessCode}`;
      
      // Generate QR code using an API
      const encodedUrl = encodeURIComponent(accessUrl);
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`;
      
      setQrUrl(qrCodeApiUrl);
    }
  }, [isOpen, accessCode]);

  return (
    <>
      <Button 
        variant="flat" 
        color="primary" 
        onPress={onOpen}
        startContent={<Icon icon="lucide:qr-code" />}
        className="mt-2"
      >
        Generate QR Code
      </Button>
      
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Icon icon="lucide:qr-code" className="text-primary" />
                  QR Code for {fileName}
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-lg">
                    {qrUrl ? (
                      <img 
                        src={qrUrl} 
                        alt="QR Code for file access" 
                        className="w-48 h-48"
                      />
                    ) : (
                      <div className="w-48 h-48 flex items-center justify-center">
                        <Icon icon="lucide:loader" className="text-primary animate-spin text-2xl" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center space-y-2">
                    <p className="font-medium">Access Code: {accessCode}</p>
                    <p className="text-sm text-foreground-500">
                      Scan this QR code to access the file from any device
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};