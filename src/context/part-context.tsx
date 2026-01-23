"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Part } from "@/lib/types";
import { getParts } from "@/lib/actions";
import { Car } from "lucide-react";

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
    async function fetchInitialParts() {
      setLoading(true);
      const initialParts = await getParts();
      setParts(initialParts);
      setLoading(false);
    }
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

  if (loading) {
      return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center gap-4">
          <Car className="h-24 w-24 text-primary animate-pulse" />
          <p className="text-lg text-muted-foreground animate-pulse">Starting the engine...</p>
        </div>
      );
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
