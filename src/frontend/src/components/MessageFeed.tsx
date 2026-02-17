import { useEffect, useRef } from 'react';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { MessageCircle } from 'lucide-react';
import type { ChatMessage } from '../backend';
import { useScrollAnchor } from '../hooks/useScrollAnchor';

interface MessageFeedProps {
  messages: ChatMessage[];
}

export function MessageFeed({ messages }: MessageFeedProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { shouldAutoScroll, handleScroll } = useScrollAnchor(messages.length);

  useEffect(() => {
    if (shouldAutoScroll && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, shouldAutoScroll]);

  if (messages.length === 0) {
    return (
      <Card className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-3 max-w-sm">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">No messages yet</h3>
            <p className="text-sm text-muted-foreground">
              Be the first to start the conversation!
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex-1 flex flex-col min-h-0 shadow-warm">
      <ScrollArea 
        ref={scrollAreaRef}
        className="flex-1 p-4"
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} />
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const displayName = message.displayName || 'Anonymous';
  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const timestamp = new Date(Number(message.timestamp) / 1_000_000);
  const timeString = timestamp.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div className="flex gap-3 animate-fade-in">
      <Avatar className="w-10 h-10 border-2 border-primary/20">
        <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 space-y-1">
        <div className="flex items-baseline gap-2">
          <span className="font-semibold text-sm">{displayName}</span>
          <span className="text-xs text-muted-foreground">{timeString}</span>
        </div>
        <div className="bg-muted/50 rounded-lg rounded-tl-none px-4 py-2.5">
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}

