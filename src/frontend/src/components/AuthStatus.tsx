import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { LogIn, LogOut, MessageCircle } from 'lucide-react';
import { useGetCallerUserProfile } from '../hooks/useCallerUserProfile';

export function AuthStatus() {
  const { identity, login, clear, isLoggingIn, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
  const { data: userProfile } = useGetCallerUserProfile();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="/assets/generated/chat-logo.dim_256x256.png" 
            alt="Q&A Logo" 
            className="w-10 h-10"
          />
          <div>
            <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              Nepali Q&A
            </h1>
            <p className="text-xs text-muted-foreground">Ask anything in Nepali</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">
                  {userProfile?.name || 'Signed in'}
                </span>
                {!userProfile && (
                  <span className="text-xs text-muted-foreground">Setting up...</span>
                )}
              </div>
              <Button
                onClick={handleLogout}
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
