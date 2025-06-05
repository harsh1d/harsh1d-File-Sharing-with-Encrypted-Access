import React from "react";
import { useMediaQuery } from "../hooks/use-media-query";

type MobileContextType = {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
};

const MobileContext = React.createContext<MobileContextType>({
  isMobile: false,
  isTablet: false,
  isDesktop: true
});

export const MobileProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  return (
    <MobileContext.Provider value={{ isMobile, isTablet, isDesktop }}>
      {children}
    </MobileContext.Provider>
  );
};

export const useMobileDetection = () => {
  return React.useContext(MobileContext);
};