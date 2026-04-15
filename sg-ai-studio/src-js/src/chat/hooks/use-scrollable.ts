import { useContext } from 'react';
import { ScrollableContext } from '../components/scrollable-container/context';

/**
 * Hook to access the scrollable context
 */
export const useScrollable = () => useContext(ScrollableContext);