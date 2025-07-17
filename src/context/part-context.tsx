
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Part } from "@/lib/types";
import { getParts } from "@/lib/actions";

interface PartContextType {
  parts: Part[];
  setParts: (parts: Part[]) => void;
  addPart: (part: Part) => void;
  updatePartInContext: (updatedPart: Part) => void;
}

const PartContext = createContext<PartContextType | undefined>(undefined);

export function PartProvider({ children }: { children: ReactNode }) {
  const [parts, setParts] = useState<Part[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitialParts = async () => {
      try {
        const initialParts = await getParts();
        setParts(initialParts);
      } catch (error) {
        console.error("Failed to fetch initial parts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialParts();
  }, []);

  const addPart = (part: Part) => {
    setParts((prevParts) => [part, ...prevParts]);
  };

  const updatePartInContext = (updatedPart: Part) => {
    setParts((prevParts) =>
      prevParts.map((part) => (part.id === updatedPart.id ? updatedPart : part))
    );
  };

  // While loading, you might want to show a spinner or nothing
  if (loading) {
      return null; 
  }

  return (
    <PartContext.Provider value={{ parts, setParts, addPart, updatePartInContext }}>
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
