import React from "react";

export const useSearchParams = () => {
  const getParam = React.useCallback((name: string): string | null => {
    if (typeof window === "undefined") return null;
    
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }, []);

  const setParam = React.useCallback((name: string, value: string) => {
    if (typeof window === "undefined") return;
    
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    window.history.pushState({}, "", url);
  }, []);

  const removeParam = React.useCallback((name: string) => {
    if (typeof window === "undefined") return;
    
    const url = new URL(window.location.href);
    url.searchParams.delete(name);
    window.history.pushState({}, "", url);
  }, []);

  return { getParam, setParam, removeParam };
};