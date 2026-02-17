import { useState, useCallback, useRef, useEffect } from 'react';

const SCROLL_THRESHOLD = 100; // pixels from bottom to consider "near bottom"

export function useScrollAnchor(messageCount: number) {
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const lastMessageCountRef = useRef(messageCount);

  useEffect(() => {
    // When new messages arrive, check if we should auto-scroll
    if (messageCount > lastMessageCountRef.current) {
      // New messages arrived, keep auto-scroll if we were already at bottom
      lastMessageCountRef.current = messageCount;
    }
  }, [messageCount]);

  const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
    const target = event.target as HTMLDivElement;
    const { scrollTop, scrollHeight, clientHeight } = target;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    
    // Update auto-scroll based on whether user is near bottom
    setShouldAutoScroll(distanceFromBottom < SCROLL_THRESHOLD);
  }, []);

  return {
    shouldAutoScroll,
    handleScroll,
  };
}

