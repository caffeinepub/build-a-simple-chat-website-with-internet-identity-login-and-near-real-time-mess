import { useState } from 'react';
import { ChatPage } from './pages/ChatPage';
import { AIVideoPage } from './pages/AIVideoPage';
import { AuthStatus } from './components/AuthStatus';
import { Button } from './components/ui/button';
import { MessageCircle, Video } from 'lucide-react';

type View = 'chat' | 'video';

function App() {
  const [currentView, setCurrentView] = useState<View>('chat');

  return (
    <div className="min-h-screen flex flex-col bg-background relative overflow-hidden">
      {/* Subtle background pattern */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'url(/assets/generated/chat-pattern.dim_1600x900.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '800px 450px'
        }}
      />
      
      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <AuthStatus />
        
        {/* Navigation tabs */}
        <div className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-[73px] z-40">
          <div className="container mx-auto px-4">
            <div className="flex gap-2">
              <Button
                variant={currentView === 'chat' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('chat')}
                className="gap-2 rounded-b-none"
              >
                <MessageCircle className="w-4 h-4" />
                Chat
              </Button>
              <Button
                variant={currentView === 'video' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('video')}
                className="gap-2 rounded-b-none"
              >
                <Video className="w-4 h-4" />
                AI Video
              </Button>
            </div>
          </div>
        </div>

        <main className="flex-1 flex flex-col">
          {currentView === 'chat' ? <ChatPage /> : <AIVideoPage />}
        </main>
        
        <footer className="py-4 px-4 text-center text-sm text-muted-foreground border-t border-border/50">
          <p>
            © {new Date().getFullYear()}. Built with <span className="text-primary">♥</span> using{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
