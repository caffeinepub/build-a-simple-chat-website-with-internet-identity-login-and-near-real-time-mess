import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Question } from '../backend';

const QUESTIONS_QUERY_KEY = ['questions'];

export function useGetQuestions() {
  const { actor, isFetching: isActorFetching } = useActor();

  return useQuery<Question[]>({
    queryKey: QUESTIONS_QUERY_KEY,
    queryFn: async () => {
      if (!actor) return [];
      // Fetch last 100 questions, offset 0
      const questions = await actor.getQuestions(BigInt(100), BigInt(0));
      // Sort by created timestamp descending (newest first)
      return questions.sort((a, b) => {
        const aTime = Number(a.created);
        const bTime = Number(b.created);
        return bTime - aTime;
      });
    },
    enabled: !!actor && !isActorFetching,
  });
}
