"use client";

import { createContext, useContext } from 'react';
import { DEFAULT_MISC_CONTENT, type MiscContent } from './misc-content';

const MiscContentContext = createContext<MiscContent>(DEFAULT_MISC_CONTENT);

export function MiscContentProvider({ value, children }: { value: MiscContent; children: React.ReactNode }) {
  return <MiscContentContext.Provider value={value}>{children}</MiscContentContext.Provider>;
}

export function useMiscContent(): MiscContent {
  return useContext(MiscContentContext);
}
