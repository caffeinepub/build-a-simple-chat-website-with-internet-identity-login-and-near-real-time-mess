import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useSendMessage } from '../hooks/useSendMessage';
import { validateMessage } from '../lib/chatValidation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Send, LogIn, Loader2 } from 'lucide-react';

export function MessageComposer() {
  const { identity, login } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { mutate: sendMessage, isPending } = useSendMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateMessage(content);
    if (!validation.valid) {
      setError(validation.error || 'Invalid message');
      return;
    }

    sendMessage(
      { content: validation.trimmed! },
      {
        onSuccess: () => {
          setContent('');
          setError(null);
        },
        onError: (err) => {
          setError(err instanceof Error ? err.message : 'Failed to send message');
        }
      }
    );
  };

  if (!isAuthenticated) {
    return (
      <Card className="p-4 text-center space-y-3 shadow-warm">
        <p className="text-sm text-muted-foreground">
          Sign in to join the conversation
        </p>
        <Button onClick={login} size="sm" className="gap-2">
          <LogIn className="w-4 h-4" />
          Sign in
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-2 shadow-warm">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          placeholder="Type your message..."
          disabled={isPending}
          className="flex-1"
          maxLength={500}
        />
        <Button 
          type="submit" 
          disabled={isPending || !content.trim()}
          size="icon"
          className="shrink-0"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </Button>
      </form>
      {error && (
        <p className="text-sm text-destructive animate-fade-in">
          {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        {content.length}/500 characters
      </p>
    </Card>
  );
}

