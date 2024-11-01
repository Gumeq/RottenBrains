"use client";

// MobileVideoContext.tsx
import React, { createContext, useState } from "react";

interface MobileVideoContextProps {
  mobileVideoPlaying: boolean;
  setMobileVideoPlaying: (playing: boolean) => void;
}

export const MobileVideoContext = createContext<MobileVideoContextProps>({
  mobileVideoPlaying: false,
  setMobileVideoPlaying: () => {},
});

export const MobileVideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mobileVideoPlaying, setMobileVideoPlaying] = useState(false);

  return (
    <MobileVideoContext.Provider
      value={{ mobileVideoPlaying, setMobileVideoPlaying }}
    >
      {children}
    </MobileVideoContext.Provider>
  );
};
