
"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { Part } from "@/lib/types";
import { getParts } from "@/lib/actions";
import { Button } from "@/components/ui/button";

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
  const [error, setError] = useState<string | null>(null);

  const fetchInitialParts = async () => {
    setLoading(true);
    setError(null);
    try {
      // Directly get mock data from actions.
      const initialParts = await getParts();
      setParts(initialParts);
    } catch (error: any) {
      console.error("Failed to fetch initial parts:", error);
      setError("Could not load parts data. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
        </div>
      );
  }
  
  if (error) {
    return (
        <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center p-4 text-center">
            <h2 className="text-xl font-semibold text-destructive mb-4">Application Error</h2>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
    )
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
