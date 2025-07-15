"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import type { Part } from "@/lib/types";

interface PartContextType {
  parts: Part[];
  addPart: (part: Part) => void;
  togglePartVisibility: (partId: string) => void;
}

const PartContext = createContext<PartContextType | undefined>(undefined);

// The provider now receives initial parts from the server.
export function PartProvider({ children, initialParts }: { children: ReactNode, initialParts: Part[] }) {
  const [parts, setParts] = useState<Part[]>(initialParts);

  // This will now be optimistic. In a real app, you'd revalidate the server data.
  const addPart = (part: Part) => {
    setParts((prevParts) => [{...part, isVisibleForSale: true}, ...prevParts]);
  };
  
  // This is also optimistic.
  const togglePartVisibility = (partId: string) => {
    setParts((prevParts) =>
      prevParts.map((part) =>
        part.id === partId
          ? { ...part, isVisibleForSale: !part.isVisibleForSale }
          : part
      )
    );
  };

  return (
    <PartContext.Provider value={{ parts, addPart, togglePartVisibility }}>
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
