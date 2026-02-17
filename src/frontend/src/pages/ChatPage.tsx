import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { MessageFeed } from '../components/MessageFeed';
import { MessageComposer } from '../components/MessageComposer';
import { useChatMessages } from '../hooks/useChatMessages';
import { Card } from '../components/ui/card';
import { Loader2, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export function ChatPage() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { data: messages, isLoading, error } = useChatMessages();

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading messages...</p>
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
            <h3 className="font-semibold text-lg mb-2">Unable to load messages</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : 'An error occurred'}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col container mx-auto max-w-4xl p-4 gap-4">
      {!isAuthenticated && messages && messages.length === 0 && (
        <Card className="p-8 text-center space-y-4 shadow-warm animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Chat</h2>
            <p className="text-muted-foreground mb-4">
              Sign in to start chatting with others in real-time
            </p>
            <Button onClick={login} size="lg" className="gap-2">
              Sign in to chat
            </Button>
          </div>
        </Card>
      )}

      <div className="flex-1 flex flex-col min-h-0">
        <MessageFeed messages={messages || []} />
      </div>

      <MessageComposer />
    </div>
  );
}

