"use client";

import React, { createContext, useContext, useState } from "react";
import { AmbienceMode } from "@/components/remotion/compositions/AmbientFoundryComposition";

interface AmbienceContextType {
  mode: AmbienceMode;
  setMode: (mode: AmbienceMode) => void;
  isCinemaOpen: boolean;
  setIsCinemaOpen: (open: boolean) => void;
}

const AmbienceContext = createContext<AmbienceContextType>({
  mode: "molten",
  setMode: () => {},
  isCinemaOpen: false,
  setIsCinemaOpen: () => {},
});

export const AmbienceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [mode, setMode] = useState<AmbienceMode>("molten");
  const [isCinemaOpen, setIsCinemaOpen] = useState(false);

  return (
    <AmbienceContext.Provider
      value={{ mode, setMode, isCinemaOpen, setIsCinemaOpen }}
    >
      {children}
    </AmbienceContext.Provider>
  );
};

export const useAmbience = () => useContext(AmbienceContext);
