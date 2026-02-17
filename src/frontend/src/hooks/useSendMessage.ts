import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface SendMessageParams {
  content: string;
  displayName?: string;
}

export function useSendMessage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content, displayName }: SendMessageParams) => {
      if (!actor) {
        throw new Error('Not connected to backend');
      }
      await actor.sendMessage(displayName || null, content);
    },
    onSuccess: () => {
      // Invalidate and refetch messages after successful send
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages'] });
    },
  });
}

