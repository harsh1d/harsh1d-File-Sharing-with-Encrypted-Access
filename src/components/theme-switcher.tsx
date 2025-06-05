import React from 'react';
import { Icon } from '@iconify/react';
import { Switch, Tooltip } from '@heroui/react';
import { useTheme } from "@heroui/use-theme";
import { motion } from 'framer-motion';

export const ThemeSwitcher = () => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  
  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };
  
  return (
    <Tooltip 
      content={`Switch to ${isDark ? "light" : "dark"} mode`}
      placement="bottom"
    >
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ 
            opacity: !isDark ? 1 : 0.6,
            rotate: !isDark ? 0 : -30
          }}
          transition={{ duration: 0.3 }}
        >
          <Icon 
            icon="lucide:sun" 
            className={`text-xl ${!isDark ? "text-amber-500" : "text-default-500"}`} 
          />
        </motion.div>
        <Switch 
          isSelected={isDark}
          onValueChange={handleToggle}
          size="sm"
          color="primary"
          className="mx-1"
        />
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ 
            opacity: isDark ? 1 : 0.6,
            rotate: isDark ? 0 : 30
          }}
          transition={{ duration: 0.3 }}
        >
          <Icon 
            icon="lucide:moon" 
            className={`text-xl ${isDark ? "text-blue-400" : "text-default-500"}`} 
          />
        </motion.div>
      </div>
    </Tooltip>
  );
};