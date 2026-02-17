import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetQuestions } from '../hooks/useQuestions';
import { useGetCallerUserProfile } from '../hooks/useCallerUserProfile';
import { QAComposer } from '../components/QAComposer';
import { QAItemCard } from '../components/QAItemCard';
import { ProfileSetupDialog } from '../components/ProfileSetupDialog';
import { Card } from '../components/ui/card';
import { Loader2, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export function MyQAPage() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { data: questions, isLoading: questionsLoading, error } = useGetQuestions();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  if (!isAuthenticated) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="p-8 text-center space-y-4 shadow-warm animate-fade-in max-w-md">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Nepali Q&A</h2>
            <p className="text-muted-foreground mb-4">
              Sign in to ask questions in Nepali and keep your private Q&A collection
            </p>
            <Button onClick={login} size="lg" className="gap-2">
              Sign in to get started
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (questionsLoading || profileLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading your Q&A...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6 text-destructive" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2">Unable to load questions</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <ProfileSetupDialog open={showProfileSetup} />
      
      <div className="flex-1 flex flex-col container mx-auto max-w-4xl p-4 gap-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">My Questions & Answers</h2>
          <p className="text-muted-foreground">
            Ask questions in Nepali using voice or text. Your Q&A is private to you.
          </p>
        </div>

        <QAComposer />

        <div className="flex-1 space-y-4">
          {questions && questions.length === 0 ? (
            <Card className="p-8 text-center space-y-2">
              <MessageCircle className="w-12 h-12 text-muted-foreground/50 mx-auto" />
              <h3 className="font-semibold text-lg">No questions yet</h3>
              <p className="text-sm text-muted-foreground">
                Type in Nepali or use the microphone to ask your first question
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {questions?.map((question) => (
                <QAItemCard key={question.id.toString()} question={question} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
