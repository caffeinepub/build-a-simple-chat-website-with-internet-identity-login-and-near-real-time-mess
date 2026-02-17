import { useState } from 'react';
import { useCreateQuestion } from '../hooks/useCreateQuestion';
import { useSpeechToText } from '../hooks/useSpeechToText';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Mic, MicOff, Send, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const MAX_QUESTION_LENGTH = 500;

export function QAComposer() {
  const [content, setContent] = useState('');
  const createQuestion = useCreateQuestion();
  const { 
    isListening, 
    transcript, 
    isSupported, 
    error: sttError,
    startListening, 
    stopListening 
  } = useSpeechToText();

  // Update content when transcript changes
  useState(() => {
    if (transcript) {
      setContent(transcript);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    
    if (!trimmed || trimmed.length === 0) return;
    if (trimmed.length > MAX_QUESTION_LENGTH) return;

    try {
      await createQuestion.mutateAsync({ content: trimmed });
      setContent('');
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const remainingChars = MAX_QUESTION_LENGTH - content.length;
  const isOverLimit = remainingChars < 0;

  return (
    <Card className="p-4 space-y-3">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <Textarea
            value={isListening ? transcript : content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type in Nepali or use the microphone..."
            className="min-h-[100px] pr-12 resize-none"
            disabled={createQuestion.isPending || isListening}
          />
          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            {isSupported && (
              <Button
                type="button"
                size="icon"
                variant={isListening ? 'destructive' : 'outline'}
                onClick={toggleListening}
                disabled={createQuestion.isPending}
                className="h-8 w-8"
              >
                {isListening ? (
                  <MicOff className="h-4 w-4" />
                ) : (
                  <Mic className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        </div>

        {!isSupported && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Speech recognition is not supported in your browser. You can still type your questions.
            </AlertDescription>
          </Alert>
        )}

        {sttError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {sttError}. You can still type your questions.
            </AlertDescription>
          </Alert>
        )}

        {isListening && (
          <Alert>
            <Mic className="h-4 w-4 animate-pulse" />
            <AlertDescription>
              Listening... Speak in Nepali
            </AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <span className={`text-sm ${isOverLimit ? 'text-destructive' : 'text-muted-foreground'}`}>
            {remainingChars} characters remaining
          </span>
          <Button
            type="submit"
            disabled={
              createQuestion.isPending || 
              !content.trim() || 
              isOverLimit ||
              isListening
            }
            className="gap-2"
          >
            {createQuestion.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Ask Question
              </>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
