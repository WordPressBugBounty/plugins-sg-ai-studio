import React from 'react';
import { ScrollContextValue } from './types';
import { ScrollableContext } from './context';

/**
 * Provider component for the scrollable context
 */
export const ScrollableProvider: React.FC<{
  children: React.ReactNode;
  value: ScrollContextValue;
}> = ({ children, value }) => {
  return <ScrollableContext.Provider value={value}>{children}</ScrollableContext.Provider>;
};