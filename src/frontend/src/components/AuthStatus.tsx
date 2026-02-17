import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from './ui/button';
import { LogIn, LogOut, MessageCircle } from 'lucide-react';

export function AuthStatus() {
  const { identity, login, clear, isLoggingIn, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/chat-logo.dim_256x256.png" 
            alt="Chat Logo" 
            className="w-10 h-10"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Chat
            </h1>
            <p className="text-xs text-muted-foreground">Connect and converse</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">Signed in</span>
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {identity.getPrincipal().toString().slice(0, 20)}...
                </span>
              </div>
              <Button
                onClick={clear}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={login}
              disabled={isLoggingIn || loginStatus === 'initializing'}
              size="sm"
              className="gap-2"
            >
              <LogIn className="w-4 h-4" />
              {isLoggingIn ? 'Signing in...' : 'Sign in'}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

