import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { QuestionId } from '../backend';

interface AnswerQuestionParams {
  questionId: QuestionId;
  answer: string;
}

export function useAnswerQuestion() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ questionId, answer }: AnswerQuestionParams) => {
      if (!actor) {
        throw new Error('Not connected to backend');
      }
      await actor.answerQuestion(questionId, answer);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
  });
}
