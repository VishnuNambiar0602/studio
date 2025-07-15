"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Part } from "@/lib/types";
import { parts as initialParts } from "@/lib/data";

interface PartContextType {
  parts: Part[];
  addPart: (part: Part) => void;
}

const PartContext = createContext<PartContextType | undefined>(undefined);

export function PartProvider({ children }: { children: ReactNode }) {
  const [parts, setParts] = useState<Part[]>(initialParts);

  const addPart = (part: Part) => {
    setParts((prevParts) => [part, ...prevParts]);
  };

  return (
    <PartContext.Provider value={{ parts, addPart }}>
      {children}
    </PartContext.Provider>
  );
}

export function useParts() {
  const context = useContext(PartContext);
  if (context === undefined) {
    throw new Error("useParts must be used within a PartProvider");
  }
  return context;
}
