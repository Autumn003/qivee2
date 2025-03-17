"use client";

import { useState, useEffect } from "react";
import "remixicon/fonts/remixicon.css";

export default function ThemeToggler() {
  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  });

  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDark((prev) => !prev);
  };

  return (
    <>
      <button
        className=" h-8 w-8 cursor-pointer rounded-xl "
        onClick={toggleTheme}
      >
        <div className="text-secondary-foreground hover:text-primary-foreground transition-all duration-200 ease-in-out hover:-rotate-20">
          {isDark ? (
            <i className="ri-sun-fill text-xl"></i>
          ) : (
            <i className="ri-moon-clear-fill text-xl"></i>
          )}
        </div>
      </button>
    </>
  );
}
