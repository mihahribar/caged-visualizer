import { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { AppPage } from '../types/navigation';

/* eslint-disable react-refresh/only-export-components */

interface NavigationContextType {
  currentPage: AppPage;
  navigateTo: (page: AppPage) => void;
}

export const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [currentPage, setCurrentPage] = useState<AppPage>('visualizer');

  const navigateTo = (page: AppPage) => {
    setCurrentPage(page);
  };

  return (
    <NavigationContext.Provider value={{ currentPage, navigateTo }}>
      {children}
    </NavigationContext.Provider>
  );
}