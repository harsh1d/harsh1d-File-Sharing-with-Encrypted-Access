import React from "react";
import { Icon } from "@iconify/react";
import { motion } from "framer-motion";

export const BrowserCompatibilityBanner = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [browserInfo, setBrowserInfo] = React.useState<{
    name: string;
    version: string;
    icon: string;
  }>({ name: "Unknown", version: "", icon: "lucide:globe" });

  React.useEffect(() => {
    // Detect browser
    const userAgent = navigator.userAgent;
    let browserName = "Unknown";
    let browserVersion = "";
    let browserIcon = "lucide:globe";

    if (userAgent.indexOf("Firefox") > -1) {
      browserName = "Firefox";
      browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1] || "";
      browserIcon = "logos:firefox";
    } else if (userAgent.indexOf("Edg") > -1) {
      browserName = "Edge";
      browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1] || "";
      browserIcon = "logos:microsoft-edge";
    } else if (userAgent.indexOf("Chrome") > -1) {
      browserName = "Chrome";
      browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1] || "";
      browserIcon = "logos:chrome";
    } else if (userAgent.indexOf("Safari") > -1) {
      browserName = "Safari";
      browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1] || "";
      browserIcon = "logos:safari";
    } else if (userAgent.indexOf("Opera") > -1 || userAgent.indexOf("OPR") > -1) {
      browserName = "Opera";
      browserVersion = userAgent.match(/OPR\/([0-9.]+)/)?.[1] || "";
      browserIcon = "logos:opera";
    }

    setBrowserInfo({ name: browserName, version: browserVersion, icon: browserIcon });

    // Check for potential compatibility issues
    const hasLocalStorage = !!window.localStorage;
    const hasFileReader = !!window.FileReader;
    const hasCreateObjectURL = !!window.URL && !!window.URL.createObjectURL;
    
    // Show banner if any critical feature is missing
    setIsVisible(!hasLocalStorage || !hasFileReader || !hasCreateObjectURL);
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-warning-100 border-b border-warning-200 py-2 px-4"
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="lucide:alert-triangle" className="text-warning-600" />
          <span className="text-sm text-warning-700">
            Some features may not work optimally in {browserInfo.name} {browserInfo.version}.
            For the best experience, use a modern browser.
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Icon icon={browserInfo.icon} className="text-xl" />
        </div>
      </div>
    </motion.div>
  );
};