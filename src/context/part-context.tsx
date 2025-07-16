
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Part } from "@/lib/types";
import { getParts } from "@/lib/actions";

interface PartContextType {
  parts: Part[];
  addPart: (part: Part) => void;
  updatePartState: (partId: string, updatedPart: Part) => void;
  togglePartVisibility: (partId: string) => void;
}

const PartContext = createContext<PartContextType | undefined>(undefined);

export function PartProvider({ children }: { children: ReactNode }) {
  const [parts, setParts] = useState<Part[]>([]);

  useEffect(() => {
    const fetchParts = async () => {
        const initialParts = await getParts();
        setParts(initialParts);
    }
    fetchParts();
  }, [])

  const addPart = (part: Part) => {
    setParts((prevParts) => [{...part, isVisibleForSale: true}, ...prevParts]);
  };
  
  const updatePartState = (partId: string, updatedPartData: Part) => {
    setParts((prevParts) => 
      prevParts.map((part) => (part.id === partId ? updatedPartData : part))
    );
  };
  
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
    <PartContext.Provider value={{ parts, addPart, updatePartState, togglePartVisibility }}>
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
