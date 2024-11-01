"use client";

// MobileVideoContext.tsx
import React, { createContext, useState } from "react";

interface MobileVideoContextProps {
  mobileVideoPlaying: boolean;
  mobileVideoLoading: boolean;
  setMobileVideoPlaying: (playing: boolean) => void;
  setMobileVideoLoading: (playing: boolean) => void;
}

export const MobileVideoContext = createContext<MobileVideoContextProps>({
  mobileVideoPlaying: false,
  setMobileVideoPlaying: () => {},
  mobileVideoLoading: false,
  setMobileVideoLoading: () => {},
});

export const MobileVideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mobileVideoPlaying, setMobileVideoPlaying] = useState(false);
  const [mobileVideoLoading, setMobileVideoLoading] = useState(false);

  return (
    <MobileVideoContext.Provider
      value={{
        mobileVideoPlaying,
        setMobileVideoPlaying,
        mobileVideoLoading,
        setMobileVideoLoading,
      }}
    >
      {children}
    </MobileVideoContext.Provider>
  );
};
