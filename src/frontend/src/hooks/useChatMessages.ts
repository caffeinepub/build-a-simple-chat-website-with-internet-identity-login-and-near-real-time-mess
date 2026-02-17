import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ChatMessage } from '../backend';

const MESSAGES_QUERY_KEY = ['chat', 'messages'];
const POLL_INTERVAL = 3000; // 3 seconds
const POLL_INTERVAL_HIDDEN = 10000; // 10 seconds when tab is hidden

export function useChatMessages() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<ChatMessage[]>({
    queryKey: MESSAGES_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      // Fetch last 100 messages, offset 0
      const messages = await actor.getMessages(BigInt(100), BigInt(0));
      // Sort by timestamp ascending (oldest first)
      return messages.sort((a, b) => {
        const aTime = Number(a.timestamp);
        const bTime = Number(b.timestamp);
        return aTime - bTime;
      });
    },
    enabled: !!actor && !isActorFetching,
    refetchInterval: (query) => {
      // Reduce polling when document is hidden
      if (typeof document !== 'undefined' && document.hidden) {
        return POLL_INTERVAL_HIDDEN;
      }
      return POLL_INTERVAL;
    },
    refetchIntervalInBackground: false,
    staleTime: 1000, // Consider data stale after 1 second
  });
}

