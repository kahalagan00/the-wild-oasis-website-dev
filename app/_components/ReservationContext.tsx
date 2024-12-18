"use client";

import { createContext, useContext, useState } from "react";

type Range = {
  from: Date | undefined;
  to: Date | undefined;
};

interface ReservationContextType {
  range: Range;
  setRange: (range: Range) => void;
  resetRange: () => void;
}

const ReservationContext = createContext<ReservationContextType | undefined>(
  undefined
);

const initialState: Range = { from: undefined, to: undefined };

const ReservationProvider = ({ children }: { children: React.ReactNode }) => {
  const [range, setRange] = useState<Range>(initialState);
  const resetRange = () => setRange(initialState);

  return (
    <ReservationContext.Provider value={{ range, setRange, resetRange }}>
      {children}
    </ReservationContext.Provider>
  );
};

const useReservation = () => {
  const context = useContext(ReservationContext);
  if (context === undefined) {
    throw new Error("Context was used outside provider");
  }

  return context;
};

export { ReservationProvider, useReservation };
