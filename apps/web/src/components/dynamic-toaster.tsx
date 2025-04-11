"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

export function DynamicToaster() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const htmlClasses = document.documentElement.classList;
    setTheme(htmlClasses.contains("dark") ? "dark" : "light");

    // Optional: Listen for theme changes if you allow toggling at runtime
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return <Toaster theme={theme} />;
}
