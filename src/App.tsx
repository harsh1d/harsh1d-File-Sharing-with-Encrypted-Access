import React from "react";
import { Tabs, Tab, Card } from "@heroui/react";
import { UploadFileSection } from "./components/upload-file-section";
import { AccessFileSection } from "./components/access-file-section";
import { FileStorageProvider } from "./components/file-storage-context";
import { ThemeSwitcher } from "./components/theme-switcher";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import { BrowserCompatibilityBanner } from "./components/browser-compatibility";
import { CrossBrowserNotice } from "./components/cross-browser-notice";
import { useSearchParams } from "./hooks/use-search-params";
import { MobileProvider } from "./components/mobile-device-detection";
import { DeviceSyncNotice } from "./components/device-sync-notice";

export default function App() {
  const { getParam } = useSearchParams();
  const [initialAccessCode, setInitialAccessCode] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<string>("upload");

  // Check URL for access code parameter
  React.useEffect(() => {
    const codeParam = getParam("code");
    if (codeParam) {
      setInitialAccessCode(codeParam);
      setActiveTab("access");
    }
  }, [getParam]);

  return (
    <MobileProvider>
      <FileStorageProvider>
        <div className="min-h-screen bg-gradient-to-b from-background to-content2 flex flex-col">
          <BrowserCompatibilityBanner />
          <CrossBrowserNotice />
          <DeviceSyncNotice />
          
          <header className="w-full py-4 px-6 border-b border-divider backdrop-blur-md bg-background/80 sticky top-0 z-10">
            <div className="max-w-5xl mx-auto w-full flex justify-between items-center">
              <div className="flex items-center gap-2">
                <motion.div
                  initial={{ rotate: -10 }}
                  animate={{ rotate: 10 }}
                  transition={{ 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    duration: 2,
                    ease: "easeInOut" 
                  }}
                >
                  <Icon icon="lucide:shield-check" className="text-primary text-2xl" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-semibold text-foreground">SecureShare</h1>
                  <p className="text-foreground-500 text-sm">Secure file sharing with access codes</p>
                </div>
              </div>
              <ThemeSwitcher />
            </div>
          </header>
          
          <main className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <motion.div 
              className="absolute top-20 right-20 text-primary/5 pointer-events-none"
              initial={{ scale: 0.8, rotate: 0 }}
              animate={{ scale: 1.2, rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Icon icon="lucide:shield" className="text-[400px]" />
            </motion.div>
            
            <motion.div 
              className="absolute bottom-20 left-20 text-primary/5 pointer-events-none"
              initial={{ scale: 0.8, rotate: 0 }}
              animate={{ scale: 1.2, rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            >
              <Icon icon="lucide:lock" className="text-[300px]" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="w-full max-w-xl z-10"
            >
              <Card className="backdrop-blur-lg bg-content1/90 border border-content2 shadow-xl overflow-hidden">
                <Tabs 
                  aria-label="File sharing options" 
                  className="w-full"
                  variant="underlined"
                  color="primary"
                  selectedKey={activeTab}
                  onSelectionChange={(key) => setActiveTab(key as string)}
                >
                  <Tab key="upload" title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:upload-cloud" />
                      <span>Upload File</span>
                    </div>
                  }>
                    <div className="p-6">
                      <UploadFileSection />
                    </div>
                  </Tab>
                  <Tab key="access" title={
                    <div className="flex items-center gap-2">
                      <Icon icon="lucide:download-cloud" />
                      <span>Access File</span>
                    </div>
                  }>
                    <div className="p-6">
                      <AccessFileSection initialAccessCode={initialAccessCode} />
                    </div>
                  </Tab>
                </Tabs>
              </Card>
            </motion.div>
          </main>
          
          <footer className="w-full py-4 px-6 border-t border-divider backdrop-blur-md bg-background/80">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <div className="text-sm text-foreground-500">
                SecureShare &copy; {new Date().getFullYear()}
              </div>
              <div className="flex items-center gap-4">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-1 text-sm text-foreground-500"
                >
                  <Icon icon="lucide:shield" className="text-primary" />
                  <span>End-to-end encrypted</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-1 text-sm text-foreground-500"
                >
                  <Icon icon="lucide:clock" className="text-primary" />
                  <span>7-day auto-delete</span>
                </motion.div>
              </div>
            </div>
          </footer>
        </div>
      </FileStorageProvider>
    </MobileProvider>
  );
}