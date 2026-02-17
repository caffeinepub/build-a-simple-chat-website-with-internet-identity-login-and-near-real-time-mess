import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

interface CreateQuestionParams {
  content: string;
}

export function useCreateQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ content }: CreateQuestionParams) => {
      if (!actor) {
        throw new Error('Not connected to backend');
      }
      await actor.createQuestion(null, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}
