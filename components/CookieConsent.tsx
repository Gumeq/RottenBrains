"use client";

import { useState, useEffect } from "react";

const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false); // Simply hide the popup without saving consent
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 z-50 flex w-full items-center justify-between border-t border-foreground/10 bg-background p-4 text-foreground">
      <span className="flex-1">
        We use cookies to improve your experience and collect your data for
        recommendations and other functionality. By accepting, you agree to our
        use of cookies and to our Terms of Service.
      </span>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleAccept}
          className="rounded bg-accent px-4 py-2 text-foreground"
        >
          Accept
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss cookie consent popup"
          className="text-foreground hover:text-foreground/50"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CookieConsent;
