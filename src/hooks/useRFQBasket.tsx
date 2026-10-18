"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { RFQLineItem } from "@/types";

interface RFQContextType {
  items: RFQLineItem[];
  addItem: (item: Omit<RFQLineItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearBasket: () => void;
  isModalOpen: boolean;
  openRFQModal: () => void;
  closeRFQModal: () => void;
  totalItemsCount: number;
  totalEstimatedWeightKg: number;
}

const RFQContext = createContext<RFQContextType | undefined>(undefined);

const STORAGE_KEY = "steels_vision_rfq_basket_v1";

export function RFQProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<RFQLineItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not parse stored RFQ basket", e);
    }
    setIsInitialized(true);
  }, []);

  // Sync to local storage
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save RFQ basket to storage", e);
    }
  }, [items, isInitialized]);

  const addItem = (item: Omit<RFQLineItem, "id">) => {
    const newItem: RFQLineItem = {
      ...item,
      id: "rfq_" + Math.random().toString(36).substring(2, 9) + "_" + Date.now(),
    };
    setItems((prev) => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(1, qty) } : item))
    );
  };

  const clearBasket = () => {
    setItems([]);
  };

  const openRFQModal = () => setIsModalOpen(true);
  const closeRFQModal = () => setIsModalOpen(false);

  const totalItemsCount = items.reduce((acc, curr) => acc + (curr.quantity || 1), 0);
  const totalEstimatedWeightKg = items.reduce(
    (acc, curr) => acc + (curr.estimatedWeightKg ? curr.estimatedWeightKg * (curr.quantity || 1) : 0),
    0
  );

  return (
    <RFQContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearBasket,
        isModalOpen,
        openRFQModal,
        closeRFQModal,
        totalItemsCount,
        totalEstimatedWeightKg,
      }}
    >
      {children}
    </RFQContext.Provider>
  );
}

export function useRFQBasket() {
  const context = useContext(RFQContext);
  if (!context) {
    throw new Error("useRFQBasket must be used within an RFQProvider");
  }
  return context;
}
